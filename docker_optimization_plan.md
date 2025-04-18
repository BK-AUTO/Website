# Docker Compose Optimization Plan

## Goal

To optimize the Docker Compose setup for the BKAUTO project to improve flexibility, scalability, and ensure the database (`db`) service data persists independently of frontend (`frontend`) and backend (`backend`) service redeployments.

## Finalized Plan

1.  **Modify `docker-compose.yml`:**
    *   Map the named volume `bkauto` to the PostgreSQL data directory (`/var/lib/postgresql/data`) within the `db` service definition to ensure data persistence.
    *   Add a `healthcheck` to the `db` service using the `pg_isready` command to verify database readiness. Include appropriate `interval`, `timeout`, `retries`, and `start_period` values.
    *   Add a `healthcheck` to the `backend` service. A placeholder using `curl` to check a health endpoint (e.g., `http://localhost:6066/actuator/health`) will be added. **Note:** This command might need adjustment based on the actual health endpoint exposed by your backend application. Include appropriate `interval`, `timeout`, `retries`, and `start_period`.
    *   Update the `depends_on` section within the `backend` service definition to specify `condition: service_healthy` for the `db` service dependency. This ensures the backend only starts after the database is confirmed healthy.
    *   Ensure the top-level `volumes` section correctly defines the named volume: `bkauto: {}`.

2.  **Adopt Redeployment Strategy:**
    *   For updating only the frontend and backend services without restarting the database, use the command:
        ```bash
        docker-compose up -d --build --no-deps frontend backend
        ```
    *   The `--no-deps` flag is crucial here to prevent unnecessary restarts of the `db` service.

3.  **Implement Backup Strategy:**
    *   Recognize that volume persistence protects against container removal but not data corruption or server failure.
    *   Implement a regular backup process using the `pg_dump` utility executed against the running `db` container.
    *   Example `pg_dump` command:
        ```bash
        docker-compose exec -T db pg_dump -U postgres -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql
        ```
    *   Store these backups securely, ideally off-server.
    *   Use `psql` within the container to restore backups when needed.

## Plan Flowchart

```mermaid
graph TD
    A[User Request: Optimize Docker Compose] --> B{Analyze docker-compose.yml};
    B --> C[Identify Issues: DB Persistence, Resilience];
    C --> D[Plan: Use Named Volume 'bkauto' for DB data];
    C --> E[Plan: Add Healthchecks for DB & Backend];
    C --> F[Plan: Define Redeployment Strategy (`--no-deps`)];
    D & E & F --> G[Confirm Plan with User];
    G -- User Confirms --> H[Finalized Plan];
    H --> I{Offer to Save Plan?};
    I -- Yes --> J[Save Plan to Markdown];
    I -- No --> K[Proceed to Implementation];
    J --> K;
    K --> L[Suggest Switch to 'code' Mode];