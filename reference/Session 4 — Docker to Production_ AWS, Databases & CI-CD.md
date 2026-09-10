# Session 4 — Docker to Production

## Subtitle

From Local Containers to a Production Application

---

# SECTION 1 — WHERE WE ARE

## Slide 1 — Session 4

# Docker to Production

### AWS • Databases • CI/CD

**Final Workshop Session**

---

## Slide 2 — The Journey

```text
SESSION 1
Why Docker?
    ↓
SESSION 2
How Docker Works
    ↓
SESSION 3
How We Develop With Docker
    ↓
SESSION 4
How We Ship It
```

---

## Slide 3 — What We Built

```text
Browser
   ↓
Streamlit
   ↓
Docker Network
   ↓
MySQL
   ↓
Named Volume
```

### Local Task Manager

---

## Slide 4 — It Works!

```text
localhost:8501
```

Application is running.

Database is running.

Data survives container restarts.

---

## Slide 5 — But...

# Is this production-ready?

---

## Slide 6 — New Questions

If users are going to access our application:

- Where does it run?
- How do we expose it?
- Where does the image live?
- Where does the database live?
- How do we update it?
- What happens when the application crashes?
- How do we deploy every time we push code?

---

## Slide 7 — Today's Goal

By the end:

```text
CODE
 ↓
DOCKER
 ↓
REGISTRY
 ↓
AWS
 ↓
DATABASE
 ↓
CI/CD
```

---

# SECTION 2 — DEVELOPMENT VS PRODUCTION

## Slide 8 — Development

Our current environment:

```text
Laptop
  │
  ├── Docker
  │
  ├── Streamlit Container
  │
  └── MySQL Container
          │
          ▼
      Named Volume
```

Perfect for learning and development.

---

## Slide 9 — Production Is Different

Production introduces:

- Reliability
- Security
- Availability
- Scaling
- Monitoring
- Deployment automation
- Persistent data

---

## Slide 10 — Development ≠ Production

```text
DEVELOPMENT

"My laptop works."


PRODUCTION

"Thousands of users depend on it."
```

---

## Slide 11 — Our Development Setup

```text
             Laptop

        ┌───────────────┐
        │   Streamlit   │
        │   Container   │
        └───────┬───────┘
                │
         Docker Network
                │
        ┌───────▼───────┐
        │     MySQL     │
        │   Container   │
        └───────┬───────┘
                │
                ▼
          Named Volume
```

---

## Slide 12 — What Changes?

In production:

```text
Laptop
   ↓
Cloud
```

And:

```text
Local MySQL
      ↓
Production Database
```

---

# SECTION 3 — PRODUCTION DOCKER IMAGE

## Slide 13 — First Step

# Build a Production Image

We shouldn't deploy our development environment blindly.

---

## Slide 14 — Development Image

Our current Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app.py .

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
```

---

## Slide 15 — What Makes an Image Production-Friendly?

Think about:

```text
Small
+
Predictable
+
Secure
+
Reproducible
```

---

## Slide 16 — Pin Dependencies

Instead of:

```text
streamlit
mysql-connector-python
```

We can pin versions:

```text
streamlit==1.x.x
mysql-connector-python==9.x.x
```

### Why?

Same dependencies.

Same environment.

More predictable deployments.

---

## Slide 17 — Don't Put Secrets in the Image

Bad:

```dockerfile
ENV DB_PASSWORD=my-secret-password
```

The secret becomes part of the image configuration.

---

## Slide 18 — Better

Pass configuration at runtime.

```text
Container
   │
   ├── DB_HOST
   ├── DB_NAME
   ├── DB_USER
   └── DB_PASSWORD
```

---

## Slide 19 — Environment Variables

Example:

```text
DB_HOST=db
DB_PORT=3306
DB_NAME=tasks
DB_USER=root
DB_PASSWORD=example
```

---

## Slide 20 — Development vs Production Secrets

### Development

```text
.env
Docker Compose
```

### Production

Use a proper secret-management mechanism.

Examples:

```text
AWS Secrets Manager
AWS Systems Manager Parameter Store
```

---

## Slide 21 — Non-Root Containers

Containers shouldn't automatically run everything as root.

Example:

```dockerfile
RUN useradd -m appuser

USER appuser
```

---

## Slide 22 — Production Checklist

Before deployment:

```text
☑ Small base image
☑ Dependencies controlled
☑ No secrets in image
☑ Application listens on correct interface
☑ Configuration comes from environment
☑ Container can be restarted safely
```

---

# SECTION 4 — CONTAINER REGISTRIES

## Slide 23 — We Have an Image

Our machine has:

```text
hello-user:2.0
```

But AWS cannot access the image sitting on our laptop.

---

## Slide 24 — Where Does the Image Go?

# Container Registry

A registry stores container images.

```text
Docker Image
     ↓
Container Registry
     ↓
Cloud
```

---

## Slide 25 — Docker Hub

We already used:

```bash
docker login
```

Then:

```bash
docker tag hello-user:2.0 \
  YOUR_USERNAME/hello-user:2.0
```

---

## Slide 26 — Push

```bash
docker push \
  YOUR_USERNAME/hello-user:2.0
```

Now the image exists remotely.

---

## Slide 27 — Pull

Another machine can run:

```bash
docker pull \
  YOUR_USERNAME/hello-user:2.0
```

---

## Slide 28 — AWS Needs a Registry Too

AWS provides:

# Amazon ECR

Elastic Container Registry

---

## Slide 29 — ECR Mental Model

```text
Your Laptop
     │
     │ docker build
     ▼
 Docker Image
     │
     │ docker push
     ▼
   Amazon ECR
     │
     │ docker pull
     ▼
 AWS Compute
```

---

## Slide 30 — Create an ECR Repository

Example repository:

```text
task-manager
```

Think of it as:

```text
ECR
 └── task-manager
```

---

## Slide 31 — ECR Repository

The repository contains image versions:

```text
task-manager
│
├── 1.0
├── 1.1
├── 1.2
└── latest
```

---

## Slide 32 — Tagging for ECR

Conceptually:

```bash
docker tag task-manager:1.0 \
  <AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/task-manager:1.0
```

---

## Slide 33 — Push to ECR

```bash
docker push \
  <AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/task-manager:1.0
```

---

## Slide 34 — The Important Idea

```text
Dockerfile
    ↓
Docker Image
    ↓
ECR
    ↓
AWS
```

---

# SECTION 5 — WHERE DOES THE CONTAINER RUN?

## Slide 35 — Registry ≠ Runtime

ECR stores the image.

But who runs the container?

---

## Slide 36 — Option 1: Virtual Machine

We could create:

```text
EC2
 │
 └── Docker
      │
      └── Container
```

---

## Slide 37 — But Now We Manage...

```text
Server
OS
Docker
Security
Updates
Networking
Container
```

More responsibility.

---

## Slide 38 — Option 2

# Amazon ECS

Elastic Container Service

---

## Slide 39 — What Is ECS?

ECS is a service for running and managing containers on AWS.

```text
ECR
 ↓
ECS
 ↓
Containers
```

---

## Slide 40 — Fargate

# ECS + Fargate

Fargate lets us run containers without managing the underlying servers ourselves.

---

## Slide 41 — The Simple Mental Model

```text
Docker
=
Build & Package

ECR
=
Store Image

ECS
=
Manage Containers

Fargate
=
Run Containers
```

---

## Slide 42 — ECS Architecture

```text
                 AWS
                  │
        ┌─────────▼─────────┐
        │    ECS Cluster    │
        │                   │
        │  ┌─────────────┐  │
        │  │ ECS Service │  │
        │  │             │  │
        │  │  Container  │  │
        │  └─────────────┘  │
        └───────────────────┘
```

---

## Slide 43 — Cluster

A cluster is a logical grouping of ECS resources.

```text
ECS Cluster
     │
     ├── Task
     ├── Task
     └── Task
```

---

## Slide 44 — Task

A task is a running instance of a task definition.

Think:

```text
Task
=
Running workload
```

---

## Slide 45 — Task Definition

A task definition describes how ECS should run the container.

It includes things like:

```text
Image
CPU
Memory
Port
Environment variables
Secrets
Logging
```

---

## Slide 46 — Service

An ECS Service keeps the desired number of tasks running.

Example:

```text
Desired count = 2
```

ECS tries to keep:

```text
Task 1
Task 2
```

running.

---

## Slide 47 — If a Container Dies?

Without a service:

```text
Container dies
     ↓
Application stops
```

With ECS Service:

```text
Container dies
     ↓
ECS notices
     ↓
New task starts
```

---

## Slide 48 — Our Deployment Flow

```text
Docker Image
     ↓
ECR
     ↓
ECS Task Definition
     ↓
ECS Service
     ↓
Fargate
     ↓
Running Container
```

---

# SECTION 6 — GETTING USERS TO THE APPLICATION

## Slide 49 — Our Local Application

We used:

```text
localhost:8501
```

But production users don't have access to our laptop.

---

## Slide 50 — Production

We need:

```text
Internet
   ↓
AWS
   ↓
Application
```

---

## Slide 51 — Application Port

Our Streamlit container listens on:

```text
8501
```

The cloud infrastructure needs to route traffic to it.

---

## Slide 52 — Network Flow

Conceptually:

```text
User
  ↓
Public Endpoint
  ↓
AWS Networking
  ↓
ECS Service
  ↓
Container :8501
```

---

## Slide 53 — Important Concept

# Container Port ≠ Public Internet

A container listening on:

```text
8501
```

doesn't automatically mean:

```text
https://myapp.com
```

---

# SECTION 7 — DATABASE DECISION

## Slide 54 — Now the Big Question

# Where does MySQL live?

We have two options.

---

## Slide 55 — Option A

# MySQL in a Container

Exactly what we did in Session 3.

```text
ECS
 │
 ├── App Container
 │
 └── MySQL Container
          │
          ▼
      Persistent Storage
```

---

## Slide 56 — Option B

# Managed MySQL

Use:

# Amazon RDS for MySQL

```text
ECS
 │
 └── App Container
          │
          │
          ▼
       Amazon RDS
          │
          ▼
         MySQL
```

---

# SECTION 8 — MYSQL CONTAINER + VOLUME

## Slide 57 — What We Did Locally

```text
MySQL Container
      │
      ▼
Named Volume
```

---

## Slide 58 — Why the Volume?

Containers are disposable.

```text
Container
   ↓
Deleted
```

Without persistent storage:

```text
Data
 ↓
Gone
```

---

## Slide 59 — With a Volume

```text
Container
    │
    ▼
Named Volume
    │
    ▼
Persistent Data
```

Delete the container:

```text
Container ❌
Volume     ✅
Data       ✅
```

---

## Slide 60 — Example

```bash
docker volume create mysql-data
```

---

## Slide 61 — Run MySQL

```bash
docker run -d \
  --name task-db \
  -e MYSQL_ROOT_PASSWORD=example \
  -e MYSQL_DATABASE=tasks \
  -v mysql-data:/var/lib/mysql \
  mysql:8
```

---

## Slide 62 — Container + Volume

```text
             MySQL
           Container
               │
               ▼
       /var/lib/mysql
               │
               ▼
          mysql-data
            Volume
```

---

## Slide 63 — The Advantage

You control:

```text
Docker
MySQL
Configuration
Storage
Backups
Updates
```

---

## Slide 64 — The Problem

Now you are responsible for:

```text
Backups
Recovery
Storage
Monitoring
Database upgrades
High availability
Security
Failure handling
```

---

## Slide 65 — Running Database in Production

Possible?

# Yes.

Always best?

# Not necessarily.

---

# SECTION 9 — AMAZON RDS

## Slide 66 — What Is RDS?

Amazon RDS is a managed relational database service.

For our project:

```text
Amazon RDS
     ↓
   MySQL
```

---

## Slide 67 — RDS Architecture

```text
            AWS
             │
     ┌───────▼────────┐
     │      ECS       │
     │                │
     │ App Container  │
     └───────┬────────┘
             │
             │
       Private Network
             │
     ┌───────▼────────┐
     │      RDS       │
     │     MySQL      │
     └────────────────┘
```

---

## Slide 68 — App Connection

Instead of:

```python
host="task-db"
```

the application gets the RDS endpoint.

Conceptually:

```text
DB_HOST=<RDS-ENDPOINT>
```

---

## Slide 69 — Example Configuration

```text
DB_HOST=mydb.xxxxx.region.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tasks
DB_USER=appuser
DB_PASSWORD=********
```

---

## Slide 70 — The Application Doesn't Care

Our Python code can still look like:

```python
connection = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"]
)
```

Only the configuration changes.

---

# SECTION 10 — CONTAINER MYSQL VS RDS

## Slide 71 — Compare Them

| | MySQL Container | Amazon RDS |
|---|---|---|
| Runs MySQL | You | AWS |
| Storage | Volume | Managed storage |
| Backups | You manage | AWS features |
| Updates | You manage | AWS-supported |
| Scaling | You manage | Managed options |
| Learning | Excellent | Excellent |
| Production responsibility | Higher | Lower |

---

## Slide 72 — Development

For development:

```text
Docker Compose
      │
      ├── App
      │
      └── MySQL
             │
             ▼
          Volume
```

Simple.

Portable.

Cheap.

---

## Slide 73 — Production Option A

```text
ECS
 │
 ├── App
 │
 └── MySQL
       │
       ▼
   Persistent Storage
```

You manage more.

---

## Slide 74 — Production Option B

```text
ECS
 │
 └── App
      │
      ▼
     RDS
      │
      ▼
    MySQL
```

AWS manages more of the database infrastructure.

---

## Slide 75 — Important Lesson

# Containers don't mean everything must be a container.

---

## Slide 76 — Choose the Right Tool

```text
Application
     ↓
Container

Database
     ↓
Managed Database
```

This is often a better production architecture.

---

## Slide 77 — But Know Both

### Containerized MySQL

Great for:

- Development
- Testing
- Learning
- Controlled environments

### RDS

Great when you want managed database infrastructure.

---

# SECTION 11 — FINAL PRODUCTION ARCHITECTURE

## Slide 78 — Development Architecture

```text
             Browser
                │
                ▼
        ┌───────────────┐
        │    Streamlit  │
        │   Container   │
        └───────┬───────┘
                │
         Docker Network
                │
        ┌───────▼───────┐
        │     MySQL     │
        │   Container   │
        └───────┬───────┘
                │
                ▼
           Named Volume
```

---

## Slide 79 — Production Architecture

```text
                  Users
                    │
                    ▼
               AWS Network
                    │
                    ▼
             ECS / Fargate
                    │
                    ▼
            App Container
                    │
                    │
                    ▼
                Amazon RDS
                    │
                    ▼
                  MySQL
```

---

## Slide 80 — Same Application

Development:

```text
DB_HOST=task-db
```

Production:

```text
DB_HOST=<RDS-ENDPOINT>
```

The application code stays largely the same.

---

# SECTION 12 — MANUAL DEPLOYMENT

## Slide 81 — Imagine This

Developer changes:

```python
st.title("Task Manager v2")
```

---

## Slide 82 — Manual Process

```text
Change Code
   ↓
Build Image
   ↓
Tag Image
   ↓
Push to ECR
   ↓
Update ECS
   ↓
Deploy
```

---

## Slide 83 — And Again...

Another change.

```text
Build
Push
Deploy
```

---

## Slide 84 — And Again...

Bug fix.

```text
Build
Push
Deploy
```

---

## Slide 85 — Humans Are Bad CI/CD Systems

```text
"Did you push the latest image?"

"Did you update ECS?"

"Which tag?"

"Was that production?"

```

---

# SECTION 13 — CI/CD

## Slide 86 — We Need Automation

# CI/CD

---

## Slide 87 — Continuous Integration

Developers frequently push code.

Automation checks the changes.

```text
Code
 ↓
Build
 ↓
Test
```

---

## Slide 88 — Continuous Delivery / Deployment

After validation:

```text
Build
 ↓
Package
 ↓
Publish
 ↓
Deploy
```

---

## Slide 89 — Our Pipeline

```text
Developer
    │
    │ git push
    ▼
  GitHub
    │
    ▼
GitHub Actions
    │
    ├── Test
    ├── Build
    ├── Push
    └── Deploy
            │
            ▼
           AWS
```

---

# SECTION 14 — GITHUB ACTIONS

## Slide 90 — GitHub Actions

GitHub Actions lets us automate workflows directly from GitHub.

---

## Slide 91 — Workflow File

```text
.github/
└── workflows/
    └── deploy.yml
```

---

## Slide 92 — Trigger

Example:

```yaml
on:
  push:
    branches:
      - main
```

Meaning:

```text
Push to main
      ↓
Run workflow
```

---

## Slide 93 — Checkout Code

```yaml
- uses: actions/checkout@v4
```

Now the runner has our source code.

---

## Slide 94 — Run Tests

Conceptually:

```yaml
- name: Run tests
  run: pytest
```

---

## Slide 95 — Build Image

```yaml
- name: Build image
  run: docker build -t task-manager .
```

---

## Slide 96 — Authenticate to ECR

Conceptually:

```text
GitHub Actions
      │
      │ AWS authentication
      ▼
     ECR
```

---

## Slide 97 — Push Image

```text
Docker Image
     ↓
GitHub Actions
     ↓
Amazon ECR
```

---

## Slide 98 — Deploy

```text
New Image
   ↓
ECS
   ↓
New Task
   ↓
Application Updated
```

---

## Slide 99 — Complete Pipeline

```text
                 git push
                    │
                    ▼
                 GitHub
                    │
                    ▼
             GitHub Actions
                    │
             ┌──────┴──────┐
             │             │
           Test          Build
             │             │
             └──────┬──────┘
                    │
                    ▼
                  ECR
                    │
                    ▼
             ECS / Fargate
                    │
                    ▼
             App Container
                    │
                    ▼
                 RDS
```

---

# SECTION 15 — WHAT HAPPENS WHEN WE PUSH?

## Slide 100 — Developer Pushes Code

```bash
git add .
git commit -m "Update task manager"
git push origin main
```

---

## Slide 101 — GitHub Detects Push

```text
push to main
      ↓
workflow starts
```

---

## Slide 102 — CI Starts

```text
Checkout
   ↓
Install dependencies
   ↓
Run tests
```

---

## Slide 103 — Docker Build

```text
Dockerfile
    ↓
Docker Build
    ↓
Image
```

---

## Slide 104 — Image Published

```text
Image
  ↓
Amazon ECR
```

---

## Slide 105 — Deployment

```text
ECS
 ↓
New Task
 ↓
New Container
 ↓
New Version
```

---

## Slide 106 — Users Get the Update

```text
User
 ↓
AWS
 ↓
ECS
 ↓
New Application Version
```

---

# SECTION 16 — FINAL HANDS-ON PROJECT

## Slide 107 — Final Challenge

# Take the Task Manager to Production

---

## Slide 108 — Starting Point

We already have:

```text
Streamlit
+
MySQL
+
Docker
+
Compose
+
Network
+
Volume
```

---

## Slide 109 — Step 1

# Verify the Application

Run:

```bash
docker compose up
```

---

## Slide 110 — Step 2

# Build Production Image

```bash
docker build \
  -t task-manager:1.0 .
```

---

## Slide 111 — Step 3

# Test the Image Locally

```bash
docker run \
  -p 8501:8501 \
  task-manager:1.0
```

---

## Slide 112 — Step 4

# Create ECR Repository

Repository:

```text
task-manager
```

---

## Slide 113 — Step 5

# Tag Image

```bash
docker tag task-manager:1.0 \
  <ECR-URL>/task-manager:1.0
```

---

## Slide 114 — Step 6

# Push Image

```bash
docker push \
  <ECR-URL>/task-manager:1.0
```

---

## Slide 115 — Step 7

# Create ECS Resources

Conceptually:

```text
ECS Cluster
     ↓
Task Definition
     ↓
Service
     ↓
Fargate
```

---

## Slide 116 — Step 8

# Configure Application

Environment:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

---

## Slide 117 — Step 9A

# Database Option A

Run MySQL as a container.

```text
ECS
 │
 ├── App
 │
 └── MySQL
       │
       ▼
   Persistent Storage
```

---

## Slide 118 — Step 9B

# Database Option B

Use Amazon RDS.

```text
ECS
 │
 └── App
      │
      ▼
     RDS
      │
      ▼
    MySQL
```

---

## Slide 119 — Compare During the Demo

Ask students:

### Which one requires more database management?

### Which one is easier to start locally?

### Which one would you prefer for a production application?

---

## Slide 120 — Step 10

# Connect the Application

Development:

```text
task-db:3306
```

Production:

```text
RDS-ENDPOINT:3306
```

---

## Slide 121 — Step 11

# Verify

Open the application.

Create a task.

Refresh.

Verify the task exists.

---

## Slide 122 — Step 12

# Test Persistence

If using containerized MySQL:

```text
Restart App
     ↓
Data remains
```

If using RDS:

```text
Restart App
     ↓
Database remains
```

---

## Slide 123 — Step 13

# GitHub Actions

Create:

```text
.github/workflows/deploy.yml
```

---

## Slide 124 — Step 14

# Push Code

```bash
git add .
git commit -m "Deploy task manager"
git push origin main
```

---

## Slide 125 — Step 15

# Watch the Pipeline

```text
GitHub
   ↓
Actions
   ↓
Test
   ↓
Build
   ↓
ECR
   ↓
ECS
```

---

## Slide 126 — Step 16

# Make Another Change

Change something visible.

For example:

```python
st.title("Task Manager 🚀")
```

---

## Slide 127 — Push Again

```bash
git add .
git commit -m "Update UI"
git push
```

---

## Slide 128 — Watch It Deploy

```text
Code
 ↓
CI/CD
 ↓
Docker
 ↓
ECR
 ↓
ECS
 ↓
Production
```

---

# SECTION 17 — THE BIG COMPARISON

## Slide 129 — Session 2

We learned:

```text
Dockerfile
   ↓
Image
   ↓
Container
```

---

## Slide 130 — Session 3

We learned:

```text
Container
    ↓
Network
    ↓
Multiple Containers
    ↓
Compose
```

---

## Slide 131 — Session 4

We learned:

```text
Container
    ↓
Image Registry
    ↓
Cloud
    ↓
Production Database
    ↓
CI/CD
```

---

## Slide 132 — Docker's Role

# Docker Packages the Application

```text
Code
+
Dependencies
+
Runtime
=
Container Image
```

---

## Slide 133 — ECR's Role

# ECR Stores the Image

```text
Image
 ↓
ECR
```

---

## Slide 134 — ECS's Role

# ECS Runs the Application

```text
ECR
 ↓
ECS
 ↓
Container
```

---

## Slide 135 — RDS's Role

# RDS Runs the Database

```text
Application
     ↓
RDS
     ↓
MySQL
```

---

## Slide 136 — GitHub Actions' Role

# Automates the Journey

```text
Code
 ↓
Test
 ↓
Build
 ↓
Push
 ↓
Deploy
```

---

# SECTION 18 — DEVELOPMENT VS PRODUCTION

## Slide 137 — Side by Side

### Development

```text
Laptop
 │
 ├── App Container
 │
 └── MySQL Container
        │
        ▼
      Volume
```

### Production

```text
AWS
 │
 ├── ECS/Fargate
 │      │
 │      └── App
 │
 └── RDS
        │
        └── MySQL
```

---

## Slide 138 — Why Change the Architecture?

Because production has different requirements.

```text
Development
=
Convenience

Production
=
Reliability + Operations
```

---

## Slide 139 — One More Important Idea

# Your architecture can evolve.

You don't have to keep:

```text
Development Architecture
=
Production Architecture
```

---

# SECTION 19 — WHAT ABOUT KUBERNETES?

## Slide 140 — We Didn't Use Kubernetes

And that's intentional.

---

## Slide 141 — Why?

Our goal was:

```text
Learn Docker
      ↓
Deploy Containers
      ↓
Understand Cloud
      ↓
Automate Deployment
```

Not:

```text
Learn 47 Kubernetes objects
```

---

## Slide 142 — Where Kubernetes Fits

At larger scale:

```text
Docker Images
      ↓
Kubernetes
      ↓
Many Containers
      ↓
Many Services
      ↓
Many Machines
```

---

## Slide 143 — Docker → Kubernetes

```text
Docker
=
Container technology

Kubernetes
=
Container orchestration
```

---

## Slide 144 — The Important Point

# Learn Docker first.

Then orchestration makes much more sense.

---

# SECTION 20 — DEBUGGING PRODUCTION

## Slide 145 — Something Will Break

Eventually.

Probably during the demo.

Definitely when you are presenting.

---

## Slide 146 — Debugging Mindset

Don't randomly change things.

Ask:

```text
Where does the failure occur?
```

---

## Slide 147 — Layer 1

# Application

Does the application work?

```text
Logs
Exceptions
Configuration
```

---

## Slide 148 — Layer 2

# Container

Is the container running?

```bash
docker ps
```

For ECS:

```text
Task Status
Container Status
Logs
```

---

## Slide 149 — Layer 3

# Network

Can the application reach the database?

```text
App
 ↓
Network
 ↓
Database
```

---

## Slide 150 — Layer 4

# Database

Is MySQL available?

Check:

```text
Host
Port
Credentials
Database
```

---

## Slide 151 — Layer 5

# Deployment

Is the correct image running?

Check:

```text
Image tag
Task definition
Running task
```

---

## Slide 152 — Debugging Flow

```text
User reports problem
        ↓
Application
        ↓
Container
        ↓
Network
        ↓
Database
        ↓
Deployment
```

---

# SECTION 21 — FINAL ARCHITECTURE

## Slide 153 — The Architecture We Built

```text
                         USERS
                           │
                           ▼
                    ┌─────────────┐
                    │     AWS     │
                    │             │
                    │ ECS/Fargate │
                    │      │      │
                    │      ▼      │
                    │  App        │
                    │ Container   │
                    └──────┬──────┘
                           │
                           ▼
                       Amazon RDS
                           │
                           ▼
                         MySQL
```

---

## Slide 154 — Where the Image Comes From

```text
Developer
    │
    ▼
  GitHub
    │
    ▼
GitHub Actions
    │
    ▼
Docker Build
    │
    ▼
   ECR
    │
    ▼
ECS / Fargate
```

---

## Slide 155 — Complete Pipeline

```text
                         ┌──────────────┐
                         │    GITHUB    │
                         └──────┬───────┘
                                │
                             git push
                                │
                                ▼
                       ┌─────────────────┐
                       │ GITHUB ACTIONS  │
                       └────────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
                  TEST        BUILD       CHECK
                                │
                                ▼
                         ┌────────────┐
                         │    ECR     │
                         └─────┬──────┘
                               │
                               ▼
                       ┌──────────────┐
                       │ ECS / FARGATE│
                       └──────┬───────┘
                              │
                              ▼
                         APP CONTAINER
                              │
                              ▼
                         AMAZON RDS
                              │
                              ▼
                            MYSQL
```

---

# SECTION 22 — THE COMPLETE DOCKER JOURNEY

## Slide 156 — Where We Started

```text
"It works on my machine."
```

---

## Slide 157 — Then

```text
"It works inside my container."
```

---

## Slide 158 — Then

```text
"My containers can communicate."
```

---

## Slide 159 — Then

```text
"My data survives."
```

---

## Slide 160 — Then

```text
"My image is in a registry."
```

---

## Slide 161 — Then

```text
"My container runs in AWS."
```

---

## Slide 162 — Then

```text
"My database is running in production."
```

---

## Slide 163 — Finally

```text
"I push code..."

       ↓

"...and the system deploys it."
```

---

# SECTION 23 — FINAL RECAP

## Slide 164 — Docker Mental Model

```text
Dockerfile
    ↓
Image
    ↓
Container
```

---

## Slide 165 — Development Mental Model

```text
Code
 ↓
Bind Mount
 ↓
Container
 ↓
Network
 ↓
Database
```

---

## Slide 166 — Production Mental Model

```text
Code
 ↓
Docker Build
 ↓
Image
 ↓
ECR
 ↓
ECS / Fargate
 ↓
Application
```

---

## Slide 167 — Database Mental Model

### Development

```text
MySQL Container
      ↓
Named Volume
```

### Production

```text
Application
      ↓
RDS
      ↓
MySQL
```

---

## Slide 168 — CI/CD Mental Model

```text
git push
   ↓
Test
   ↓
Build
   ↓
Push
   ↓
Deploy
```

---

## Slide 169 — The Big Picture

```text
                    CODE
                      │
                      ▼
                     GIT
                      │
                      ▼
                 CI / CD
                      │
                      ▼
                DOCKER BUILD
                      │
                      ▼
                   IMAGE
                      │
                      ▼
                 AMAZON ECR
                      │
                      ▼
                ECS / FARGATE
                      │
                      ▼
                APPLICATION
                      │
                      ▼
                    USERS


                 DATABASE
                     │
                     ▼
                AMAZON RDS
                     │
                     ▼
                   MYSQL
```

---

# SECTION 24 — WHAT YOU KNOW NOW

## Slide 170 — You Can Explain Docker

```text
What is an image?
What is a container?
What is a Dockerfile?
```

---

## Slide 171 — You Can Run Containers

```text
docker run
docker ps
docker stop
docker rm
```

---

## Slide 172 — You Can Build Images

```bash
docker build
```

---

## Slide 173 — You Understand Storage

```text
Container
    ↓
Volume
    ↓
Persistent Data
```

---

## Slide 174 — You Understand Networking

```text
Container
    ↓
Docker Network
    ↓
Container
```

---

## Slide 175 — You Understand Compose

```text
compose.yaml
     ↓
Multiple Services
     ↓
One Application
```

---

## Slide 176 — You Understand Registries

```text
Image
 ↓
ECR
 ↓
Cloud
```

---

## Slide 177 — You Understand Cloud Containers

```text
ECS
 ↓
Fargate
 ↓
Running Containers
```

---

## Slide 178 — You Understand Database Choices

```text
MySQL Container + Volume

            VS

Amazon RDS
```

---

## Slide 179 — You Understand CI/CD

```text
git push
   ↓
Automation
   ↓
Production
```

---

# SECTION 25 — FINAL CHALLENGE

## Slide 180 — Your Final Challenge

# Build It.

# Containerize It.

# Deploy It.

# Automate It.

---

## Slide 181 — Challenge Architecture

```text
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Docker
   │
   ▼
Amazon ECR
   │
   ▼
ECS / Fargate
   │
   ▼
Task Manager
   │
   ▼
Amazon RDS
```

---

## Slide 182 — Bonus Challenge

Try the alternative database architecture:

```text
ECS
 │
 ├── App
 │
 └── MySQL Container
        │
        ▼
   Persistent Storage
```

Then compare it with:

```text
ECS
 │
 └── App
      │
      ▼
     RDS
```

---

## Slide 183 — Discussion

Ask the room:

> If you were building a real application tomorrow, which database architecture would you choose?

---

## Slide 184 — Final Question

# What happens when you run:

```bash
git push
```

---

## Slide 185 — Answer

```text
GitHub
   ↓
GitHub Actions
   ↓
Tests
   ↓
Docker Build
   ↓
ECR
   ↓
ECS
   ↓
Application
   ↓
Users
```

---

# SECTION 26 — FINAL SLIDE

## Slide 186 — You Started Here

```text
"It works on my machine."
```

---

## Slide 187 — You End Here

```text
Code
 ↓
Docker
 ↓
Registry
 ↓
Cloud
 ↓
Database
 ↓
CI/CD
 ↓
Production
```

---

## Slide 188 — Final Message

# You didn't just learn Docker.

You learned how a containerized application moves from:

```text
Developer Laptop
        ↓
        Docker
        ↓
       Cloud
        ↓
     Production
```

---

## Slide 189 — Final Slide

# Build → Package → Run → Deploy → Automate

### That's the DevOps mindset.

---

# OPTIONAL DEMO CHEAT SHEET

## Local Application

```bash
docker compose up
```

---

## Build

```bash
docker build -t task-manager:1.0 .
```

---

## Run

```bash
docker run -p 8501:8501 task-manager:1.0
```

---

## Tag

```bash
docker tag task-manager:1.0 \
  <ECR-URL>/task-manager:1.0
```

---

## Push

```bash
docker push \
  <ECR-URL>/task-manager:1.0
```

---

## Git

```bash
git add .
git commit -m "Deploy application"
git push origin main
```

---

# FINAL WORKSHOP TAKEAWAY

```text
                    DEVOPS

                      │
                      ▼

                     GIT
                      │
                      ▼
                    CI/CD
                      │
                      ▼
                    DOCKER
                      │
                      ▼
                 CONTAINER IMAGE
                      │
                      ▼
                     ECR
                      │
                      ▼
                ECS / FARGATE
                      │
                      ▼
                 APPLICATION
                      │
                      ▼
                    USERS

                      +

                  DATABASE
                      │
              ┌───────┴───────┐
              ▼               ▼
        MYSQL CONTAINER      RDS
              │               │
              ▼               ▼
           VOLUME            MYSQL
```

# End

## Remember

> Build once.  
> Package consistently.  
> Deploy automatically.  
> Choose the right infrastructure for the job.