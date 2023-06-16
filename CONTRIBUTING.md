## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it

2. Work on your fork's `main` branch, then [open a PR](https://github.com/BWBama85/airline-club-plus/compare/). Please ensure the PR name follows the naming convention:

   `feat: some new feature`

   Replacing `feat` with `fix` or `bug` accordingly

## Developing

The development branch is `main`, and this is the branch that all pull
requests should be made against.

To develop locally:

1. Install [pnpm](https://pnpm.io/) 
   - DO NOT install pnpm a as npm's global dependency, we need pnpm to be able to link directly to your $PATH.
   - Recommended installation method is with corepack or with brew (on macOS)
   - If installed with brew, you might need to include the pnpm $PATH to your debugger
2. Install the dependencies with:

   ```
   pnpm i
   ```

3. Start developing and watch for code changes:

   ```
   pnpm dev
   ```

## Naming convention

### Files and directories

Any files that require attention for reading should be `UPPER_CASE`. Examples:

- README.md
- LICENSE
- SECURITY.md
- CONTRIBUTING.md

Directory and source file should use `kebab-case`, unless required by tooling. Examples:

- cli/plasmo/src/features/extension-devtools/plasmo-extension-manifest.ts

### Code

| Concept              | Naming convention       |
| -------------------- | ----------------------- |
| Local constants      | `UPPER_CASE`            |
| Enum namespace       | `PascalCase`            |
| Enum values          | `PascalCase`            |
| TS types             | `PascalCase`            |
| TS fields            | `camelCase`             |
| React component      | `PascalCase`            |
| React hook           | `camelCase`             |
| Local variable       | `camelCase`             |
| Unused argument      | `_paddedCamelCase`      |
| Template Placeholder | `__snake_case_padded__` |
| Functions            | `camelCase`             |
| API Routes           | `kebab-case`            |
