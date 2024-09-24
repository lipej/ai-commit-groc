#!/usr/bin/env node
const yargs = require("yargs");
const { execSync } = require("child_process");
const Groq = require("groq-sdk");
const { jsonrepair } = require("jsonrepair");

const options = yargs
  .option("m", {
    alias: "model",
    describe: "Groc model to generate the commit message",
    type: "string",
    demandOption: false,
  })
  .help(true).argv;

(async () => {
  if (
    execSync("git rev-parse --is-inside-work-tree", { encoding: "utf-8" }) ===
    "true"
  ) {
    console.error("not a git repo");
    process.exit(1);
  }

  const diff = execSync("git diff --staged").toString();

  if (!diff) {
    console.error("no staged changes");
    process.exit(1);
  }

  const prompt = `As a git commit message author, your task is to transform the given diff into a concise and informative commit message.

  <diff> ${diff} </diff>
  Important guidelines:

  All text should be in lowercase
  Use git conventional commits (follow the pattern: <type>: <subject>).
  The message should have max 50 chars.
  Carefully examine the diff and extract the core of the modification
  Format your message as a JSON object with only the key "commit" and the value as the commit message. For example: { "commit": "fix: typo in the README.md" }
  Do not include any other keys or values in the JSON object, such as explanations or thoughts, just the commit message.
`;

  const groq = new Groq();
  const result = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    model: options.model || "llama3-groq-70b-8192-tool-use-preview",
    temperature: 0,
    max_tokens: 1024,
    top_p: 0.65,
    stream: false,
    stop: null,
  });

  const { commit } = JSON.parse(jsonrepair(result.choices[0].message.content));

  console.info(`Commit message: ${commit}`);

  execSync(`git commit -m "${commit}"`);
})();
