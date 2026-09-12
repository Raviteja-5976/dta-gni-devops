# Workshop Projects

The hands-on builds across the DevOps & Docker workshop. Session 2 has three
small, focused projects that each teach one idea. Sessions 3 and 4 then take a
single application from two containers on a laptop to a public website on a
server you own, with its own domain and a valid HTTPS certificate.

| # | Project | Session | Purpose |
|---|---------|---------|---------|
| 1 | [Hello User](01-hello-user-container.md) | 2 | Write a simple Dockerfile for a Streamlit app, then shrink the image and its build time, measuring every change |
| 2 | [SQLite Blog](02-sqlite-blog.md) | 2 | Watch a Flask blog lose all its posts when its container is removed |
| 3 | [MySQL + Volume](03-mysql-volume.md) | 2 | Store rows from a MySQL shell in a named volume, and show they survive container deletion |
| 4 | [Task Manager: Two Containers](04-task-manager-two-containers.md) | 3 | Wire a Flask app and MySQL together by hand, with a network, a volume and four `docker run` flags |
| 5 | [Task Manager with Compose](05-task-manager-compose.md) | 3 | Replace that four-command ritual with one `compose.yaml`, and wait properly for the database |
| 6 | [Task Manager in Production](06-task-manager-production.md) | 4 | Publish the image to Docker Hub and run it on one EC2 instance, on a real domain with HTTPS |

Projects 2 and 3 are a matched pair. They're the same situation, a database
file in a container, with opposite endings, and the only difference is one
`-v` flag.

Projects 4 and 5 are the other matched pair. They're the **same application**,
byte for byte, started two ways. Everything that changes between them is
orchestration, which is exactly the thing Session 3 is about.

## Why there is no Session 1 project

Session 1 is deliberately conceptual: it tells the story of why containers
exist, from one server through dependency conflicts and virtual machines to
Docker, Kubernetes, CI/CD and Terraform. Its only terminal moment is slide 49,
which *asks* what happens when you run `docker run` without answering it yet.
Hands-on work starts in Session 2.

## Source folders

| Project | Folder |
|---------|--------|
| 1 | `Hello-user/` |
| 2 | `sqlite-session2/` |
| 3 | `mysql-session2/` (the MySQL container) |
| 4 | `prj/step1/` |
| 5 | `prj/step2/` |
| 6 | `prj/step3/` |

The commands and outputs in these briefs come from real runs of those
projects. `prj/step1`, `prj/step2` and `prj/step3` are in this repository, and
the application files are **identical in all three**. `step2` adds
`compose.yaml`; `step3` adds `compose.production.yaml`, a `Caddyfile` and
`.env.example`. Everything that changes between them is orchestration, which is
exactly the point.

## How to use these briefs

Each brief states **what** you're building and **why**, gives the steps, and
lists what students should see at the end. Every brief also has a **Common
pitfalls** section. Several of those problems aren't on the slides but will
come up in a real terminal, so read that section before class.
