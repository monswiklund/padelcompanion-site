# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.15.3 create --template minimal --types ts --add eslint prettier tailwindcss="plugins:none" sveltekit-adapter="adapter:static" vitest="usages:unit" --install npm padelcompanion-svelte
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Backend

Refer to the backend directory for server logic.

Backend session storage:

- Default/`SESSION_STORE=auto`: use Postgres only when `DATABASE_URL` is set, otherwise file storage.
- `SESSION_STORE=postgres`: use `DATABASE_URL` or `PGHOST`/`PGUSER`/`PGPASSWORD`/`PGDATABASE`.
- `SESSION_STORE=file`: always use file storage, with optional `STORE_PATH`.
