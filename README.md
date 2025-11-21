# Bidora

![Project Logo](/public/img/logo.png)

Online Auctions

JavaScript techniques applied to implement the front-end functionality for an
online auction site. This is an auction site aiming for a trustworthy and
playful vibe. It is meant to be a way to sell off items you no longer have use
for, so that they can be used by someone else instead of being thrown away.

## Description

- A user with a stud.noroff.no email may register
- A registered user may login
- A registered user may logout
- A registered user may update their avatar
- A registered user may view their total credit, and they are given 1000
  credits to use on registration.
- A registered user may create a Listing with a title, deadline date, media gallery and description
- A registered user may add a Bid to another user’s Listing
- A registered user may view Bids made on a Listing
- An unregistered user may search through Listings

## Features

- Responsive design

## Tech Stack & Tools

- **HTML**
- **Vanilla JS**
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development.
- **ESLint** – Linting tool for identifying and fixing JavaScript code issues.
- **Prettier** – Code formatter for consistent style across files.
- **Husky** – Git hooks for enforcing code quality before commits and pushes.
- **Vitest** – Unit testing framework for modern JavaScript projects.
- **Playwright** – End-to-end testing framework for web apps.
- **Vite** - dev server and build tool
- **E2E (Playwright) note**: Test tool that verifies that items returned from the API are rendered into the page.

## Setup

Run these three commands to get started:

```bash
npm install
npm run dev
npm run build
```

Note: Tailwind utilities and CSS tokens live in `src/styles/globals.css` and the
Tailwind configuration is in `tailwind.config.js`.

## Environment variables & API keys

- Copy `.env.example` to `.env` and fill in any required values for local development.
- For Vite-based frontend code, prefix client-facing variables with `VITE_` (for
  example `VITE_API_KEY` and `VITE_API_BASE`) so they are available as
  `import.meta.env.VITE_API_KEY`.
- Do NOT commit your `.env` file. `.env` is included in `.gitignore` by default.

## Usage

### ESLint

- To check your code:

```bash
npm run lint
```

- To auto-fix safe problems across the project:

```bash
npm run lint:fix
```

- Useful alternatives:

```bash
# Run ESLint directly (useful for debugging or CI)
npx eslint . --ext .js,.mjs,.cjs

# Run the staged-file process (what pre-commit runs)
npx --no-install lint-staged
```

## Development

### Git hooks (Husky)

- Husky is installed and configured to run formatting and linting before commits.
- The hook runs in the environment of the committer; see Setup for install and start commands.
- The repository's pre-commit hook runs lint-staged (configured to run Prettier then eslint --fix on staged _.js files and Prettier on staged _.html files). lint-staged re-stages auto-fixed files so commits include the fixes; remaining lint errors will block the commit.

- Handy commands and tips:
  - To lint the whole project locally: `npm run lint`
  - To auto-fix safe problems across the project: `npm run lint:fix`
  - To run the same staged-file process manually: `npx --no-install lint-staged`
  - To bypass hooks temporarily (not recommended): `git commit --no-verify`

  ### Testing

  Overview
  - Unit tests: Vitest (fast, runs in Node and JSDOM where needed).
  - End-to-end tests: Playwright (automates a real browser to verify pages).

  Quick commands
  - Install dependencies (once):

  ```powershell
  npm install
  ```

  - Run Vitest in watch/dev mode (useful during development):

  ```powershell
  npm test
  ```

  - Run Vitest once (CI / non-interactive):

  ```powershell
  npx vitest run
  ```

  - Run Vitest with coverage:

  ```powershell
  npx vitest run --coverage
  ```

  - Run a single test file:

  ```powershell
  npx vitest run tests/formValidation.test.js
  ```

  - Run Playwright E2E tests (single run):

  ```powershell
  npm run e2e
  ```

  Playwright prerequisites & modes
  - Install Playwright browsers (one-time):

  ```powershell
  npx playwright install
  ```

  - By default the E2E suite runs headless; to run headed for debugging add
    Playwright flags in the test runner or run Playwright in headed mode.

  Running E2E against dev vs built preview
  - Against the dev server (fast feedback):

  ```powershell
  npm run dev   # in terminal A
  npm run e2e   # in terminal B
  ```

  - Against a production build preview (recommended for close-to-prod tests):

  ```powershell
  npm run build
  npx vite preview &
  npm run e2e
  ```

  Environment / API keys
  - Set `VITE_API_KEY` (and any other `VITE_` env vars) for E2E tests if the
    deployed API requires them. Locally, copy `.env.example` → `.env` and add
    the values. Netlify/CI must also define `VITE_API_KEY` in the project
    settings.

  Notes for Vitest discovery
  - Vitest is configured to exclude Playwright E2E tests and vendor tests
    in `node_modules` (see `vitest.config.js`). This prevents Vitest from
    attempting to load Playwright test files.

  CI recommendations
  - In CI (GitHub Actions / Netlify / other), run:

  ```yaml
  - name: Install
    run: npm ci

  - name: Build
    run: npm run build

  - name: Unit tests
    run: npm test --silent

  - name: E2E tests
    run: npm run e2e
  ```

  Troubleshooting
  - If Playwright tests fail with 401/No API key, ensure `VITE_API_KEY` is
    set in the environment used to run the tests.
  - If Vitest attempts to import unexpected files, check `vitest.config.js`
    `exclude` patterns.

## Live site

[Bidora](https://bidora.netlify.app/)

## Contributing / Contact

The project page is on [https://github.com/annikaeld/Bidora](https://github.com/annikaeld/Bidora). Raise an [issue](https://github.com/annikaeld/Bidora/issues) on the project page if you have any feedback.

[My Project Board](https://github.com/users/annikaeld/projects/6)

## Acknowledgements

Copilot was used to help me find bugs in my code and to chat about the problems I faced in my project.

[My LinkedIn page](https://www.linkedin.com/in/annika-eld%C3%B8y-6ba352198/)
