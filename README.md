# Nx Ecommerce Workspace

Nx monorepo workspace for an ecommerce platform selling 3D printed products.

## Nx Cloud Setup

The workspace is pre-configured for Nx Cloud remote caching and distributed task execution. To connect your workspace to Nx Cloud:

1. Run `npx nx connect` to authenticate and obtain a real access token
2. The command will update the `nxCloudAccessToken` in `nx.json` with your workspace token
3. Once connected, task results are cached remotely and shared across your team and CI

The current `nx.json` contains a placeholder token (`<your-nx-cloud-token>`). Replace it with a real token by running `nx connect` or by manually setting the token from your [Nx Cloud dashboard](https://cloud.nx.app).

### Behavior

- **Remote caching (Nx Replay):** Cache hits are served from the remote cache, skipping re-execution
- **Distributed task execution (Nx Agents):** Tasks can be distributed across CI agents
- **Graceful fallback:** If Nx Cloud is unreachable, tasks execute locally without failure
- **Invalid token:** An error message is displayed, and execution proceeds locally
