# DevOps & Docker Workshop — Session 2
## Docker Fundamentals: From Code to Container

### Presentation Style

- Dark, modern developer aesthetic
- Large typography
- Minimal text per slide
- One concept per slide
- Use diagrams wherever possible
- Consistent fictional company: **Lehar Loom**
- Consistent senior developer character: **Sam**
- Use sarcastic developer humor occasionally
- Prefer visual storytelling over paragraphs
- Use terminal/code screenshots or terminal-style UI for command slides
- Use simple architecture diagrams for Docker concepts

---

# SECTION 1 — WHERE WE LEFT OFF

---

## Slide 1 — Session 2

# Docker Fundamentals

### From Code → Image → Container

**Visual:** Docker whale/container illustration with a developer terminal.

**Small footer:**

> Let's make Docker do something useful.

---

## Slide 2 — Quick Recap

### Last Session

We saw:

- DevOps
- Containers
- Docker
- Kubernetes
- CI/CD
- Infrastructure as Code

**Visual:** A simple roadmap.

```text
DevOps
   ↓
Containers
   ↓
Docker
   ↓
Kubernetes
   ↓
CI/CD
   ↓
Terraform
```

---

## Slide 3 — Today We Zoom In

# Docker

Not Kubernetes.

Not Terraform.

Not CI/CD.

Just Docker.

**Visual:** Zoom lens focusing on the Docker logo.

**Joke:**

> One technology at a time.  
> Your laptop has suffered enough.

---

# SECTION 2 — WHAT IS DOCKER?

---

## Slide 4 — What Problem Does Docker Solve?

Sam writes an application.

It works.

Sam sends it to another developer.

It breaks.

**Visual:**

```text
Sam's Machine
     ↓
"It works!"

Other Machine
     ↓
"Why doesn't it work?"
```

---

## Slide 5 — The Real Problem

Applications depend on more than source code.

They depend on:

- Runtime
- Libraries
- System packages
- Configuration
- Environment

**Visual:** Application surrounded by dependency blocks.

---

## Slide 6 — Example

Sam's application needs:

```text
Python 3.12
Streamlit
Pandas
Requests
System libraries
Environment variables
```

But another machine has:

```text
Python 3.9
Different packages
Different system libraries
Different configuration
```

**Result:**

> 💥 Broken application

---

## Slide 7 — Docker's Idea

# Package the application with what it needs.

```text
Application
    +
Dependencies
    +
Runtime
    ↓
Docker Image
```

**Visual:** Everything packed into one shipping container.

---

## Slide 8 — The Docker Mental Model

Think of Docker as:

> A standardized way to package and run applications.

**Visual:**

```text
        Docker Image
             ↓
        Docker Container
             ↓
       Running Application
```

---

# SECTION 3 — DOCKER ARCHITECTURE

---

## Slide 9 — Image vs Container

This is one of the most important concepts.

### Image

A packaged blueprint.

### Container

A running instance of that image.

**Visual:**

```text
        IMAGE
       Blueprint
          │
     ┌────┴────┐
     ↓         ↓
 Container   Container
     A           B
```

---

## Slide 10 — Think About It Like This

# Image = Recipe

# Container = Cooked Meal

You can use the same recipe multiple times.

**Visual:** Recipe card → multiple meals.

---

## Slide 11 — Another Analogy

# Image

> "Here is exactly what should exist."

# Container

> "Here is one running copy of it."

---

## Slide 12 — Containers Are Not VMs

### Virtual Machine

```text
Application
Libraries
Guest OS
Virtual Hardware
Host OS
```

### Container

```text
Application
Libraries
Container
Host OS Kernel
```

**Visual:** Side-by-side VM vs Container diagram.

---

## Slide 13 — Why Containers Are Lightweight

Containers share the host operating system kernel.

They don't need a complete guest OS for every application.

**Visual:** Multiple containers sitting on one shared kernel.

```text
┌────────┐ ┌────────┐ ┌────────┐
│ App A  │ │ App B  │ │ App C  │
│  Ctr   │ │  Ctr   │ │  Ctr   │
└────────┘ └────────┘ └────────┘
───────────────────────────────
          Host Kernel
```

---

# SECTION 4 — INSTALL DOCKER

---

## Slide 14 — Install Docker

# Docker Desktop

For the workshop:

- Install Docker Desktop
- Start Docker
- Verify installation

**Visual:** Docker Desktop UI.

---

## Slide 15 — Verify Installation

Open the terminal.

Run:

```bash
docker --version
```

Expected:

```text
Docker version ...
```

---

## Slide 16 — Docker Help

When you forget a command:

```bash
docker --help
```

For a specific command:

```bash
docker run --help
```

**Joke:**

> Documentation is just autocomplete's older sibling.

---

# SECTION 5 — YOUR FIRST CONTAINER

---

## Slide 17 — Your First Container

Run:

```bash
docker run hello-world
```

That's it.

You just ran your first container.

**Visual:** Terminal screenshot with `Hello from Docker!`

---

## Slide 18 — What Just Happened?

```text
docker run hello-world
       ↓
Docker checks for image
       ↓
Image isn't local
       ↓
Docker downloads image
       ↓
Docker creates container
       ↓
Container runs
```

---

## Slide 19 — The Docker Lifecycle

```text
Image
  ↓
Create Container
  ↓
Start
  ↓
Running
  ↓
Stop
  ↓
Remove
```

**Visual:** Circular lifecycle diagram.

---

# SECTION 6 — BASIC DOCKER COMMANDS

---

## Slide 20 — See Running Containers

```bash
docker ps
```

Shows currently running containers.

---

## Slide 21 — See All Containers

```bash
docker ps -a
```

Includes stopped containers.

**Joke:**

> Yes, Docker remembers your mistakes.

---

## Slide 22 — See Images

```bash
docker images
```

Shows images stored locally.

---

## Slide 23 — Stop a Container

```bash
docker stop <container>
```

Example:

```bash
docker stop my-app
```

---

## Slide 24 — Start a Container

```bash
docker start <container>
```

Stopped doesn't mean deleted.

---

## Slide 25 — Remove a Container

```bash
docker rm <container>
```

---

## Slide 26 — Remove an Image

```bash
docker rmi <image>
```

---

## Slide 27 — The Core Commands

```text
docker ps
docker images

docker run
docker start
docker stop

docker rm
docker rmi
```

These commands will become muscle memory.

Eventually.

---

# SECTION 7 — OUR FIRST REAL APPLICATION

---

## Slide 28 — Back to Lehar Loom

Lehar Loom wants a tiny internal application.

The requirement:

> Enter a name → display a greeting.

**Visual:** Simple Streamlit UI mockup.

```text
┌─────────────────────────┐
│ Hello User              │
│                         │
│ Name: [ Raviteja     ]  │
│                         │
│ Hello, Raviteja! 👋     │
└─────────────────────────┘
```

---

## Slide 29 — The Application

Create:

```text
hello-user/
├── app.py
└── requirements.txt
```

---

## Slide 30 — app.py

```python
import streamlit as st

st.title("Hello User")

name = st.text_input("Enter your name")

if name:
    st.write(f"Hello, {name}! 👋")
```

**Visual:** Code editor screenshot.

---

## Slide 31 — requirements.txt

```text
streamlit
```

That's all the application needs.

For now.

---

## Slide 32 — Run It Normally

Without Docker:

```bash
pip install -r requirements.txt
```

Then:

```bash
streamlit run app.py
```

Works on Sam's machine.

---

## Slide 33 — But What About Another Machine?

Someone else needs:

- Python
- pip
- Streamlit
- Correct versions
- Correct system environment

And now the classic problem returns.

# "It works on my machine."

---

# SECTION 8 — INTRODUCING THE DOCKERFILE

---

## Slide 34 — Meet the Dockerfile

# Dockerfile

A text file containing instructions for building an image.

Think:

> "Docker, here is how to build my application environment."

---

## Slide 35 — Dockerfile

Our first Dockerfile:

```dockerfile
FROM ubuntu

RUN apt-get update
RUN apt-get install -y python3 python3-pip

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY app.py .

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

---

## Slide 36 — FROM

```dockerfile
FROM ubuntu
```

Defines the starting point for our image.

**Important:**

Ubuntu here is being used as a **base image/filesystem environment**, not as a virtual machine.

---

## Slide 37 — RUN

```dockerfile
RUN apt-get update
```

Run a command while building the image.

Another example:

```dockerfile
RUN apt-get install -y python3
```

---

## Slide 38 — WORKDIR

```dockerfile
WORKDIR /app
```

Sets the working directory inside the image/container.

Instead of:

```text
/
```

we work from:

```text
/app
```

---

## Slide 39 — COPY

```dockerfile
COPY requirements.txt .
```

Copies files from the build context into the image.

Later:

```dockerfile
COPY app.py .
```

---

## Slide 40 — CMD

```dockerfile
CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

Defines the default command when the container starts.

**Think:**

> "Container, when you wake up, do this."

---

## Slide 41 — Dockerfile Mental Model

```text
FROM
 ↓
Install
 ↓
Configure
 ↓
Copy files
 ↓
Install dependencies
 ↓
Start application
```

---

# SECTION 9 — BUILD THE IMAGE

---

## Slide 42 — Build

Inside the project directory:

```bash
docker build -t hello-user:1.0 .
```

---

## Slide 43 — Breaking Down the Command

```bash
docker build
```

Build an image.

```bash
-t hello-user:1.0
```

Give it a name and tag.

```bash
.
```

Use the current directory as the build context.

---

## Slide 44 — Build Process

```text
Dockerfile
     +
Application Files
     ↓
docker build
     ↓
Docker Image
```

**Visual:** Build pipeline animation.

---

## Slide 45 — Check the Image

```bash
docker images
```

You should see:

```text
hello-user
```

with tag:

```text
1.0
```

---

# SECTION 10 — RUN OUR APPLICATION

---

## Slide 46 — Run the Container

```bash
docker run -p 8501:8501 hello-user:1.0
```

---

## Slide 47 — What Does -p Mean?

```text
-p 8501:8501
```

Maps:

```text
Host Port
    ↓
Container Port
```

Specifically:

```text
localhost:8501
       ↓
container:8501
```

---

## Slide 48 — Port Mapping

**Visual:**

```text
Your Browser
localhost:8501
       │
       │
       ▼
┌──────────────────┐
│ Docker Container │
│                  │
│ Streamlit        │
│ Port 8501        │
└──────────────────┘
```

---

## Slide 49 — The Application Is Running

Open:

```text
http://localhost:8501
```

You should see:

```text
Hello User

Enter your name

Hello, Raviteja! 👋
```

---

## Slide 50 — What Did We Just Accomplish?

We went from:

```text
app.py
   ↓
Dockerfile
   ↓
Docker Image
   ↓
Docker Container
   ↓
Running Application
```

This is the fundamental Docker workflow.

---

# SECTION 11 — IMAGE OPTIMIZATION

---

## Slide 51 — But There Is a Problem

Our Dockerfile starts with:

```dockerfile
FROM ubuntu
```

Then we install:

```text
Python
pip
Streamlit
```

We're installing a lot ourselves.

---

## Slide 52 — Do We Need Ubuntu?

Ask:

> What does our application actually need?

It needs:

```text
Python
pip
Python packages
Our application
```

Do we really need to start from a general-purpose Ubuntu image?

---

## Slide 53 — Better Base Image

Docker images can be built from other images.

Python already provides official Python images.

So we can use:

```dockerfile
FROM python:3.12-slim
```

---

## Slide 54 — Optimized Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app.py .

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

---

## Slide 55 — Compare the Two

### Ubuntu Approach

```text
Ubuntu
 ↓
Install Python
 ↓
Install pip
 ↓
Install dependencies
 ↓
Application
```

### Python Base Image

```text
Python
 ↓
Install dependencies
 ↓
Application
```

Fewer manual steps.

---

## Slide 56 — Why Use Smaller Images?

Smaller images generally mean:

- Less storage
- Faster transfers
- Faster pulls
- Faster deployments

But:

> Smaller is not automatically better.

You still need the dependencies your application actually requires.

---

## Slide 57 — Measure It

Don't guess.

Run:

```bash
docker images
```

Compare:

```text
hello-user:1.0
hello-user:2.0
```

**Visual:** Terminal showing image sizes.

---

## Slide 58 — Developer Rule

# Measure. Don't assume.

Don't say:

> "This image must be smaller."

Run:

```bash
docker images
```

Then find out.

---

# SECTION 12 — TAGS

---

## Slide 59 — What's This?

We've been using:

```text
hello-user:1.0
```

The `1.0` is a **tag**.

---

## Slide 60 — Image Naming

Docker image references commonly look like:

```text
repository:tag
```

Example:

```text
hello-user:1.0
```

Another:

```text
hello-user:2.0
```

---

## Slide 61 — Why Tags Matter

Imagine Lehar Loom has:

```text
hello-user:1.0
hello-user:1.1
hello-user:2.0
```

Now we know which version we're running.

---

## Slide 62 — The "latest" Trap

You may see:

```text
hello-user:latest
```

But:

# `latest` does NOT mean newest.

It's simply a tag.

**Joke:**

> "latest" is not a versioning strategy.

---

## Slide 63 — Tagging an Image

```bash
docker tag hello-user:2.0 hello-user:stable
```

Now the same image can have another tag.

---

# SECTION 13 — PERSISTENT DATA

---

## Slide 64 — Containers Have a Problem

Containers are designed to be replaceable.

But applications often need data to survive.

Example:

```text
Database
User uploads
Application data
Logs
```

What happens if the container disappears?

---

## Slide 65 — Container Filesystem

Think of a container as having its own filesystem.

```text
Container
┌──────────────────┐
│ Application      │
│ Libraries        │
│ Files            │
│ Data             │
└──────────────────┘
```

If the container is removed, data stored only there can disappear with it.

---

## Slide 66 — We Need Persistent Storage

Docker provides:

# Volumes

A volume stores data outside the container's writable layer.

**Visual:**

```text
Container
    │
    ▼
┌─────────────┐
│    Volume   │
│             │
│ Persistent  │
│    Data     │
└─────────────┘
```

---

# SECTION 14 — MYSQL + VOLUMES

---

## Slide 67 — Lehar Loom Needs a Database

Let's add a database.

# MySQL

We want the database data to survive container replacement.

---

## Slide 68 — Create a Volume

```bash
docker volume create mysql-data
```

Check it:

```bash
docker volume ls
```

---

## Slide 69 — Start MySQL

```bash
docker run -d \
  --name task-db \
  -e MYSQL_ROOT_PASSWORD=example \
  -e MYSQL_DATABASE=tasks \
  -v mysql-data:/var/lib/mysql \
  mysql:8
```

---

## Slide 70 — What's Happening?

```text
MySQL Container
      │
      │ /var/lib/mysql
      ▼
MySQL Volume
      │
      ▼
Persistent Database Data
```

---

## Slide 71 — The Important Part

This:

```bash
-v mysql-data:/var/lib/mysql
```

means:

```text
Docker Volume
      ↓
mysql-data
      ↓
Container path
/var/lib/mysql
```

---

## Slide 72 — Delete the Container

Suppose the MySQL container is removed.

```bash
docker rm -f task-db
```

The container is gone.

But the volume remains.

---

## Slide 73 — Start MySQL Again

Create another MySQL container using the same volume.

```bash
docker run -d \
  --name task-db \
  -e MYSQL_ROOT_PASSWORD=example \
  -e MYSQL_DATABASE=tasks \
  -v mysql-data:/var/lib/mysql \
  mysql:8
```

The database data can survive the container replacement.

---

## Slide 74 — Container vs Volume

```text
CONTAINER
Replaceable
Disposable
Temporary runtime

VOLUME
Persistent
Independent
Stores important data
```

---

## Slide 75 — Named Volume Mental Model

```text
           Container
               │
               │
               ▼
        ┌──────────────┐
        │ MySQL Data   │
        └──────────────┘
               │
               ▼
        Docker Volume
         mysql-data
```

---

## Slide 76 — Important Distinction

### Named Volume

Managed by Docker.

Good for:

- Database data
- Persistent application data
- Docker-managed storage

### Bind Mount

Host directory mounted into a container.

Good for:

- Development
- Source-code synchronization

**For today:**

> We are focusing on named volumes.

Bind mounts come in Session 3.

---

# SECTION 15 — TASK MANAGER MINI PROJECT

---

## Slide 77 — Mini Project

# Task Manager

Lehar Loom wants a tiny internal task system.

Users should eventually be able to:

```text
Create task
View tasks
Complete task
Delete task
```

---

## Slide 78 — Project Architecture — Today

For this session, we're focusing on the database side.

```text
MySQL Container
      │
      ▼
Named Volume
      │
      ▼
Persistent Task Data
```

We are intentionally **not** connecting the application container to MySQL yet.

---

## Slide 79 — Why Not Connect Them Yet?

Because two containers need a way to communicate.

That means:

# Docker Networking

And networking deserves its own session.

---

## Slide 80 — Session 3 Preview

Next session we'll connect:

```text
Streamlit
    │
    │ Docker Network
    ▼
MySQL
    │
    ▼
Volume
```

Then we'll make them work together.

---

# SECTION 16 — DOCKER HUB

---

## Slide 81 — We Built an Image

We currently have:

```text
hello-user:2.0
```

It's sitting on Sam's laptop.

But how does another developer get it?

---

## Slide 82 — Enter Docker Hub

# Docker Hub

A public registry for Docker images.

Think:

> GitHub for container images.

**Visual:** Developer → Docker Hub → Another Developer.

---

## Slide 83 — Image Distribution

```text
Sam's Machine
      │
      │ docker push
      ▼
┌────────────────┐
│  Docker Hub    │
└────────────────┘
      │
      │ docker pull
      ▼
Other Developer
```

---

## Slide 84 — Login

```bash
docker login
```

Enter your Docker Hub credentials.

---

## Slide 85 — Tag for Docker Hub

Suppose your Docker Hub username is:

```text
raviteja
```

Tag the image:

```bash
docker tag hello-user:2.0 raviteja/hello-user:2.0
```

---

## Slide 86 — Push

```bash
docker push raviteja/hello-user:2.0
```

Docker uploads the image to the registry.

---

## Slide 87 — Pull

Another developer can run:

```bash
docker pull raviteja/hello-user:2.0
```

Then:

```bash
docker run -p 8501:8501 raviteja/hello-user:2.0
```

---

## Slide 88 — The Full Docker Lifecycle

```text
                 Code
                  │
                  ▼
              Dockerfile
                  │
                  ▼
             Docker Image
                  │
                  ▼
             Docker Container
                  │
                  ▼
              Run App
                  │
                  ▼
                 Tag
                  │
                  ▼
             Docker Hub
                  │
                  ▼
                Push
                  │
                  ▼
              Pull
                  │
                  ▼
          Another Container
```

---

# SECTION 17 — DOCKER COMMAND CHEAT SHEET

---

## Slide 89 — Images

```bash
docker images

docker build -t name:tag .

docker tag source target

docker rmi image
```

---

## Slide 90 — Containers

```bash
docker run image

docker ps

docker ps -a

docker stop container

docker start container

docker rm container
```

---

## Slide 91 — Volumes

```bash
docker volume create name

docker volume ls

docker volume inspect name

docker volume rm name
```

---

## Slide 92 — Registry

```bash
docker login

docker tag image username/image:tag

docker push username/image:tag

docker pull username/image:tag
```

---

# SECTION 18 — THE BIG PICTURE

---

## Slide 93 — What We Learned

### Docker Fundamentals

We learned:

- Images
- Containers
- Dockerfiles
- Building images
- Running containers
- Port mapping
- Image optimization
- Tags
- Volumes
- Docker Hub
- Push / Pull

---

## Slide 94 — The Core Mental Model

Remember this:

```text
Dockerfile
     ↓
   IMAGE
     ↓
 CONTAINER
     ↓
 RUNNING APP
```

And:

```text
IMAGE
  ↓
TAG
  ↓
REGISTRY
  ↓
PUSH / PULL
```

---

## Slide 95 — What Docker Gives Us

Instead of saying:

> "Install Python 3.12."

> "Install these 17 packages."

> "Install this system dependency."

> "Hope nothing breaks."

We can say:

# "Run this image."

---

## Slide 96 — The Lehar Loom Story So Far

```text
One Application
       ↓
Dependency Conflicts
       ↓
Virtual Machines
       ↓
"It Works On My Machine"
       ↓
Containers
       ↓
Docker
       ↓
Images
       ↓
Containers
       ↓
Persistent Volumes
       ↓
Docker Hub
```

---

# SECTION 19 — WHAT'S NEXT?

---

## Slide 97 — But Something Is Missing

We now have:

```text
Streamlit Container
```

and

```text
MySQL Container
```

But...

# How do they talk?

---

## Slide 98 — The Problem

Imagine:

```text
┌──────────────────┐
│ Streamlit        │
│ Container        │
└──────────────────┘


┌──────────────────┐
│ MySQL            │
│ Container        │
└──────────────────┘
```

They're separate.

How do we connect them?

---

## Slide 99 — Session 3

# Docker Development Workflow

Next we'll learn:

- Bind mounts
- Development with Docker
- Docker networking
- Container-to-container communication
- Docker Compose
- Streamlit + MySQL

---

## Slide 100 — Session 3 Architecture

```text
              Docker Compose

       ┌────────────────────┐
       │     Streamlit      │
       │     Container      │
       └─────────┬──────────┘
                 │
                 │ Docker Network
                 │
                 ▼
       ┌────────────────────┐
       │       MySQL        │
       │     Container      │
       └─────────┬──────────┘
                 │
                 ▼
          MySQL Volume
```

---

## Slide 101 — The Developer Problem

Sam changes one line of Python.

Then realizes:

> "Wait..."

> "Do I have to rebuild the image?"

**Pause.**

---

## Slide 102 — Session 3 Hook

# "If I rebuild my image every time I change one line..."

### "...how am I supposed to develop?"

**Visual:** Sam staring at a terminal with `docker build` repeated dozens of times.

---

## Slide 103 — Final Slide

# Docker Fundamentals

```text
Code
 ↓
Dockerfile
 ↓
Image
 ↓
Container
 ↓
Run
 ↓
Tag
 ↓
Push
```

### Next:

**Development + Networking + Compose**

**Final joke:**

> We haven't even made the containers talk to each other yet.

> That's where the fun begins.