# Workshop Projects

The hands-on builds across the DevOps & Docker workshop. Session 2 has three
small, focused projects that each teach one idea. Sessions 3 and 4 then grow a
single application from a laptop into a service on AWS that redeploys itself
on every `git push`.

| # | Project | Session | Purpose |
|---|---------|---------|---------|
| 1 | [Hello User](01-hello-user-container.md) | 2 | Write a simple Dockerfile for a Streamlit app, then shrink the image and its build time, measuring every change |
| 2 | [SQLite Blog](02-sqlite-blog.md) | 2 | Watch a Flask blog lose all its posts when its container is removed |
| 3 | [MySQL + Volume](03-mysql-volume.md) | 2 | Store rows from a MySQL shell in a named volume, and show they survive container deletion |
| 4 | [Task Manager with Compose](04-task-manager-compose.md) | 3 | Build a real two-container app with a fast development loop |
| 5 | [Task Manager in Production](05-task-manager-production.md) | 4 | Deploy the app to AWS and automate every release |

Projects 2 and 3 are a matched pair. They're the same situation, a database
file in a container, with opposite endings, and the only difference is one
`-v` flag.

## Why there is no Session 1 project

Session 1 is deliberately conceptual: it tells the story of why containers
exist, from one server through dependency conflicts and virtual machines to
Docker, Kubernetes, CI/CD and Terraform. Its only terminal moment is slide 49,
which *asks* what happens when you run `docker run` without answering it yet.
Hands-on work starts in Session 2.

## Source folders

The Session 2 projects are built from your existing folders on the Desktop:

| Project | Folder |
|---------|--------|
| 1 | `Hello-user/` |
| 2 | `sqlite-session2/` |
| 3 | `mysql-session2/` (the MySQL container) |

The commands and outputs in these briefs come from real runs of those
projects.

## How to use these briefs

Each brief states **what** you're building and **why**, gives the steps, and
lists what students should see at the end. Every brief also has a **Common
pitfalls** section. Several of those problems aren't on the slides but will
come up in a real terminal, so read that section before class.
