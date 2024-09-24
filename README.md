# Git Commit Message Generator

This project provides a tool to automatically generate concise and informative commit messages for your Git repository using Groq SDK. It extracts the core modifications from the diff and formats them into a commit message following the Git conventional commits pattern.

## Usage

1. Install this lib with npm `npm install -g git-commit-groc`.
2. Add your Groq API key to your environment variables as `GROQ_API_KEY`.
3. Run with the following command: `git-commit-groc`. You can optionally specify a Groq model using the `-m` or `--model` flag, e.g., `git-commit-groc -m llama3-groq-70b-8192-tool-use-preview`.

## How it works

1. The script checks if it's running inside a Git repository.
2. It then fetches the staged changes using `git diff --staged`.
3. A prompt is generated based on the diff, including guidelines for creating a good commit message.
4. The prompt is sent to the Groq SDK for completion.
5. The generated commit message is parsed from the Groq SDK response.
6. Finally, the commit message is used to commit the changes using `git commit -m`.

## Dependencies

- `yargs`: For parsing command line arguments.
- `child_process`: For executing Git commands.
- `groq-sdk`: For interacting with the Groq AI model to generate commit messages.
- `jsonrepair`: For repairing potentially malformed JSON responses from the Groq SDK.

## Contributing

If you have any suggestions or improvements, feel free to open an issue or submit a pull request.
