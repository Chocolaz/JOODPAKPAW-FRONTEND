# Deployment and GitHub CI/CD Analysis for Joodpakpaw Frontend

This document provides an analysis of the deployment strategy and GitHub CI/CD pipeline for the Joodpakpaw frontend application, based on the provided configuration files.

## 1. Project Overview

The Joodpakpaw frontend is a Next.js application. It is containerized using Docker and deployed to a Virtual Machine (VM). The CI/CD process leverages GitHub Actions with a self-hosted runner to automate deployments upon pushes to the `main` branch.

## 2. Deployment Process (Manual/Scripted via `deploy.sh`)

The `deploy.sh` script outlines the core steps for updating the frontend on the target VM:

-   **Code Synchronization**: Fetches the latest code from `origin/main` and performs a hard reset, ensuring the VM's repository is identical to the `main` branch.
-   **Container Management**:
    -   Shuts down existing Docker containers defined in `docker-compose.yml`.
    -   Rebuilds the Docker image for the `frontend` service using `docker-compose.yml` and `Dockerfile`. The `--no-cache` flag ensures a fresh build, pulling the latest base images and dependencies.
    -   Starts the new Docker containers in detached mode (`-d`).
-   **Cleanup**: Prunes unused Docker objects (`docker system prune -f`) to free up disk space.

This script acts as a robust mechanism for ensuring the deployed application is always running the latest `main` branch code in a clean Docker environment.

## 3. Docker Containerization (`Dockerfile` and `docker-compose.yml`)

### `Dockerfile`

The `Dockerfile` defines a multi-stage build process for the Next.js application:

-   **Stage 1: `builder`**:
    -   Uses `node:20-alpine` as the base image for building.
    -   Copies `package.json` and `package-lock.json` and installs dependencies using `npm install --legacy-peer-deps`. This step is optimized by caching node modules.
    -   **Environment Variables**: Crucially, build-time environment variables (`NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) are passed as `ARG` and then set as `ENV`. For Next.js, `NEXT_PUBLIC_` variables are inlined into the JavaScript bundle during the `npm run build` process, making them accessible in the client-side code.
    -   Copies the entire project source code.
    -   Executes `npm run build` to create the production build artifacts.
-   **Stage 2: `runner`**:
    -   Uses a lean `node:20-alpine` image for the final production environment.
    -   Sets `NODE_ENV` to `production`.
    -   Copies the entire `/app` directory from the `builder` stage, which includes the `node_modules` and the `.next` build output. While functional, it could be further optimized by only copying necessary build artifacts (`.next`, `public`, `node_modules` from a pruned `package.json`) to minimize the final image size.
    -   Exposes port `3000`.
    -   Defines the command to start the Next.js server (`npm run start`).

### `docker-compose.yml`

The `docker-compose.yml` orchestrates the `frontend` service:

-   **Build Configuration**: Points to the `Dockerfile` in the current directory (`context: .`) and passes the necessary public environment variables as `args` during the image build process.
-   **Container Name**: Assigns a static name `joodpakpaw_frontend`.
-   **Port Mapping**: Maps the container's port `3000` to the host's port `3000`.
-   **Environment Variables**: Utilizes `.env.production` to supply runtime environment variables to the container. This is important for sensitive keys or runtime configurations not inlined during build.
-   **Network**: Connects to an external Docker network named `catbnb-network`, suggesting other services (e.g., backend API) might reside on the same network.
-   **Restart Policy**: `restart: always` ensures the container automatically restarts if it crashes or the Docker daemon restarts.

## 4. GitHub CI/CD Pipeline (`.github/workflows/deploy.yml`)

The GitHub Actions workflow automates the deployment process:

-   **Workflow Trigger**: Automatically starts when code is `push`ed to the `main` branch.
-   **Self-Hosted Runner**: The `runs-on: self-hosted` configuration is key. This means there's a GitHub Actions runner application installed and configured on a dedicated server, likely the target VM itself or a server with SSH access to it. This provides direct control over the deployment environment.
-   **Steps**:
    1.  **Checkout repo**: The `actions/checkout@v4` action clones the repository onto the self-hosted runner.
    2.  **Deploy via SSH**: The `appleboy/ssh-action@v0.1.8` is used to establish an SSH connection to the deployment VM:
        -   **Host**: Connects to the VM at `10.4.88.39`.
        -   **Authentication**: Uses `sysadmin` username and a secure `VM_SSH_KEY` stored as a GitHub Secret, preventing sensitive credentials from being exposed in the workflow file.
        -   **Execution**: Once connected, it navigates to the application directory (`~/JOODPAKPAW-FRONTEND`) and executes the `deploy.sh` script.

## 5. Next.js Configuration (`next.config.ts`)

-   **Base Path & Asset Prefix**: `next.config.ts` sets `basePath` and `assetPrefix` to `process.env.NEXT_PUBLIC_BASE_PATH`, defaulting to `/capstone25/cp25nk2`. This is crucial for deploying Next.js applications under a subpath (e.g., behind a reverse proxy) and ensures all assets are correctly referenced.
-   **Image Optimization**: Specifies `domains` for Next.js Image component optimization.
-   **Webpack Customization**: Includes custom Webpack rules for handling SVG files (using `@svgr/webpack` for React components) and excluding specific files from a default file-loader rule.

## 6. Summary of Flow

1.  A developer pushes code to the `main` branch of the GitHub repository.
2.  The `deploy.yml` GitHub Actions workflow is triggered.
3.  A `self-hosted` GitHub Actions runner picks up the job.
4.  The runner checks out the latest code from the `main` branch.
5.  The runner establishes an SSH connection to the deployment VM (`10.4.88.39`) using an SSH key secret.
6.  On the VM, the `deploy.sh` script is executed.
7.  `deploy.sh` pulls the latest code, takes down the old frontend container, rebuilds the Docker image (passing necessary build arguments for Next.js public environment variables), starts a new container, and prunes old Docker images.
8.  The Next.js application runs inside the Docker container, serving on port 3000.

## 7. Potential Areas for Improvement

-   **Docker Image Size Optimization**: The `Dockerfile` copies the entire `/app` directory from the `builder` stage to the `runner` stage. For Next.js, it's more efficient to only copy the `.next` folder, `public` folder, and `node_modules` (after pruning dev dependencies) to significantly reduce the final image size and build times.
-   **Environment Variable Management**: While `.env.production` is used, ensure sensitive variables are indeed only supplied at runtime and not accidentally inlined if they don't start with `NEXT_PUBLIC_`. For `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, consider if it's truly a build-time variable or if it could be a runtime variable supplied via `.env.production` to avoid rebuilding the image if only this key changes.
-   **Deployment Rollback**: The current `deploy.sh` script does not include any rollback mechanism. In case of a failed deployment, there's no automated way to revert to the previous working version.
-   **Health Checks**: Implement more robust health checks within the Docker Compose setup to ensure the application is truly up and running correctly after deployment before marking the deployment as successful.
-   **Blue/Green or Canary Deployments**: For production environments, consider more advanced deployment strategies (e.g., blue/green deployments) to minimize downtime and risk during updates.
-   **GitHub Actions Best Practices**: While `appleboy/ssh-action` is effective, for more complex scenarios, dedicated deployment tools or CI/CD platforms might offer more features (e.g., deployment tracking, release management).
-   **Base Path in Dockerfile vs next.config.ts**: The `NEXT_PUBLIC_BASE_PATH` is passed as a build argument to the Dockerfile and also defined in `next.config.ts`. This duplication is fine as it ensures it's inlined correctly, but consistency across how it's defined and used is important.
