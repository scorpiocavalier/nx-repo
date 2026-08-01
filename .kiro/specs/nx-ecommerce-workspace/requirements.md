# Requirements Document

## Introduction

This document defines the requirements for an Nx monorepo workspace designed to host multiple applications and reusable feature libraries. The first application is an ecommerce platform selling 3D printed products. The workspace leverages Nx Cloud's free tier for distributed caching and task execution. The frontend uses the latest Angular with Vite as the build tool, the backend uses the latest Java Spring Boot, and shared UI components live in a dedicated library using Storybook with AnalogJS's Vitest plugin.

## Glossary

- **Workspace**: The Nx monorepo root that contains all applications, libraries, and configuration files
- **Nx_Cloud**: Nx's remote caching and distributed task execution service (free tier)
- **App**: A deployable application within the Nx workspace (located in the apps folder)
- **Library**: A reusable code package within the Nx workspace (located in the libs folder)
- **Ecommerce_App**: The Angular-based frontend application for selling 3D printed products
- **Backend_API**: The Java Spring Boot backend application providing REST APIs for the ecommerce platform
- **Shared_UI_Library**: A reusable Angular component library in the libs folder containing shared UI components
- **Storybook**: A tool for developing and documenting UI components in isolation
- **AnalogJS_Vitest_Plugin**: A Vitest plugin from the AnalogJS project that enables Vitest-based testing for Angular components
- **Vite**: A fast build tool used as the Angular application bundler
- **Generator**: An Nx code scaffolding tool that creates applications, libraries, and components from templates
- **pnpm**: A fast, disk space efficient package manager used as the workspace's primary package manager for dependency installation and script execution
- **Buildable_Library**: A library configured with a build target that produces compiled intermediate output (JavaScript, type definitions, and a package.json) to a dist directory, enabling downstream consumers to reference pre-built artifacts instead of compiling from source
- **GitHub_Actions**: GitHub's built-in CI/CD platform that executes workflow files defined in `.github/workflows`, providing unlimited CI minutes for public repositories
- **nx-set-shas**: A GitHub Action provided by Nrwl that determines the correct base and head SHAs for `nx affected` commands in CI, ensuring only projects affected by a pull request's changes are built, tested, and linted

## Requirements

### Requirement 1: Workspace Initialization

**User Story:** As a developer, I want an Nx monorepo workspace initialized with proper structure, so that I can manage multiple applications and libraries in a single repository.

#### Acceptance Criteria

1. THE Workspace SHALL contain an `apps` folder for hosting deployable applications
2. THE Workspace SHALL contain a `libs` folder for hosting reusable libraries
3. THE Workspace SHALL include an `nx.json` configuration file that defines task runner options, cacheable operations, and target defaults for build, serve, test, and lint targets
4. THE Workspace SHALL include a root `package.json` that lists `nx`, `@nx/workspace`, and plugin packages for Angular, Vite, and Java as devDependencies, and defines scripts for running build, serve, test, and lint tasks via Nx
5. THE Workspace SHALL include a `tsconfig.base.json` that defines shared `compilerOptions` and a `paths` object for mapping library imports across projects
6. THE Workspace SHALL include Nx Cloud configuration with a valid access token in `nx.json` to enable remote caching
7. THE Workspace SHALL use pnpm as the package manager for dependency installation and script execution
8. THE Workspace SHALL include a `pnpm-workspace.yaml` file at the repository root that defines the workspace packages structure
9. THE root `package.json` SHALL include a `packageManager` field specifying the pnpm version used by the Workspace

### Requirement 2: Nx Cloud Integration

**User Story:** As a developer, I want Nx Cloud's free tier connected to the workspace, so that I can benefit from remote caching and faster CI builds.

#### Acceptance Criteria

1. THE Workspace SHALL include a valid Nx_Cloud access token in the `nx.json` file under the `nxCloudAccessToken` property
2. WHEN a task has been previously executed with identical inputs, THE Nx_Cloud SHALL serve the cached result instead of re-executing the task, and the task output SHALL indicate a remote cache hit
3. WHEN a developer runs `nx connect`, THE Workspace SHALL authenticate with Nx_Cloud and confirm successful connection by displaying a confirmation message and persisting the access token in `nx.json`
4. IF Nx_Cloud is unreachable during task execution, THEN THE Workspace SHALL fall back to local task execution and display a warning indicating that remote caching is unavailable
5. IF the configured Nx_Cloud access token is invalid, THEN THE Workspace SHALL display an error message indicating authentication failure and proceed with local task execution

### Requirement 3: Angular Frontend Application

**User Story:** As a developer, I want an Angular frontend application configured with Vite, so that I can build a fast ecommerce storefront for 3D printed products.

#### Acceptance Criteria

1. THE Ecommerce_App SHALL be generated using Angular version 18 or higher with standalone components enabled
2. THE Ecommerce_App SHALL use Vite as the build tool via the `@analogjs/vite-plugin-angular` or Angular's native Vite builder
3. THE Ecommerce_App SHALL reside in the `apps/ecommerce` directory within the Workspace
4. WHEN a developer runs `nx serve ecommerce`, THE Ecommerce_App SHALL start a development server with hot module replacement enabled, reflecting saved file changes in the browser without a full page reload
5. THE Ecommerce_App SHALL include a production build configuration that outputs minified and tree-shaken bundles to the `dist/apps/ecommerce` directory
6. THE Ecommerce_App SHALL use Vitest as the unit test runner via the AnalogJS_Vitest_Plugin
7. WHEN a developer runs `nx test ecommerce`, THE Ecommerce_App SHALL execute the Vitest test suite and report pass or fail results to the terminal

### Requirement 4: Spring Boot Backend Application

**User Story:** As a developer, I want a Java Spring Boot backend application, so that I can provide REST APIs for the ecommerce platform.

#### Acceptance Criteria

1. THE Backend_API SHALL be generated using Java 17 or later and the current stable release of Spring Boot 3.x
2. THE Backend_API SHALL reside in the `apps/api` directory within the Workspace
3. THE Backend_API SHALL include a Gradle build configuration with Nx targets for build, serve, and test defined in the project's `project.json` file, delegating execution to Gradle tasks
4. WHEN a developer runs the serve command for the Backend_API, THE Backend_API SHALL start an embedded web server on port 8080 by default, configurable via an application property or environment variable
5. THE Backend_API SHALL include a production build configuration that produces a single executable JAR file in the project's build output directory
6. THE Backend_API SHALL expose a health-check endpoint at `/actuator/health` that returns an HTTP 200 response when the application is running
7. IF the configured port is already in use when the serve command is executed, THEN THE Backend_API SHALL fail to start and display an error message indicating the port conflict
8. WHEN a developer runs the test command for the Backend_API, THE Backend_API SHALL execute unit tests using the Spring Boot test framework and report results through Nx

### Requirement 5: Shared UI Library

**User Story:** As a developer, I want a shared UI component library, so that I can reuse common UI components across multiple frontend applications.

#### Acceptance Criteria

1. THE Shared_UI_Library SHALL reside in the `libs/shared/ui` directory within the Workspace
2. THE Shared_UI_Library SHALL be an Angular library with standalone components and a public API entry point (`index.ts`) that exports all available components
3. THE Shared_UI_Library SHALL be importable by any frontend App in the Workspace via a TypeScript path mapping defined in `tsconfig.base.json`
4. WHEN a developer runs the Generator for the Shared_UI_Library, THE Generator SHALL create a standalone component file, a corresponding unit test file, and add the component's export to the public API entry point
5. WHEN a component is added to the Shared_UI_Library and exported from the public API entry point, THE Workspace SHALL make the component available to all frontend applications without requiring changes to path mappings or application-level configuration
6. THE Shared_UI_Library SHALL use Vitest as the unit test runner via the AnalogJS_Vitest_Plugin

### Requirement 6: Storybook Integration

**User Story:** As a developer, I want Storybook configured for the shared UI library, so that I can develop and document components in isolation.

#### Acceptance Criteria

1. THE Shared_UI_Library SHALL include a Storybook configuration that enables building and serving stories without additional manual setup beyond dependency installation
2. WHEN a developer runs the Storybook serve command, THE Workspace SHALL start a Storybook development server within 60 seconds and display all components that have a corresponding `.stories.ts` file in the Shared_UI_Library
3. THE Shared_UI_Library SHALL use the AnalogJS_Vitest_Plugin for running Storybook interaction tests
4. WHEN a new component is created in the Shared_UI_Library using the component generator, THE Generator SHALL create a co-located Storybook story file containing at least one default story that renders the component
5. THE Storybook configuration SHALL render Angular standalone components without requiring an NgModule declaration
6. IF the Storybook development server fails to start, THEN THE Workspace SHALL display an error message indicating the cause of the failure and exit with a non-zero status code
7. WHEN a developer runs the Storybook interaction test command, THE Workspace SHALL execute all interaction tests defined in story files using the AnalogJS_Vitest_Plugin and report pass or fail results for each test

### Requirement 7: Testing Infrastructure

**User Story:** As a developer, I want a unified testing setup using Vitest, so that I can run fast unit tests across all frontend projects.

#### Acceptance Criteria

1. THE Workspace SHALL use Vitest as the unit test runner for all Angular-based projects
2. THE Workspace SHALL integrate the AnalogJS_Vitest_Plugin for Angular component testing support
3. WHEN a developer runs the test command at the workspace root, THE Workspace SHALL execute tests for all projects affected by changes compared to the base branch
4. WHEN a developer runs the test command for a specific project, THE Workspace SHALL execute only that project's tests in isolation without requiring other projects to be built or tested first
5. IF a test fails, THEN THE Workspace SHALL report the failure with the file path, test name, expected value, and received value, and exit with a non-zero exit code
6. WHEN tests are executed for a project whose test results are already cached by Nx Cloud, THE Workspace SHALL retrieve the cached results instead of re-running the tests
7. IF the remote cache is unavailable, THEN THE Workspace SHALL execute the tests locally and report results without failure due to cache unavailability

### Requirement 8: Multi-Application Scalability

**User Story:** As a developer, I want the workspace structured for multiple applications, so that I can add new apps and libraries without restructuring.

#### Acceptance Criteria

1. WHEN a developer runs an Nx Generator to create a new application, THE Workspace SHALL produce a buildable and servable project in the `apps` folder without requiring changes to existing projects
2. WHEN a developer runs an Nx Generator to create a new library, THE Workspace SHALL produce a buildable project in the `libs` folder without requiring changes to existing projects
3. IF a project imports from another project that violates the configured dependency constraints, THEN THE Workspace SHALL produce a lint error identifying the violating import
4. WHEN a new project is added to the `apps` or `libs` folder and the developer runs `nx graph`, THE Workspace SHALL include the new project and its dependencies in the dependency graph without manual registration
5. THE Workspace SHALL support running tasks only for affected projects relative to the base branch defined in `nx.json` using the `nx affected` command

### Requirement 9: Build and Task Orchestration

**User Story:** As a developer, I want Nx to orchestrate builds respecting project dependencies, so that I can build and deploy projects efficiently.

#### Acceptance Criteria

1. WHEN a build command is executed, THE Workspace SHALL resolve the project dependency graph and build projects in topological order such that no project is built before all of its declared dependencies have completed successfully
2. WHEN a task completes successfully, THE Workspace SHALL cache the task outputs locally, keyed by the hash of declared task inputs including source files, configuration files, and dependency outputs
3. WHEN a subsequent task execution matches a cached input hash, THE Workspace SHALL restore the cached outputs and skip re-execution
4. WHEN multiple tasks with no direct or transitive dependency relationship are identified, THE Workspace SHALL execute them in parallel up to the number of available CPU cores or the configured `--parallel` limit, whichever is lower
5. THE Workspace SHALL define task pipelines in `nx.json` specifying dependency relationships between targets
6. IF a task fails during an orchestrated build, THEN THE Workspace SHALL cancel all dependent downstream tasks, allow independent in-progress tasks to complete, and report which task failed with its exit code
7. WHEN Nx Cloud is connected, THE Workspace SHALL distribute task execution across agents registered in the Nx Cloud workspace using the free tier
8. IF Nx Cloud becomes unreachable during task execution, THEN THE Workspace SHALL fall back to local execution and local caching for remaining tasks without failing the build

### Requirement 10: Incremental Builds

**User Story:** As a developer, I want libraries configured as buildable with incremental compilation, so that downstream consumers use pre-built artifacts and only changed libraries are rebuilt.

#### Acceptance Criteria

1. THE Shared_UI_Library SHALL be configured as a buildable library that produces compiled intermediate output to a designated `dist/libs/shared/ui` directory when the build target is executed
2. WHEN a library is configured as buildable, THE Workspace SHALL generate a `package.json` and compiled output for that library so downstream consumers can reference pre-built artifacts instead of compiling from source
3. WHEN a subsequent build is triggered and a buildable library's source files have not changed since the last successful build, THE Workspace SHALL skip rebuilding that library and use the previously compiled output
4. WHEN a buildable library's source files have changed since the last successful build, THE Workspace SHALL rebuild only that library and any libraries that directly depend on the changed library's output
5. WHEN the Ecommerce_App build target is executed, THE Ecommerce_App SHALL consume the pre-built artifacts from the Shared_UI_Library's output directory rather than compiling the library source files directly
6. WHEN the Storybook serve or build command is executed, THE Storybook configuration SHALL reference the pre-built artifacts from the Shared_UI_Library's output directory instead of recompiling library source files
7. WHEN a CI pipeline executes a build and Nx_Cloud remote caching is enabled, THE Workspace SHALL restore cached build artifacts for unchanged libraries from Nx_Cloud and rebuild only libraries whose source files have changed relative to the cached state
8. THE Backend_API SHALL organize its codebase into Gradle subprojects so that Gradle incremental compilation rebuilds only subprojects whose source files have changed since the last successful compilation
9. WHEN a new feature library is generated using an Nx Generator, THE Generator SHALL configure the library as buildable by default, including a build target that produces compiled output to the `dist/libs` directory

### Requirement 11: GitHub CI/CD Pipeline

**User Story:** As a developer, I want a GitHub Actions CI/CD pipeline integrated with Nx Cloud, so that I can automatically validate affected projects on every pull request with fast, cache-optimized builds.

#### Acceptance Criteria

1. THE Workspace SHALL be hosted as a public GitHub repository to benefit from unlimited GitHub_Actions CI/CD minutes
2. THE Workspace SHALL include a GitHub_Actions workflow file at `.github/workflows/ci.yml` that triggers on pull requests and pushes to the main branch
3. WHEN the CI pipeline is triggered, THE GitHub_Actions workflow SHALL use the nx-set-shas action to determine the correct base and head SHAs for affected project detection
4. WHEN the CI pipeline executes, THE GitHub_Actions workflow SHALL run build, test, and lint tasks only for projects affected by the changes using the `nx affected` command
5. THE GitHub_Actions workflow SHALL configure a Node.js environment for building and testing the Ecommerce_App and a Java environment with Gradle for building and testing the Backend_API
6. WHEN the CI pipeline executes with Nx_Cloud connected, THE GitHub_Actions workflow SHALL leverage Nx_Cloud remote caching to skip tasks whose inputs have not changed since the last cached execution
7. THE Workspace SHALL have the Nx Cloud GitHub App installed to provide pull request build status comments and cache statistics on each PR
8. THE GitHub repository SHALL enforce branch protection rules on the main branch requiring the CI workflow to pass before a pull request can be merged
9. IF the CI pipeline fails due to a build, test, or lint error, THEN THE GitHub_Actions workflow SHALL exit with a non-zero status code and report the failing task name in the workflow summary
