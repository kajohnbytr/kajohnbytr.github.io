# React Bits MCP checklist

The React project and `components.json` registry are already prepared. Complete the client setup below once to let Codex browse and install React Bits components through the shadcn MCP server.

## One-time setup

- [x] Project converted to React + Vite.
- [x] Tailwind CSS configured.
- [x] `components.json` created.
- [x] React Bits registry added as `@react-bits`.
- [x] `@/*` import aliases configured in `jsconfig.json`.
- [ ] Open the Codex configuration file: `%USERPROFILE%\.codex\config.toml` on Windows or `~/.codex/config.toml` on macOS/Linux.
- [ ] Add the following configuration:

  ```toml
  [mcp_servers.shadcn]
  command = "npx"
  args = ["shadcn@latest", "mcp"]
  ```

- [ ] Save the file and completely restart Codex.
- [ ] Confirm that the `shadcn` MCP server appears in Codex and connects successfully.

## Verify React Bits access

- [ ] Ask Codex: `Show me the available backgrounds from the @react-bits registry.`
- [ ] Ask Codex to inspect a component before installing it.
- [ ] Install one small component as a test, for example: `Add FadeContent from React Bits to the About section.`
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Check desktop and mobile layouts before committing.

## GitHub Pages deployment

- [ ] Commit `package-lock.json` after dependencies are installed.
- [ ] Push the project to the `main` branch.
- [ ] In GitHub, open **Settings > Pages**.
- [ ] Set **Source** to **GitHub Actions** if it is not already selected.
- [ ] Open the **Actions** tab and confirm the deployment workflow succeeds.
- [ ] Visit `https://kajohnbytr.github.io/` and test navigation, certificates, and the contact form.

## Safe component workflow

- [ ] Review a component's dependencies and source before installation.
- [ ] Prefer components that support keyboard navigation and reduced motion.
- [ ] Avoid installing multiple background effects that compete for the same canvas or animation loop.
- [ ] Keep certificate and contact content in the existing React components when adding visual effects.
- [ ] Re-run the production build after every installed component.

## Useful prompts

- `Show me React Bits backgrounds that suit a cybersecurity portfolio.`
- `Add a subtle Dither background to the hero and respect prefers-reduced-motion.`
- `Use FadeContent for the certificate cards without delaying keyboard access.`
- `Review the installed React Bits components for mobile performance and accessibility.`
