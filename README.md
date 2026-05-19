# SimpleBlog

Full-stack blog app with an Express/Mongoose API and a Vite React frontend.

## Run on CodeSandbox

1. Import this Git repository into CodeSandbox.
2. Add these environment variables in CodeSandbox Secrets:
   - `MONGODB_URI`: your MongoDB Atlas `mongodb+srv://...` connection string
   - `MONGODB_DB`: `simple_blog`
   - `JWT_SECRET`: any long random string
3. Run:

```bash
npm start
```

The root `npm start` script starts the frontend on port `3000` and the backend on port `3001`. The frontend calls `/api`, and Vite proxies those requests to the backend.
