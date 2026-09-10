# Project 3 — MySQL + Volume: Data That Outlives Its Container

**Session:** 2 — Docker Fundamentals
**Slides:** Session 2, section 14
**Source:** `Desktop/mysql-session2/` (the MySQL container setup in its README)

## Purpose

Project 2 showed that removing a container destroys its data. This project is
the fix. MySQL runs in a container, but its data lives in a **named volume**:
storage that Docker manages outside the container's lifetime.

You write rows from a **MySQL shell**, delete the container, start a brand-new
one attached to the same volume, and the rows are still there. It's the same
situation as the blog; the only difference is one `-v` flag.

## What you'll build

| Name | What it is |
|------|------------|
| `blog-mysql` | The MySQL 8.0 container |
| `blog-mysql-data` | The named volume holding MySQL's data |
| `blogdb` | The database created on first start |
| `bloguser` / `blogpass` | A non-root MySQL user with access to `blogdb` |

```text
MySQL container (blog-mysql)
        │  /var/lib/mysql
        ▼
Named volume (blog-mysql-data)  ← survives docker rm
```

## Demo steps

Every output below comes from a real run.

### 1. Create the volume

```bash
docker volume create blog-mysql-data
docker volume ls
```

```text
DRIVER    VOLUME NAME
local     blog-mysql-data
```

### 2. Start MySQL with the volume attached

```bash
docker run -d \
  --name blog-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=blogdb \
  -e MYSQL_USER=bloguser \
  -e MYSQL_PASSWORD=blogpass \
  -v blog-mysql-data:/var/lib/mysql \
  mysql:8.0
```

| Flag | Meaning |
|------|---------|
| `-d` | Run in the background |
| `--name blog-mysql` | A name you can type |
| `-e MYSQL_...` | Settings MySQL reads on its **first** start: root password, a database, a user |
| `-v blog-mysql-data:/var/lib/mysql` | Mount the volume at MySQL's data directory |

### 3. Wait until it's ready

```bash
docker logs -f blog-mysql
```

Wait for `ready for connections ... port: 3306`. The first start took about
**18 seconds** in testing, because MySQL initialises the empty volume.

### 4. Open a MySQL shell and store data

```bash
docker exec -it blog-mysql mysql -u bloguser -pblogpass blogdb
```

```text
mysql: [Warning] Using a password on the command line interface can be insecure.
mysql>
```

At the `mysql>` prompt:

```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, author, content) VALUES
  ('Hello Docker', 'Raviteja', 'My first post'),
  ('Volumes are magic', 'Raviteja', 'This row should survive');

SELECT id, title, author FROM posts;
```

```text
+----+-------------------+----------+
| id | title             | author   |
+----+-------------------+----------+
|  1 | Hello Docker      | Raviteja |
|  2 | Volumes are magic | Raviteja |
+----+-------------------+----------+
```

This is the same `posts` schema the Flask app in `mysql-session2/app/`
creates, so the data is ready if you connect that app later.

Type `exit` to leave the shell.

### 5. Delete the container

```bash
docker rm -f blog-mysql
docker volume ls
```

```text
local     blog-mysql-data
```

The container is gone; the volume isn't.

### 6. Start a new container on the same volume

Run **exactly** the same `docker run` command as step 2. This time it's ready
in about **4 seconds**, because there's nothing to initialise. Then:

```bash
docker exec -it blog-mysql mysql -u bloguser -pblogpass blogdb
```

```sql
SELECT id, title, author FROM posts;
```

```text
+----+-------------------+----------+
| id | title             | author   |
+----+-------------------+----------+
|  1 | Hello Docker      | Raviteja |
|  2 | Volumes are magic | Raviteja |
+----+-------------------+----------+
```

Same rows, in a brand-new container.

## Project 2 vs Project 3

| | SQLite blog | MySQL |
|---|---|---|
| Where the data lives | The container's writable layer | A named volume |
| After `docker rm` | Gone | Kept |
| What made the difference | — | `-v blog-mysql-data:/var/lib/mysql` |

## What students should see

- [ ] `blog-mysql-data` appears in `docker volume ls`
- [ ] Two rows inserted from the MySQL shell
- [ ] After `docker rm -f blog-mysql`, the volume still exists
- [ ] A new container on the same volume returns the same rows
- [ ] They can explain why this data survived and the blog's didn't

## Concepts practised

- Named volumes: `docker volume create`, `ls`, and `-v NAME:PATH`
- Configuring an image with `-e` environment variables
- `docker logs` to know when a service is ready
- `docker exec -it` for an interactive shell
- Container lifetime vs volume lifetime

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Can't connect to local MySQL server` | Connected before MySQL finished starting | Wait for `ready for connections ... port: 3306` in `docker logs` |
| Changing `MYSQL_PASSWORD` or `MYSQL_DATABASE` has no effect | The `-e` values only apply when the volume is **empty**, on first start | Keep the original values, or start over with a new volume |
| `the input device is not a TTY` in Git Bash | Git Bash's terminal isn't a real TTY | Use PowerShell, or prefix with `winpty` |
| The rows are gone | The second `docker run` used a different volume name, or no `-v` | Reuse `-v blog-mysql-data:/var/lib/mysql` exactly |
| The rows are gone after `docker volume rm` | That deletes the data itself | Only remove a volume when you mean to lose its contents |
| Password warning on every command | Typing `-p<password>` on the command line | Expected in a workshop. Omit the value (`-p`) to be prompted instead |

## Going further

`mysql-session2/` also contains a Flask front end that connects to this MySQL
container over a user-defined Docker network (`blog-network`). Networking and
multi-container apps are Session 3's topic. See
[Project 4](04-task-manager-compose.md).

## Leads into

[Project 4 — Task Manager with Compose](04-task-manager-compose.md). You now
have a persistent database. Next, an application talks to it.
