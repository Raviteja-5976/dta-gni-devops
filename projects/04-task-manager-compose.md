# Project 4 — Task Manager: A Multi-Container App with Docker Compose

**Session:** 3 — Docker Development Workflow
**Slides:** Session 3, slides 7–89 (concepts) and 90–100 (hands-on project)

## Purpose

Real applications are not a single container. They're a frontend, a backend, a
database and often more, each running independently and talking over a
network. This project answers three problems left open by Session 2:

1. **Slow development.** Rebuilding the image for every one-line change isn't
   development. *Bind mounts* let a container see your code live.
2. **Isolated containers.** The app and the database can't reach each other.
   *Docker networking* connects them by name.
3. **Unmanageable commands.** Running a network, a volume and two containers by
   hand is a fragile multi-step ritual. *Docker Compose* describes the whole
   application in one file and starts it with one command.

You finish with a working CRUD application, not just a demo.

## What you'll build

A **Task Manager** web app built with Streamlit and MySQL.

**Application features**

- Add a task
- List tasks
- Complete a task
- Delete a task

**Infrastructure requirements**

- An app container (Streamlit)
- A MySQL container
- A bind mount for live code changes
- A Docker network connecting them
- A named volume so data persists
- Everything defined in `compose.yaml`

Keep the UI simple. The Docker setup is what this project teaches.

## Architecture

```text
                 Browser
                    │
                    │ :8501
                    ▼
         ┌──────────────────────┐
         │ Streamlit container   │
         │ /app  ←  host folder  │  (bind mount)
         └──────────┬───────────┘
                    │
                    │ Docker network
                    ▼
         ┌──────────────────────┐
         │   MySQL container     │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ mysql-data (volume)   │
         └──────────────────────┘
```

## Prerequisites

- The Session 2 projects (1–3) completed
- Docker Desktop running

## Project structure

```text
task-manager/
├── app.py
├── requirements.txt
├── Dockerfile
└── compose.yaml
```

`requirements.txt`:

```text
streamlit
mysql-connector-python
```

## Build steps

### Phase 1 — A fast development loop with a bind mount

Run the app with your project folder mounted into the container:

```bash
# macOS / Linux
docker run -p 8501:8501 -v "$(pwd):/app" hello-user:2.0

# Windows PowerShell
docker run -p 8501:8501 -v "${PWD}:/app" hello-user:2.0
```

Change the title in `app.py` and save it:

```python
st.title("Docker Task Manager")
```

You didn't rebuild an image, push anything or recreate a container. The
container reads your files directly.

> **What "reloads" actually means:** by default Streamlit detects the change and
> shows a **"Source file changed"** prompt. Click **Rerun** or **Always rerun**.
> To rerun automatically, add `--server.runOnSave=true` to the `streamlit run`
> command.
>
> **On Windows and macOS**, file-change events from a bind mount sometimes don't
> reach the container, so nothing happens on save. If so, add
> `--server.fileWatcherType=poll`.

### Phase 2 — Connect two containers by hand

Do this manually once, so you understand what Compose automates later.

```bash
docker network create task-network

docker run -d \
  --name task-db \
  --network task-network \
  -e MYSQL_ROOT_PASSWORD=example \
  -e MYSQL_DATABASE=tasks \
  -v mysql-data:/var/lib/mysql \
  mysql:8

docker run -d \
  --name task-app \
  --network task-network \
  -p 8501:8501 \
  -v "$(pwd):/app" \
  hello-user:2.0
```

Containers on the same network reach each other **by container name**. From
the app, the database's address is `task-db:3306`, **not** `localhost`.

### Phase 3 — Build the application

**Configuration comes from environment variables**, never hardcoded:

```python
import os

db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
```

**The table:**

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);
```

You decide how the table gets created. There are two reasonable options:

- The app runs `CREATE TABLE IF NOT EXISTS ...` when it starts, or
- Mount a `.sql` file into MySQL's `/docker-entrypoint-initdb.d/` folder. The
  MySQL image runs these scripts once, on first initialisation of an empty volume.

**The four operations** (from the slides). Each write needs `commit()`:

```python
# Create
cursor.execute("INSERT INTO tasks (title) VALUES (%s)", (title,))
connection.commit()

# Read
cursor.execute("SELECT id, title, completed FROM tasks")
tasks = cursor.fetchall()

# Complete
cursor.execute("UPDATE tasks SET completed = TRUE WHERE id = %s", (task_id,))
connection.commit()

# Delete
cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
connection.commit()
```

Wiring these into a Streamlit UI is your part of the exercise.

> **Handle "database not ready."** On first start, MySQL takes a while to
> accept connections. Your app should retry its connection for a short period
> instead of crashing on the first attempt.

### Phase 4 — Describe it all with Compose

Replace the manual commands with one file. `compose.yaml`:

```yaml
services:
  app:
    build: .
    ports:
      - "8501:8501"
    volumes:
      - .:/app
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: tasks
      DB_USER: root
      DB_PASSWORD: example
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: tasks
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

Note that `DB_HOST` is `db`, the **service name**. Compose creates a network
and registers each service under its own name, so there's no
`docker network create` step.

```bash
docker compose up --build   # first run, or after Dockerfile/requirements changes
docker compose ps
docker compose logs app
```

### Phase 5 — Test it

Work through these in order:

1. **Start:** `docker compose up --build`, then open <http://localhost:8501>
2. **Create:** add a task called *Learn Docker Networking*, and confirm it appears
3. **Complete:** mark it done, and confirm the change persisted
4. **Delete:** remove it, and confirm it's gone
5. **Restart:** `docker compose down`, then `docker compose up`
6. **Persistence:** create several tasks, run `down` and `up` again, and confirm they're all still there
7. **Live development:** change the title to `My Docker Task Manager`, save, and see it in the browser without rebuilding

## Acceptance criteria

- [ ] `docker compose up --build` starts both services with no manual `docker run`
- [ ] All four operations work from the browser
- [ ] Tasks survive `docker compose down` followed by `up`
- [ ] Editing `app.py` updates the running app without rebuilding the image
- [ ] No database credentials are hardcoded in `app.py`
- [ ] The database is **not** published to the host (no `3306:3306` mapping)
- [ ] You can explain why `DB_HOST` is `db` and not `localhost`

## When do you need to rebuild?

| You changed | Rebuild? | Why |
|-------------|----------|-----|
| `app.py` or other mounted source | No | It's mounted, not baked into the image |
| `requirements.txt` | Yes | Dependencies are installed into the image |
| `Dockerfile` | Yes | It defines the image |

Rebuild with `docker compose up --build`.

## Debugging checklist

If the app can't reach MySQL, check these in order:

1. Is MySQL running? (`docker compose ps`)
2. Are both services on the same network?
3. Is `DB_HOST` correct?
4. Is the port correct?
5. Are the credentials correct?
6. Is MySQL actually ready to accept connections? (`docker compose logs db`)

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Can't connect to localhost:3306` | Inside a container, `localhost` is **that container**, not MySQL | Use the service name: `db` (or `task-db` in Phase 2) |
| App crashes on first `up`, fine on the second | `depends_on` controls start **order**, not **readiness** | Retry the connection in the app |
| All tasks vanished | You ran `docker compose down -v`, which deletes named volumes | Use plain `down` unless you mean to wipe data |
| Saving the file changes nothing | File events don't cross the bind mount | See the Phase 1 note on `fileWatcherType=poll` |
| `-v "$(pwd):/app"` errors on Windows | PowerShell syntax differs | Use `-v "${PWD}:/app"` |
| A new package isn't found after editing `requirements.txt` | The image wasn't rebuilt | `docker compose up --build` |

**Security note:** `DB_PASSWORD: example` in `compose.yaml` is fine for a
workshop. In a real project, never commit real secrets to Git.

## Stretch goals

- Add a `healthcheck` to the `db` service and use
  `depends_on: db: condition: service_healthy` so the app waits for readiness.
- Move the credentials into a `.env` file that Compose reads, and add it to
  `.gitignore`.
- Add a "clear completed tasks" button.

## Leads into

[Project 5 — Task Manager in Production](05-task-manager-production.md). It
works on your laptop. The next question is whether it's production-ready.
