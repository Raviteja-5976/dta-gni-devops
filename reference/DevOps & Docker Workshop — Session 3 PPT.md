# DevOps & Docker Workshop — Session 3
## Docker Development Workflow: Bind Mounts, Networking & Compose

### Presentation Style

- Dark, modern developer aesthetic
- Large typography
- Minimal text
- One concept per slide
- Strong diagrams
- Terminal-style command slides
- Use visual before/after comparisons
- Keep explanations beginner-friendly
- Use occasional sarcastic developer humor
- No fictional company/story
- Focus heavily on practical demonstrations
- Session should feel like: **"Let's build something real with Docker."**

---

# SECTION 1 — SESSION INTRODUCTION

---

## Slide 1 — Session 3

# Docker Development Workflow

### From One Container to a Real Application

**Topics:**

- Bind Mounts
- Docker Networking
- Multiple Containers
- Docker Compose
- Environment Variables
- Development Workflow
- Debugging

---

## Slide 2 — Where We Are

We already know:

```text
Dockerfile
    ↓
Image
    ↓
Container
    ↓
Running Application
```

We can package and run an application.

---

## Slide 3 — But There's a Problem

You change one line of code.

What do you do?

```bash
docker build ...
docker stop ...
docker rm ...
docker run ...
```

Again.

And again.

And again.

---

## Slide 4 — Let's Try It

Change:

```python
st.title("Hello User")
```

to:

```python
st.title("My Task Manager")
```

Now the question:

# How does the container see the change?

---

## Slide 5 — The Slow Workflow

```text
Change Code
    ↓
Build Image
    ↓
Stop Container
    ↓
Remove Container
    ↓
Create Container
    ↓
Run
    ↓
Test
```

Change one line.

Repeat.

---

## Slide 6 — This Is Not Development

# We need a better workflow.

**Joke:**

> Rebuilding the entire universe because you changed a button label.

---

# SECTION 2 — BIND MOUNTS

---

## Slide 7 — Enter Bind Mounts

A bind mount connects:

```text
Host Machine
     │
     │
     ▼
Container
```

A directory or file on your computer becomes accessible inside the container.

---

## Slide 8 — The Idea

Without a bind mount:

```text
Host
  │
  │ docker build
  ▼
Image
  │
  ▼
Container
```

With a bind mount:

```text
Host Code
    │
    │ Bind Mount
    ▼
Container
```

---

## Slide 9 — Example

Host:

```text
project/
├── app.py
└── requirements.txt
```

Container:

```text
/app/
├── app.py
└── requirements.txt
```

The container can see the host files.

---

## Slide 10 — The `-v` Option

Basic syntax:

```bash
-v HOST_PATH:CONTAINER_PATH
```

Example:

```bash
-v "$(pwd):/app"
```

Meaning:

```text
Current directory
       ↓
     /app
```

---

## Slide 11 — Windows Example

PowerShell:

```powershell
-v "${PWD}:/app"
```

Or Docker Desktop can also handle absolute paths.

**Visual:** Host folder → Docker container folder.

---

## Slide 12 — Run With a Bind Mount

Example:

```bash
docker run \
  -p 8501:8501 \
  -v "$(pwd):/app" \
  hello-user:2.0
```

---

## Slide 13 — Now Change the Code

Change:

```python
st.title("Hello User")
```

to:

```python
st.title("Docker Task Manager")
```

Save the file.

---

## Slide 14 — What Changed?

You did **not**:

- Build a new image
- Push an image
- Delete the container
- Create another container

The source code was already mounted.

---

## Slide 15 — Development Workflow

```text
Edit Code
    ↓
Save
    ↓
Bind Mount
    ↓
Container sees change
    ↓
Application reloads
```

Much faster.

---

## Slide 16 — Why Bind Mounts Are Useful

Excellent for:

- Local development
- Source code
- Fast iteration
- Debugging
- Live reload workflows

---

## Slide 17 — Bind Mount Warning

Bind mounts expose host files to containers.

So be careful.

Don't casually mount:

```text
C:\
/
home
/
etc
```

**Joke:**

> Giving a container your entire laptop is technically a deployment strategy.

---

# SECTION 3 — DEVELOPMENT VS PRODUCTION

---

## Slide 18 — Development

During development:

```text
Host Source Code
       │
       │ Bind Mount
       ▼
Container
```

Fast feedback.

---

## Slide 19 — Production

Production usually looks more like:

```text
Source Code
    ↓
Docker Build
    ↓
Image
    ↓
Container
```

The application code is packaged into the image.

---

## Slide 20 — Two Different Workflows

### Development

```text
Edit → Save → Reload
```

### Production

```text
Code → Build → Test → Deploy
```

Don't confuse the two.

---

# SECTION 4 — MULTIPLE CONTAINERS

---

## Slide 21 — Real Applications Are Not Alone

A typical application might have:

```text
Frontend
Backend
Database
Cache
Message Queue
```

Each could run independently.

---

## Slide 22 — Our Application

We're going to build:

# Task Manager

Two main services:

```text
Streamlit
+
MySQL
```

---

## Slide 23 — Two Containers

```text
┌───────────────────┐
│     Streamlit     │
│     Container     │
└───────────────────┘


┌───────────────────┐
│       MySQL       │
│     Container     │
└───────────────────┘
```

But they need to communicate.

---

## Slide 24 — The Question

How does:

```text
Streamlit
```

talk to:

```text
MySQL
```

?

# Docker Networking

---

# SECTION 5 — DOCKER NETWORKING

---

## Slide 25 — What Is a Docker Network?

A Docker network allows containers to communicate with each other.

Conceptually:

```text
Container A
     │
     │
 Docker Network
     │
     │
Container B
```

---

## Slide 26 — Create a Network

```bash
docker network create task-network
```

Check it:

```bash
docker network ls
```

---

## Slide 27 — Run MySQL on the Network

```bash
docker run -d \
  --name task-db \
  --network task-network \
  -e MYSQL_ROOT_PASSWORD=example \
  -e MYSQL_DATABASE=tasks \
  -v mysql-data:/var/lib/mysql \
  mysql:8
```

---

## Slide 28 — Run Streamlit on the Network

```bash
docker run -d \
  --name task-app \
  --network task-network \
  -p 8501:8501 \
  -v "$(pwd):/app" \
  hello-user:2.0
```

---

## Slide 29 — Now We Have

```text
┌────────────────────┐
│     Streamlit      │
│     Container      │
└─────────┬──────────┘
          │
          │ task-network
          │
          ▼
┌────────────────────┐
│       MySQL        │
│     Container      │
└────────────────────┘
```

---

## Slide 30 — The `localhost` Trap

Inside the Streamlit container:

```text
localhost
```

means:

# The Streamlit container itself.

It does NOT mean:

> The MySQL container.

---

## Slide 31 — Common Mistake

Students often write:

```text
MYSQL_HOST=localhost
```

But MySQL is in another container.

So:

```text
localhost
      ↓
Streamlit container
```

Not MySQL.

---

## Slide 32 — What Should We Use?

Use the MySQL container's name:

```text
task-db
```

So:

```text
MYSQL_HOST=task-db
```

---

## Slide 33 — Container Name as Hostname

```text
Streamlit
    │
    │ hostname: task-db
    ▼
  MySQL
```

Docker's network provides the connection between them.

---

## Slide 34 — Networking Mental Model

```text
Same Docker Network
        ↓
Containers can communicate
        ↓
Use service/container name
        ↓
Connect to the correct port
```

---

## Slide 35 — Internal vs External Ports

Important distinction.

### External access

```text
localhost:8501
```

Used by your browser.

### Container-to-container

```text
task-db:3306
```

Used by Streamlit.

---

## Slide 36 — Port Mapping

```text
-p 8501:8501
```

means:

```text
Host:8501
    ↓
Container:8501
```

---

## Slide 37 — MySQL Doesn't Need Host Port Mapping

If only Streamlit needs MySQL:

```text
Streamlit
    ↓
Docker Network
    ↓
MySQL
```

MySQL can communicate internally without exposing port `3306` to your host.

---

# SECTION 6 — TASK MANAGER APPLICATION

---

## Slide 38 — Project Architecture

```text
              Browser
                  │
                  ▼
        ┌──────────────────┐
        │    Streamlit     │
        │    Container     │
        └────────┬─────────┘
                 │
            Docker Network
                 │
                 ▼
        ┌──────────────────┐
        │      MySQL       │
        │    Container     │
        └────────┬─────────┘
                 │
                 ▼
          Named Volume
```

---

## Slide 39 — Task Manager Features

The application will support:

```text
Create Task
View Tasks
Complete Task
Delete Task
```

Keep the UI simple.

---

## Slide 40 — Database Table

Create a table:

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);
```

---

## Slide 41 — Database Connection

Python needs:

```text
Host
Port
Database
Username
Password
```

Example:

```text
Host: task-db
Port: 3306
Database: tasks
```

---

## Slide 42 — Python Database Library

Install a MySQL client library.

For example:

```text
mysql-connector-python
```

Add it to:

```text
requirements.txt
```

---

## Slide 43 — Requirements

```text
streamlit
mysql-connector-python
```

---

## Slide 44 — Connection Example

```python
import mysql.connector

connection = mysql.connector.connect(
    host="task-db",
    port=3306,
    user="root",
    password="example",
    database="tasks"
)
```

---

## Slide 45 — Why `task-db`?

Not:

```text
localhost
```

Because:

```text
Streamlit Container
        ≠
MySQL Container
```

The MySQL container is reachable through:

```text
task-db
```

---

## Slide 46 — Create a Task

```python
cursor.execute(
    "INSERT INTO tasks (title) VALUES (%s)",
    (title,)
)

connection.commit()
```

---

## Slide 47 — Read Tasks

```python
cursor.execute(
    "SELECT id, title, completed FROM tasks"
)

tasks = cursor.fetchall()
```

---

## Slide 48 — Update a Task

```python
cursor.execute(
    "UPDATE tasks SET completed = TRUE WHERE id = %s",
    (task_id,)
)

connection.commit()
```

---

## Slide 49 — Delete a Task

```python
cursor.execute(
    "DELETE FROM tasks WHERE id = %s",
    (task_id,)
)

connection.commit()
```

---

## Slide 50 — The Application

```text
Browser
   ↓
Streamlit
   ↓
Python
   ↓
MySQL Driver
   ↓
Docker Network
   ↓
MySQL
   ↓
Volume
```

---

# SECTION 7 — ENVIRONMENT VARIABLES

---

## Slide 51 — There Is a Problem

Our code currently contains:

```python
password="example"
```

That's not a great habit.

---

## Slide 52 — Configuration Should Be Configurable

Instead of hardcoding:

```text
Host
Username
Password
Database
```

use:

# Environment Variables

---

## Slide 53 — Environment Variables

Example:

```text
DB_HOST=task-db
DB_PORT=3306
DB_NAME=tasks
DB_USER=root
DB_PASSWORD=example
```

---

## Slide 54 — Python Reads Them

```python
import os

db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
```

---

## Slide 55 — Why Environment Variables?

The same application can run with different configuration.

```text
Development
    ↓
DB_HOST=task-db


Production
    ↓
DB_HOST=production-db
```

Same application.

Different configuration.

---

## Slide 56 — Important Security Note

For a workshop:

```text
DB_PASSWORD=example
```

is fine.

In a real application:

# Don't commit secrets to Git.

Later we'll cover proper secret management.

---

# SECTION 8 — THE MANUAL WORKFLOW PROBLEM

---

## Slide 57 — Look at What We Have

To run the application manually:

```bash
docker network create ...
```

```bash
docker volume create ...
```

```bash
docker run mysql ...
```

```bash
docker run streamlit ...
```

---

## Slide 58 — And Then...

Someone asks:

> "How do I run this project?"

You respond:

> "Here's my 17-line command sequence."

---

## Slide 59 — There Must Be a Better Way

We have:

```text
2 containers
1 network
1 volume
environment variables
ports
build configuration
```

We need a way to describe all of this.

# Docker Compose

---

# SECTION 9 — DOCKER COMPOSE

---

## Slide 60 — What Is Docker Compose?

Docker Compose lets us define a multi-container application in a YAML file.

Instead of:

```text
Many Docker Commands
```

we describe:

```text
One Application
```

---

## Slide 61 — The Compose Mental Model

```text
compose.yaml
      ↓
Application Definition
      ↓
┌─────────────┐
│   App       │
│   Database  │
│   Network   │
│   Volume    │
└─────────────┘
```

---

## Slide 62 — Create `compose.yaml`

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

---

## Slide 63 — Compose Has Services

Our file defines:

```text
app
db
```

Each service represents a container/service in the application.

---

## Slide 64 — App Service

```yaml
app:
  build: .
```

Build the application image using our Dockerfile.

---

## Slide 65 — App Port

```yaml
ports:
  - "8501:8501"
```

Makes Streamlit available to the host.

---

## Slide 66 — App Bind Mount

```yaml
volumes:
  - .:/app
```

Our source code is mounted into the container.

This is our development workflow.

---

## Slide 67 — Database Service

```yaml
db:
  image: mysql:8
```

We don't need to create a MySQL Dockerfile.

We can use the existing MySQL image.

---

## Slide 68 — Database Volume

```yaml
volumes:
  - mysql-data:/var/lib/mysql
```

The database survives container replacement.

---

## Slide 69 — Environment Variables

```yaml
environment:
  DB_HOST: db
  DB_PORT: 3306
  DB_NAME: tasks
```

Notice:

```text
DB_HOST=db
```

Not:

```text
DB_HOST=localhost
```

---

## Slide 70 — Why `db`?

Compose creates a network for the application.

Services can communicate using their service names.

```text
app
 │
 │ db
 ▼
db
```

---

## Slide 71 — Compose Networking

We don't have to manually create:

```bash
docker network create
```

Compose manages the application network for us.

---

## Slide 72 — `depends_on`

```yaml
depends_on:
  - db
```

This expresses a startup dependency.

The app depends on the database service.

**Important:**

> `depends_on` does not guarantee that MySQL is fully ready to accept connections.

---

# SECTION 10 — RUNNING COMPOSE

---

## Slide 73 — Start Everything

Run:

```bash
docker compose up
```

Compose starts the application stack.

---

## Slide 74 — Detached Mode

```bash
docker compose up -d
```

Runs the services in the background.

---

## Slide 75 — See Services

```bash
docker compose ps
```

You should see:

```text
app
db
```

---

## Slide 76 — View Logs

```bash
docker compose logs
```

For one service:

```bash
docker compose logs app
```

---

## Slide 77 — Stop Everything

```bash
docker compose down
```

Containers and the Compose network are removed.

---

## Slide 78 — What About the Volume?

A normal:

```bash
docker compose down
```

does not remove named volumes by default.

So:

```text
Containers → Removed
Network    → Removed
Volume     → Remains
```

---

## Slide 79 — Remove Volumes

If you explicitly want to remove volumes:

```bash
docker compose down -v
```

**Warning:**

This can delete persistent database data.

---

## Slide 80 — Rebuild

When the Dockerfile changes:

```bash
docker compose build
```

Or:

```bash
docker compose up --build
```

---

# SECTION 11 — THE DEVELOPMENT WORKFLOW

---

## Slide 81 — Now We Have Something Useful

Our workflow becomes:

```text
Edit Code
    ↓
Save
    ↓
Bind Mount
    ↓
Container sees code
    ↓
Streamlit reloads
```

No image rebuild for every Python change.

---

## Slide 82 — When Do We Rebuild?

Change:

```text
app.py
```

Usually:

> No rebuild required.

Change:

```text
requirements.txt
```

Usually:

> Rebuild.

Change:

```text
Dockerfile
```

> Rebuild.

---

## Slide 83 — Development Workflow

```text
┌──────────────────────────┐
│      Developer           │
│                          │
│       Edit Code          │
└────────────┬─────────────┘
             │
             ▼
       Host Directory
             │
        Bind Mount
             │
             ▼
┌──────────────────────────┐
│     Streamlit Container  │
└────────────┬─────────────┘
             │
        Docker Network
             │
             ▼
┌──────────────────────────┐
│      MySQL Container     │
└────────────┬─────────────┘
             │
             ▼
        Named Volume
```

---

# SECTION 12 — DEBUGGING

---

## Slide 84 — Something Broke

Don't panic.

Docker gives you tools.

Start with:

```bash
docker compose ps
```

---

## Slide 85 — Check Logs

```bash
docker compose logs
```

Or:

```bash
docker compose logs app
```

Or:

```bash
docker compose logs db
```

---

## Slide 86 — Container Not Running?

Check:

```bash
docker ps
```

Then:

```bash
docker ps -a
```

A stopped container usually has a reason.

---

## Slide 87 — Application Can't Reach MySQL?

Check:

```text
1. Is MySQL running?
2. Are both services on the same network?
3. Is DB_HOST correct?
4. Is the port correct?
5. Are credentials correct?
6. Is MySQL actually ready?
```

---

## Slide 88 — `localhost` Again

If your app says:

```text
Can't connect to localhost:3306
```

Ask:

> Is MySQL running inside the same container?

If not:

```text
localhost
```

is probably wrong.

---

## Slide 89 — Debugging Mental Model

```text
Application Problem
       ↓
Is container running?
       ↓
Check logs
       ↓
Check configuration
       ↓
Check network
       ↓
Check ports
       ↓
Check database
       ↓
Check volume
```

---

# SECTION 13 — HANDS-ON PROJECT

---

## Slide 90 — Build It

# Task Manager

Build the application using:

```text
Streamlit
+
MySQL
+
Docker
+
Docker Compose
```

---

## Slide 91 — Requirements

### Application

- Add task
- List tasks
- Complete task
- Delete task

### Infrastructure

- App container
- MySQL container
- Bind mount
- Docker network
- Named volume
- Compose

---

## Slide 92 — Final Architecture

```text
                         Browser
                            │
                            │ :8501
                            ▼
                 ┌──────────────────┐
                 │    Streamlit     │
                 │    Container     │
                 │                  │
                 │ /app ← Host      │
                 └────────┬─────────┘
                          │
                          │ Docker Network
                          │
                          ▼
                 ┌──────────────────┐
                 │      MySQL       │
                 │    Container     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   mysql-data     │
                 │  Named Volume    │
                 └──────────────────┘
```

---

## Slide 93 — Start the Project

```bash
docker compose up --build
```

---

## Slide 94 — Open the Application

Open:

```text
http://localhost:8501
```

---

## Slide 95 — Test: Create Task

Create:

```text
Learn Docker Networking
```

Verify it appears.

---

## Slide 96 — Test: Complete Task

Mark the task as completed.

Verify the database changes.

---

## Slide 97 — Test: Delete Task

Delete the task.

Verify it disappears.

---

## Slide 98 — Test: Restart Containers

Run:

```bash
docker compose down
```

Then:

```bash
docker compose up
```

Check the database.

---

## Slide 99 — Persistence Test

Create several tasks.

Then:

```bash
docker compose down
```

Start again:

```bash
docker compose up
```

The tasks should still exist.

Why?

# The named volume.

---

## Slide 100 — Development Test

Change the Streamlit UI.

For example:

```python
st.title("My Docker Task Manager")
```

Save.

The development container sees the source through the bind mount.

---

# SECTION 14 — FINAL MENTAL MODEL

---

## Slide 101 — Three Different Storage Concepts

### Image

Application package.

### Container

Running application instance.

### Volume

Persistent data.

---

## Slide 102 — Bind Mount vs Volume

### Bind Mount

```text
Host Directory
      ↓
Container
```

Best for:

> Development/source code.

### Named Volume

```text
Docker Volume
      ↓
Container
```

Best for:

> Persistent application data.

---

## Slide 103 — Networking

Remember:

```text
Container
    ↓
Docker Network
    ↓
Another Container
```

Use the service/container name.

Example:

```text
db:3306
```

Not:

```text
localhost:3306
```

when MySQL is in another container.

---

## Slide 104 — Compose

Compose gives us:

```text
Services
Networks
Volumes
Environment
Ports
Build Configuration
```

in one place.

---

## Slide 105 — Before Compose

```text
docker network create
docker volume create
docker run mysql
docker run app
docker ...
docker ...
```

---

## Slide 106 — After Compose

```bash
docker compose up
```

That's the point.

---

## Slide 107 — Complete Development Workflow

```text
Write Code
    ↓
Bind Mount
    ↓
Container
    ↓
Docker Network
    ↓
Database
    ↓
Named Volume
    ↓
Docker Compose
```

---

# SECTION 15 — WHAT WE LEARNED

---

## Slide 108 — Session 3 Recap

We learned:

- Bind mounts
- Development workflow
- Docker networks
- Container-to-container communication
- Service names
- Environment variables
- Docker Compose
- Compose services
- Compose volumes
- Compose networking
- Logs
- Debugging

---

## Slide 109 — The Big Difference

### Session 2

```text
One Container
```

### Session 3

```text
Multiple Containers
        +
Development Workflow
        +
Networking
        +
Persistence
        +
Compose
```

---

## Slide 110 — Docker Is Starting to Look Different

At first:

```text
docker run
```

felt like:

> "Run this thing."

Now:

```text
Docker Compose
```

feels like:

> "Here is my entire application."

---

## Slide 111 — The New Mental Model

```text
                 Docker Compose
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       App          Database      Volumes
          │            │
          └──── Network┘
               │
               ▼
          Application
```

---

# SECTION 16 — NEXT SESSION

---

## Slide 112 — We Can Run It...

We can now:

```text
Build
Run
Connect
Persist
Develop
Debug
```

But...

# Is this production-ready?

---

## Slide 113 — New Problems

Our images could be smaller.

Our containers could be more secure.

Our configuration could be better.

Our application needs health checks.

And eventually...

> Someone has to deploy this.

---

## Slide 114 — Session 4

# Docker for Production

Coming next:

- Multi-stage builds
- Image optimization
- Non-root containers
- Security basics
- Health checks
- Resource limits
- Production configuration
- Container deployment

---

## Slide 115 — Final Slide

# From

```text
docker run
```

# To

```text
docker compose up
```

### We now have a real multi-container application.

**Joke:**

> Congratulations.  
> You have officially created enough containers to start asking who is going to manage them.