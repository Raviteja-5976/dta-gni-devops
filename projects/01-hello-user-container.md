# Project 1 — Hello User: A Simple Dockerfile, Then Shrink It

**Session:** 2 — Docker Fundamentals
**Slides:** Session 2, sections 7–11 (the app, the Dockerfile, build, run, shrink)
**Source:** `Desktop/Hello-user/` (`hello-user/` for the app, `docker-files/` for the Dockerfile variants)

## Purpose

Two lessons, one tiny app.

1. **Write a simple Dockerfile.** Package an application together with
   everything it needs, so it runs the same on any machine. This is the answer
   to *"It works on my machine."*
2. **Make the image smaller and faster to build.** The first working image is
   big and slow to build. You change the Dockerfile one step at a time and
   measure each change, so students see the difference in numbers instead of
   taking your word for it.

## What you'll build

A Streamlit page for Lehar Loom: **type your name, click Submit, and it says
`Hello, <name>!`**

```text
┌─────────────────────────┐
│ Hello User              │
│                         │
│ Enter your name         │
│ [ Raviteja           ]  │
│ [ Submit ]              │
│                         │
│ Hello, Raviteja!        │
└─────────────────────────┘
```

## The files

| File | Builds | Role in the demo |
|------|--------|------------------|
| `hello-user/app.py` | — | The Streamlit app |
| `hello-user/requirements.txt` | — | `streamlit` |
| `docker-files/Dockerfile.ubuntu` | `hello-user:1.0` | The simple first Dockerfile: `ubuntu:22.04`, install Python by hand |
| `docker-files/Dockerfile.ubuntu-latest` | — | The same on unpinned `ubuntu`, which needs `--break-system-packages` |
| `hello-user/Dockerfile` | `hello-user:2.0` | The optimised Dockerfile: `python:3.12-slim` + `pip --no-cache-dir` |
| `docker-files/Dockerfile.cache-demo` | `hello-user:cache-demo` | Layer caching done wrong, for the build-time demo |
| `hello-user/.dockerignore` | — | Keeps local clutter out of the build context |

`app.py`:

```python
import streamlit as st

st.title("Hello User")

name = st.text_input("Enter your name")

if st.button("Submit"):
    st.write(f"Hello, {name}!")
```

## Demo steps

Run everything from inside `hello-user/`. The Dockerfile variants live next
door in `docker-files/`, so those builds use `-f`.

### 1. Baseline without Docker

```bash
pip install -r requirements.txt
streamlit run app.py
```

It works on your machine. Now make it work everywhere.

### 2. The simple Dockerfile

```dockerfile
FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3 python3-pip

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY app.py .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

```bash
docker build -f ../docker-files/Dockerfile.ubuntu -t hello-user:1.0 .
docker run -p 8501:8501 hello-user:1.0
```

Open <http://localhost:8501>, type a name, and click **Submit**.

> **Why `ubuntu:22.04` and not `ubuntu`?** Current Ubuntu (26.04 at the time of
> writing) blocks system-wide pip installs, and the build fails with
> `error: externally-managed-environment` (PEP 668). Pinning the base is the
> better fix. `Dockerfile.ubuntu-latest` shows the alternative,
> `pip3 install --break-system-packages`. It's a real-world lesson too: an
> unpinned base image changed underneath a working Dockerfile.

### 3. Shrink the image

Two changes: a base image that already has Python, and no pip download cache.

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

```bash
docker build -t hello-user:2.0 .
docker images hello-user
```

### 4. Measure every change

Measured on Docker 29.6.1 with fresh builds (`--no-cache`, base images already
pulled). Your numbers will differ, but the ratios should hold.

| Dockerfile | Disk usage | Download size | Build time |
|------------|-----------|---------------|------------|
| `ubuntu:22.04` base (`hello-user:1.0`) | 1.59 GB | 461 MB | 142 s |
| `python:3.12-slim` base | 1.02 GB | 296 MB | 59 s |
| + `pip install --no-cache-dir` (`hello-user:2.0`) | **791 MB** | **182 MB** | **51 s** |

Docker 29 prints both sizes in `docker images`: **disk usage** is the unpacked
size on your machine, and **content size** is what gets downloaded or pushed.

Overall the image is **about half the size**, and it builds **almost three
times faster**. The middle row isolates the base-image change so each
technique gets credit for its own saving.

### 5. Rebuild time: layer order

Docker caches each instruction. When a file changes, every layer from its
`COPY` onwards is rebuilt. Put the slow, rarely-changing step first.

| Dockerfile | Order | Change one line of `app.py`, then rebuild |
|------------|-------|-------------------------------------------|
| `Dockerfile` | `COPY requirements.txt` → `RUN pip install` → `COPY app.py` | `pip install` is `CACHED`: **1.5 s** |
| `Dockerfile.cache-demo` | `COPY . .` → `RUN pip install` | `pip install` runs again: **55 s** |

```bash
# edit app.py, then:
docker build -t hello-user:2.0 .
docker build -f ../docker-files/Dockerfile.cache-demo -t hello-user:cache-demo .
```

### 6. Tag and share (the deck's Docker Hub section)

```bash
docker tag hello-user:2.0 hello-user:stable

docker login
docker tag  hello-user:2.0 YOUR_USERNAME/hello-user:2.0
docker push YOUR_USERNAME/hello-user:2.0
```

## What students should see

- [ ] The app greets them only after they click **Submit**
- [ ] `hello-user:1.0` builds from the Ubuntu Dockerfile and runs on port 8501
- [ ] The unpinned `FROM ubuntu` build fails, and they can explain why
- [ ] `hello-user:2.0` is roughly half the size of `1.0`
- [ ] A one-line change to `app.py` rebuilds in seconds with `Dockerfile`, and much more slowly with `Dockerfile.cache-demo`

## Concepts practised

- Dockerfile instructions: `FROM`, `RUN`, `WORKDIR`, `COPY`, `EXPOSE`, `CMD`
- `docker build -t` and `-f`, and the build context
- Port mapping with `-p`, and why `EXPOSE` alone doesn't publish a port
- Choosing a base image; pinning versions
- `--no-cache-dir`, and measuring image size
- Layer caching and instruction order
- Tags

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `externally-managed-environment` during build | Unpinned `FROM ubuntu` is a release that blocks system pip | Pin `ubuntu:22.04`, or add `--break-system-packages` |
| `failed to read dockerfile` | Built without `-f` while the Dockerfile is in `docker-files/` | `docker build -f ../docker-files/Dockerfile.ubuntu ...` |
| Container runs but the browser can't connect | Missing `-p 8501:8501` (`EXPOSE` doesn't publish) | Add `-p` |
| Browser can't connect even with `-p` | Streamlit bound to `localhost` inside the container | Keep `--server.address=0.0.0.0` |
| Clicking Submit with an empty name shows `Hello, !` | The button doesn't check for a name | Optional: `if st.button("Submit") and name:` |
| Every rebuild takes a full minute | `app.py` is copied before `pip install` | Copy `requirements.txt` and install first |

## Leads into

[Project 2 — SQLite Blog](02-sqlite-blog.md). Hello User stores nothing. The
next question is what happens to data a container writes.
