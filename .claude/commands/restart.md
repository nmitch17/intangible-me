# Restart Dev Server
> Run the following commands to restart the development server.

## Run
1. Kill the development server running on port 3003 with: `lsof -ti:3003 | xargs kill -9 2>/dev/null || true`.
2. Run `rm -rf .next` to clear cache.
3. Run `PORT=3003 bun dev` to start the development server.
4. Wait for the server to start up.
5. Read the initial page load server logs.
6. If there are any errors, report them.

## Report
Output the following format:
✅ Restarted the development server in <time the server took to start up>.
<✅ or ❌: If no errors, respond with a positive message, if errors: respond with red 'x' and explain the errors in a succinct and comprehensive bullet list.>
🟢 Available at <server url>