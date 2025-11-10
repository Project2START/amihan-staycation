1. src/

Main source directory — all TypeScript code lives here.

2. app.ts

Configures the Express application (middleware, routes, etc.), but does not start the server.

3. server.ts

Starts the HTTP server and handles startup-level concerns (like DB connection).

4. config/

Central place for environment variables and external configuration (DB, Redis, etc.)

5. modules/

💡 Each module represents a feature domain — like user, product, or order.
Every module is self-contained (its own model, controller, routes, etc.), which makes scaling, testing, and teamwork easier.

6. middleware/

Reusable middleware functions, e.g., authentication, error handling.

7. utils/

Helper or utility functions that can be used across modules.

8. types/

Custom TypeScript definitions and Express augmentations.

9. tests/

Contains unit and integration tests (using Jest, Mocha, or Supertest).

10. Root-Level Files

| File                           | Purpose                        |
| ------------------------------ | ------------------------------ |
| `.env`                         | Private environment variables  |
| `.env.example`                 | Example env for new developers |
| `tsconfig.json`                | TypeScript configuration       |
| `.eslintrc.js` / `.prettierrc` | Linting & formatting rules     |
| `package.json`                 | Scripts, dependencies          |
| `README.md`                    | Project documentation          |
