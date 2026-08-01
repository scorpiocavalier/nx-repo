# Implementation Plan: Nx Ecommerce Workspace

## Overview

This plan implements an Nx monorepo workspace for an ecommerce platform selling 3D printed products. The workspace includes an Angular 18+ frontend with Vite, a Spring Boot 3.x backend with Gradle, a shared buildable UI library with Storybook, Nx Cloud integration, and full task orchestration with caching and incremental builds. Tasks are ordered so foundational configuration is established first, then individual projects are scaffolded, and finally cross-cutting concerns (module boundaries, pipelines, incremental builds) are wired together.

## Tasks

- [x] 1. Initialize workspace root and core configuration
  - [x] 1.1 Create Nx workspace with root configuration files
    - Initialize a new Nx 20+ workspace with `apps/` and `libs/` directory structure using pnpm as the package manager
    - Create `nx.json` with `targetDefaults` for build, serve, test, and lint targets, `namedInputs` (default, production, sharedGlobals), `defaultBase` set to main, and task pipeline `dependsOn` configuration
    - Create root `package.json` with devDependencies: `nx`, `@nx/workspace`, `@nx/angular`, `@nx/vite`, `@nx/gradle`, `@nx/eslint`, `@nx/eslint-plugin`, `@nx/storybook`, `@analogjs/vite-plugin-angular`, `@analogjs/vitest-angular`, `@analogjs/storybook-angular`, `vitest`, `vite`, `eslint`, `typescript-eslint`, `typescript`, `storybook`, `@storybook/angular`, `esbuild`
    - Add `packageManager` field to root `package.json` specifying the pnpm version (e.g., `"packageManager": "pnpm@9.x.x"`)
    - Define workspace scripts in `package.json` for build, serve, test, and lint via Nx
    - Create `pnpm-workspace.yaml` at the repository root defining workspace packages (`apps/*` and `libs/*`)
    - Use `pnpm install` for dependency installation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8, 1.9_

  - [x] 1.2 Create shared TypeScript configuration
    - Create `tsconfig.base.json` with shared `compilerOptions` (strict mode, ES2022 target, module resolution bundler)
    - Add `paths` mapping for `@workspace/shared/ui` pointing to `libs/shared/ui/src/index.ts`
    - _Requirements: 1.5, 5.3_

  - [x] 1.3 Configure Nx Cloud integration
    - Add `nxCloudAccessToken` property to `nx.json`
    - Configure tasks runner options with `nx-cloud` runner
    - Verify `nx connect` authenticates and persists the token
    - _Requirements: 1.6, 2.1, 2.3_

  - [x] 1.4 Configure ESLint with module boundary enforcement
    - Create root `eslint.config.ts` using ESLint flat config format (TypeScript)
    - Configure `@nx/enforce-module-boundaries` rule using flat config syntax
    - Define `depConstraints`: apps can depend on libs, libs can depend on libs, shared scope only depends on shared scope
    - _Requirements: 8.3_

- [x] 2. Checkpoint - Verify workspace root
  - Ensure all configuration files are valid JSON/TypeScript, ask the user if questions arise.

- [x] 3. Scaffold Angular frontend application
  - [x] 3.1 Generate the ecommerce Angular application
    - Create `apps/ecommerce` directory with Angular 18+ standalone component architecture
    - Create `project.json` with inferred targets from `@nx/angular` and `@nx/vite` plugins
    - Create `src/main.ts` with `bootstrapApplication()` entry point
    - Create `src/app/app.component.ts` as root standalone component
    - Create `src/app/app.routes.ts` with route definitions
    - Create `tsconfig.app.json` extending `tsconfig.base.json` (source paths — used by serve/dev)
    - Create `tsconfig.build.json` extending `tsconfig.app.json` with `paths` overridden to point to `dist/libs/shared/ui` (artifact paths — used by production build)
    - Create `tsconfig.spec.json` extending `tsconfig.base.json`
    - Wire `project.json` build target to use `tsconfig.build.json` and serve target to use `tsconfig.app.json` (tsconfig path-switching pattern)
    - Add project tags: `["type:app", "scope:ecommerce"]`
    - _Requirements: 3.1, 3.3, 10.5_

  - [x] 3.2 Configure Vite for the ecommerce application
    - Create `vite.config.ts` using `@analogjs/vite-plugin-angular` for dev server and production builds
    - Configure HMR for development mode
    - Configure production build to output minified and tree-shaken bundles to `dist/apps/ecommerce`
    - _Requirements: 3.2, 3.4, 3.5_

  - [x] 3.3 Configure Vitest for the ecommerce application
    - Create `vitest.config.ts` using `@analogjs/vitest-angular` plugin
    - Ensure `nx test ecommerce` executes Vitest and reports results
    - _Requirements: 3.6, 3.7_

- [x] 4. Scaffold Spring Boot backend application
  - [x] 4.1 Generate the API Spring Boot application
    - Create `apps/api` directory structure with Gradle build system
    - Create `build.gradle.kts` with Spring Boot 3.x plugin, Java 17+ toolchain, and dependencies (spring-boot-starter-web, spring-boot-starter-actuator, spring-boot-starter-test)
    - Create `settings.gradle.kts` with subproject declarations (core, web, persistence)
    - Create `src/main/java/.../Application.java` Spring Boot main class
    - Create `src/main/resources/application.yml` with server port (8080, configurable) and actuator health endpoint enabled
    - Add project tags: `["type:app", "scope:api"]`
    - _Requirements: 4.1, 4.2, 4.4, 4.6, 10.8_

  - [x] 4.2 Configure Nx-Gradle integration for the API
    - Create `project.json` with Nx targets delegating to Gradle tasks: build → `./gradlew :api:bootJar`, serve → `./gradlew :api:bootRun`, test → `./gradlew :api:test`
    - Configure build output to produce executable JAR
    - _Requirements: 4.3, 4.5, 4.8_

- [ ] 5. Scaffold shared UI library
  - [x] 5.1 Generate the shared UI buildable library
    - Create `libs/shared/ui` directory with Angular library structure
    - Create `project.json` with build, test, storybook, build-storybook, and lint targets
    - Create `ng-package.json` for Angular library package configuration
    - Create `src/index.ts` as public API entry point
    - Configure build target to output compiled artifacts (JS, type definitions, package.json) to `dist/libs/shared/ui`
    - Add project tags: `["type:lib", "scope:shared"]`
    - _Requirements: 5.1, 5.2, 10.1, 10.2_

  - [x] 5.2 Configure Vite and Vitest for the shared UI library
    - Create `vite.config.ts` for library build mode
    - Create `vitest.config.ts` using `@analogjs/vitest-angular` plugin
    - Ensure `nx test shared-ui` executes Vitest and reports results
    - _Requirements: 5.6, 7.1, 7.2_

  - [x] 5.3 Create an example standalone component with test and story
    - Create a sample standalone Angular component (e.g., `ButtonComponent`)
    - Create co-located `.spec.ts` unit test file
    - Create co-located `.stories.ts` Storybook story file with a default story
    - Export the component from `src/index.ts`
    - _Requirements: 5.4, 5.5, 6.4_

- [ ] 6. Configure Storybook integration
  - [ ] 6.1 Set up Storybook for the shared UI library
    - Create `.storybook/main.ts` using `@analogjs/storybook-angular` framework
    - Create `.storybook/preview.ts` with preview configuration
    - Configure Storybook to render standalone components without NgModule
    - Ensure `nx storybook shared-ui` starts the Storybook dev server
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ] 6.2 Configure Storybook interaction tests with AnalogJS Vitest plugin
    - Configure the AnalogJS Vitest plugin for Storybook interaction tests
    - Ensure interaction tests defined in story files can be executed and report pass/fail results
    - _Requirements: 6.3, 6.7_

- [ ] 7. Checkpoint - Verify all projects build and serve
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Configure build orchestration and caching
  - [ ] 8.1 Define task pipelines and caching in nx.json
    - Configure `targetDefaults.build.dependsOn: ["^build"]` for topological build order
    - Configure `inputs` and `outputs` for build, test, and lint targets
    - Set `cache: true` for build, test, and lint targets
    - Configure parallel execution settings
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 8.2 Configure incremental builds for the shared UI library
    - Ensure the ecommerce app's production build consumes pre-built artifacts from `dist/libs/shared/ui` via `tsconfig.build.json` path overrides (tsconfig path-switching pattern)
    - Ensure `nx serve ecommerce` resolves library source directly via `tsconfig.app.json` (no `^build` dependency on serve)
    - Ensure Storybook references pre-built artifacts from the shared UI library output directory
    - Verify that unchanged libraries are skipped on subsequent builds
    - _Requirements: 10.3, 10.4, 10.5, 10.6_

  - [ ] 8.3 Configure Nx Cloud distributed task execution
    - Verify Nx Cloud caching works for build and test targets (run twice, confirm cache hit)
    - Ensure graceful fallback to local execution when Nx Cloud is unreachable
    - Ensure invalid token produces error message and proceeds locally
    - _Requirements: 2.2, 2.4, 2.5, 9.7, 9.8, 10.7_

- [ ] 9. Configure multi-application scalability
  - [ ] 9.1 Verify generator support for new applications and libraries
    - Ensure running an Nx generator creates a new app in `apps/` without modifying existing projects
    - Ensure running an Nx generator creates a new buildable library in `libs/` with build target outputting to `dist/libs/<path>` and adds path mapping to `tsconfig.base.json`
    - _Requirements: 8.1, 8.2, 10.9_

  - [ ] 9.2 Configure affected commands and dependency graph
    - Verify `nx affected -t test` runs tests only for projects affected by changes
    - Verify `nx affected -t build` builds only affected projects
    - Verify `nx graph` includes all projects and their dependencies without manual registration
    - Configure `defaultBase` in `nx.json` for affected comparison
    - _Requirements: 7.3, 7.4, 8.4, 8.5_

- [ ] 10. Configure testing infrastructure
  - [ ] 10.1 Verify unified Vitest testing across frontend projects
    - Ensure `nx test ecommerce` runs Vitest in isolation without requiring other projects
    - Ensure `nx test shared-ui` runs Vitest in isolation without requiring other projects
    - Verify test failure output includes file path, test name, expected value, and received value
    - _Requirements: 7.4, 7.5_

  - [ ] 10.2 Verify test caching with Nx Cloud
    - Run tests twice and confirm cached results are served on second run
    - Verify local fallback when remote cache is unavailable
    - _Requirements: 7.6, 7.7_

- [ ] 11. Set up GitHub CI/CD pipeline
  - [ ] 11.1 Create GitHub Actions workflow file
    - Create `.github/workflows/ci.yml` workflow file
    - Configure workflow triggers for pull requests and pushes to the main branch
    - Define job structure with appropriate `runs-on` (ubuntu-latest)
    - Add checkout step using `actions/checkout@v4` with `fetch-depth: 0` for full git history (required for affected detection)
    - _Requirements: 11.1, 11.2_

  - [ ] 11.2 Configure nx-set-shas for affected detection
    - Add `nrwl/nx-set-shas@v4` action step to determine correct base and head SHAs
    - Configure the action to use the main branch as the default base
    - Wire the output SHAs into subsequent `nx affected` commands
    - _Requirements: 11.3_

  - [ ] 11.3 Set up dual environment (Node.js + Java)
    - Add `actions/setup-node@v4` step with Node.js version and pnpm caching
    - Add `actions/setup-java@v4` step with Java 17+ and Gradle distribution
    - Add `pnpm install` step for dependency installation
    - Ensure both environments are available for the affected task execution
    - _Requirements: 11.5_

  - [ ] 11.4 Configure affected task execution in CI
    - Add step to run `npx nx affected -t build --base=$NX_BASE --head=$NX_HEAD`
    - Add step to run `npx nx affected -t test --base=$NX_BASE --head=$NX_HEAD`
    - Add step to run `npx nx affected -t lint --base=$NX_BASE --head=$NX_HEAD`
    - Ensure workflow exits with non-zero status code on any task failure and reports the failing task name in the workflow summary
    - _Requirements: 11.4, 11.9_

  - [ ] 11.5 Integrate Nx Cloud remote caching in CI
    - Ensure `NX_CLOUD_ACCESS_TOKEN` is available as a GitHub Actions secret or environment variable
    - Verify that Nx Cloud caching is leveraged during CI runs to skip unchanged tasks
    - Add Nx Cloud connection verification step
    - _Requirements: 11.6_

  - [ ] 11.6 Install Nx Cloud GitHub App for PR comments
    - Document steps to install the Nx Cloud GitHub App on the repository
    - Configure the Nx Cloud workspace to post build status comments and cache statistics on pull requests
    - _Requirements: 11.7_

  - [ ] 11.7 Configure branch protection rules
    - Document branch protection rule configuration for the main branch
    - Require the CI workflow status check to pass before merging pull requests
    - Enable "Require branches to be up to date before merging" setting
    - _Requirements: 11.8_

- [ ] 12. Final checkpoint - Full workspace validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- No property-based tests are included because this feature is infrastructure configuration and workspace scaffolding — the acceptance criteria test file existence, external tool behavior, and specific error scenarios rather than pure functions with meaningful input variation.
- Each task references specific requirements for traceability.
- Checkpoints ensure incremental validation at key milestones.
- The workspace uses Nx Project Crystal (plugin-based target inference) so many targets are inferred from configuration files rather than explicitly declared.
- Gradle subprojects (core, web, persistence) enable incremental Java compilation at the module level.
- All frontend testing uses Vitest via `@analogjs/vitest-angular` for a unified test experience.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "5.2", "5.3"] },
    { "id": 4, "tasks": ["6.1", "6.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 6, "tasks": ["9.1", "9.2", "10.1", "10.2", "11.1"] },
    { "id": 7, "tasks": ["11.2", "11.3"] },
    { "id": 8, "tasks": ["11.4", "11.5"] },
    { "id": 9, "tasks": ["11.6", "11.7"] }
  ]
}
```
