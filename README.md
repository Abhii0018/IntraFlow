# IntraFlow

IntraFlow is a lightweight infrastructure dashboard for monitoring a Docker
environment. It combines a Terraform-managed Nginx deployment, an Express API,
and a responsive dashboard that reports container health, CPU usage, and memory
consumption.

## Features

- Live Docker container inventory and status
- CPU and memory monitoring from Docker statistics
- Search and filter controls for containers
- Infrastructure architecture overview
- Activity timeline for backend and Docker endpoint events
- Responsive dashboard layout with sidebar navigation
- Terraform configuration for the Nginx-hosted frontend

## Architecture

```text
Terraform -> Docker Engine -> Nginx -> website/index.html
                              ^
                              |
                    Express API (backend/)
```

The frontend calls the Express API at `http://localhost:3000/api`. The API
reads the current container and resource data from the local Docker CLI.

## Prerequisites

- Docker Engine
- Terraform
- Node.js 18 or newer
- npm

## Getting Started

### 1. Start the backend API

```bash
cd backend
npm install
npm start
```

The API listens on `http://localhost:3000`.

### 2. Serve the dashboard

The Terraform configuration runs Nginx on port `8080` and mounts the
`website/` directory into the container:

```bash
terraform init
terraform apply
```

Open [http://localhost:8080](http://localhost:8080) in a browser.

### 3. Run without Terraform

For frontend-only development, serve `website/` with any static file server,
for example:

```bash
cd website
python3 -m http.server 8080
```

The backend must still be running on port `3000` for live data.

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Checks API availability |
| `GET /api/containers` | Lists all Docker containers |
| `GET /api/stats` | Returns a current Docker statistics snapshot |

## Project Structure

```text
.
├── backend/              # Express API and Docker integration
├── website/              # Dashboard frontend
├── docker-compose.yml    # Container orchestration configuration
├── main.tf               # Terraform Docker resources
├── outputs.tf            # Terraform outputs
└── variables.tf          # Terraform variables
```

## Notes

- Terraform state files are intentionally ignored because they are local
  runtime data and may contain environment-specific details.
- The backend requires access to the Docker CLI and Docker daemon.
- This project currently uses the local Docker environment as its source of
  truth and does not infer historical metrics.
