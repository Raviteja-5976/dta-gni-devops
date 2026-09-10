# Project 2 — SQLite Blog: Watch a Container Lose Its Data

**Session:** 2 — Docker Fundamentals
**Slides:** Session 2, section 13
**Source:** `Desktop/sqlite-session2/`

## Purpose

Containers are designed to be **disposable**. This project shows the downside
of that directly: a blog saves posts inside its container, and when the
container is deleted, the posts go with it.

It's deliberately built **without a volume**. The point is to make the problem
visible and concrete before Project 3 solves it. Students also learn the
nuance that trips people up: **stopping a container keeps its data; removing
it destroys the data.**

## What you'll build

A small Flask blog. You can write a post (title, author, content), read posts
and delete them. Each post is a row in a **SQLite** database, a single file at
`/app/data/blog.db`, handled by Python's built-in `sqlite3` module. There's no
database server to run.

Every page footer shows the **container ID** that served it and the database
path. That makes the "two containers, two separate blogs" bonus easy to see.

```text
Browser ──► localhost:5000 ──► [ blog container ]
                                  gunicorn :5000
                                  /app/data/blog.db   ← in the container's writable layer
```

## The files

```text
sqlite-session2/
├── app.py            Flask app; reads/writes posts in data/blog.db
├── requirements.txt  Flask, gunicorn (pinned)
├── Dockerfile        python:3.13-slim, non-root user, no VOLUME
├── .dockerignore     Excludes data/ and *.db, so a local database never enters the image
├── templates/        base, index, new, post
└── static/style.css
```

The parts of the `Dockerfile` that matter for this lesson:

```dockerfile
RUN useradd --create-home appuser \
    && mkdir -p /app/data \
    && chown -R appuser:appuser /app/data
USER appuser
```

`/app/data` is inside the container, and there's intentionally **no `VOLUME`
instruction** and no `-v` flag at run time.

## Demo steps

Every output below comes from a real run of this project.

### 1. Build, run, and write two posts

```bash
docker build -t docker-blog .
docker run -d --name blog -p 5000:5000 docker-blog
```

Open <http://localhost:5000> and publish two posts.

### 2. Find the database inside the container

```bash
docker exec blog ls -l /app/data
```

```text
total 12
-rw-r--r-- 1 appuser appuser 12288 Sep 10 17:53 blog.db
```

```bash
docker exec blog python -m sqlite3 /app/data/blog.db "SELECT id, title, author FROM posts"
```

```text
(1, 'Hello Docker', 'Raviteja')
(2, 'Where does my data live?', 'Raviteja')
```

`python -m sqlite3` is the SQLite shell built into Python 3.12 and later. The
image uses 3.13.

### 3. See the container's writable layer

```bash
docker diff blog
```

```text
C /app
C /app/data
A /app/data/blog.db
```

`A` means added and `C` means changed. This is everything the container has
written on top of its image, and it belongs to this container only.

### 4. Stop and start: the posts survive

```bash
docker stop blog
docker start blog
docker exec blog python -m sqlite3 /app/data/blog.db "SELECT COUNT(*) FROM posts"
```

```text
(2,)
```

### 5. Remove the container: the posts are gone

```bash
docker rm -f blog
docker run -d --name blog -p 5000:5000 docker-blog
docker exec blog python -m sqlite3 /app/data/blog.db "SELECT COUNT(*) FROM posts"
```

```text
(0,)
```

Refresh the browser: **"No posts yet."**

| Action | The posts |
|--------|-----------|
| `docker stop` / `docker start` | Kept: same container, same file |
| `docker restart` | Kept |
| `docker rm` | **Gone forever** |
| `docker run` (a new container) | Starts empty |

### Bonus: two containers, two separate blogs

```bash
docker run -d --name blog1 -p 5001:5000 docker-blog
docker run -d --name blog2 -p 5002:5000 docker-blog
```

A post written on `:5001` never appears on `:5002`. The footer shows a
different container ID on each.

## What students should see

- [ ] `blog.db` exists inside the running container
- [ ] `docker diff` lists it as added
- [ ] Posts survive `docker stop` / `docker start`
- [ ] Posts are gone after `docker rm` and a fresh `docker run`
- [ ] They can explain *why*: the file lived in the container's writable layer

## Concepts practised

- The container's writable layer, and its lifetime
- `docker exec` to inspect a running container
- `docker diff`
- Stop vs remove
- SQLite as a file-based database

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `docker exec ... /app/data` fails with a strange `C:/Program Files/Git/...` path | Git Bash rewrites Unix-style paths | Use PowerShell, or prefix with `MSYS_NO_PATHCONV=1` |
| `docker exec -it` says *the input device is not a TTY* in Git Bash | Git Bash's terminal isn't a real TTY | Use PowerShell, or prefix with `winpty` |
| `address already in use` on port 5000 (macOS) | AirPlay Receiver listens on port 5000 | Map a different host port: `-p 5050:5000` |
| "The posts survived, so the demo failed" | Only `stop`/`start` was used | Removal is what destroys data: `docker rm -f blog` |
| `431 Request Header Fields Too Large` | Many `localhost` cookies from other dev apps | Already handled by `--limit-request-field_size` in the `CMD` |
| `docker run` says the name `blog` is in use | The old container still exists | `docker rm -f blog` first |

## Stretch: fix it with a volume

Mount a named volume over the data folder:

```bash
docker volume create blog-data
docker run -d --name blog -p 5000:5000 -v blog-data:/app/data docker-blog
```

Write a post, `docker rm -f blog`, and run the same command again. The post is
still there. This works with the non-root user too: a new named volume copies
the image's `/app/data` folder, ownership included, the first time it's
mounted. (Tested with this project: `/app/data` stays owned by `appuser`, and
the post survives removal.)

## Leads into

[Project 3 — MySQL + Volume](03-mysql-volume.md), which does the same thing
properly, with a real database server and a named volume from the start.
