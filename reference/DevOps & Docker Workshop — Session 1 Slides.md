# DevOps & Docker Workshop — Session 1

## Session Title
**From "It Works on My Machine" to Docker**

### Session Theme
A story-driven introduction to DevOps, Virtual Machines, Containers, Docker, Kubernetes, CI/CD, GitHub Actions, and Terraform.

### Audience
Developers / students with basic programming knowledge.

### Session Goal
By the end of this session, students should understand:
- Why DevOps emerged
- Why application environments became a problem
- Why virtualization became useful
- Why containers became useful
- What Docker is
- What Kubernetes, CI/CD, GitHub Actions, and Terraform do at a high level
- Where Docker fits into the larger DevOps ecosystem

### Presentation Style
- Story-driven
- Minimal text
- One major idea per slide
- Use diagrams and illustrations instead of paragraphs
- Use large typography
- Use the same characters throughout the story
- Keep the visual language consistent
- Add occasional sarcastic developer humor
- Do NOT turn the introduction into a deep technical lecture
- Technical details will be covered in later sessions

---

# SLIDE 01 — Title

## Text

**DevOps & Docker Workshop**

### Session 1
**From "It Works on My Machine" to Docker**

### Visual

A developer staring at a laptop with a frustrated expression.

On the laptop:

```text
Works on my machine.
```

Behind the developer, show a chaotic server room.

### Speaker Note

"Today we're going to find out why this sentence has caused so many problems in software engineering."

---

# SLIDE 02 — Today's Story

## Text

**Meet Lehar Loom.**

### Visual

Create a fictional Indian e-commerce clothing company called:

**LEHAR LOOM**

Show an attractive ethnic-wear e-commerce website on a laptop.

### Speaker Note

"Lehar Loom sells ethnic wear online. And like every company, they just want one simple thing: a website that works."

---

# SLIDE 03 — Meet Sam

## Text

**Meet Sam.**

### Visual

Show Sam as a senior developer sitting at his desk.

Laptop + coffee + multiple monitors.

### Small visual labels

```text
Senior Developer
Sam
```

### Speaker Note

"Sam is the senior developer. Which means, naturally, everyone thinks he knows everything."

---

# SLIDE 04 — The Simple Beginning

## Text

**One application. One server.**

### Visual

Simple architecture:

```text
Lehar Loom
     ↓
Physical Server
```

Show the server physically sitting inside the company's office.

### Speaker Note

"Life is simple. One application. One server. One developer responsible for everything."

---

# SLIDE 05 — Sam Does Everything

## Text

**Sam builds it. Sam deploys it. Sam fixes it.**

### Visual

Three versions of Sam:

```text
Sam → Developer
Sam → SysAdmin
Sam → Support
```

### Joke

**"Congratulations. You are now the entire IT department."**

---

# SLIDE 06 — The Website Works

## Text

**And it works! 🎉**

### Visual

Show Lehar Loom website successfully running.

Customers buying clothes.

Orders flowing in.

### Speaker Note

"For a while, everything is perfect."

---

# SLIDE 07 — The Company Grows

## Text

**Then Lehar Loom gets ambitious.**

### Visual

Show a growth arrow.

```text
Clothes
   ↓
Candles
   ↓
Furniture
   ↓
More businesses...
```

---

# SLIDE 08 — Introducing Lehar Candles

## Text

**Welcome, Lehar Candles.**

### Visual

Split screen:

Left:
**Lehar Loom**

Right:
**Lehar Candles**

Both have separate websites.

---

# SLIDE 09 — Sam Builds Another Application

## Text

**Sam builds another website.**

### Visual

Two application boxes:

```text
LEHAR LOOM
Application A

LEHAR CANDLES
Application B
```

Both running on the same physical server.

---

# SLIDE 10 — The First Problem

## Text

**They need different dependencies.**

### Visual

Show:

```text
Loom
Node 20
Package X v2

Candles
Node 18
Package X v1
```

Use visual warning icons.

---

# SLIDE 11 — Dependency Conflict

## Text

**And now... things get interesting.**

### Visual

Two applications pulling on the same package/version.

```text
Loom ─────┐
          ├── Package X
Candles ──┘
```

Package X is being pulled in opposite directions.

---

# SLIDE 12 — The Developer's Worst Fear

## Text

**"If I upgrade this... what breaks?"**

### Visual

Sam staring nervously at a terminal.

Terminal:

```text
npm update
```

Then multiple red error messages exploding around him.

---

# SLIDE 13 — Virtual Machines

## Text

**So Sam isolates the applications.**

### Visual

Show physical server → hypervisor → two VMs.

```text
Physical Server
       ↓
   Hypervisor
    ↙      ↘
  VM 1     VM 2
 Loom     Candles
```

---

# SLIDE 14 — Isolation Works

## Text

**Now each application gets its own environment.**

### Visual

VM 1:

```text
Linux
Node 20
Loom
```

VM 2:

```text
Linux
Node 18
Candles
```

---

# SLIDE 15 — But There Is a Catch

## Text

**Every VM needs an operating system.**

### Visual

Show two large operating-system blocks underneath two applications.

Emphasize duplicated OS resources.

---

# SLIDE 16 — More Applications

## Text

**Then Lehar launches 10 more applications.**

### Visual

Show a physical server filled with many VMs.

```text
VM
VM
VM
VM
VM
VM
VM
VM
VM
VM
```

### Joke

**"At this point, the server has more roommates than Sam."**

---

# SLIDE 17 — The Team Grows

## Text

**Sam hires more developers.**

### Visual

Show:

```text
Sam
Priya
Rahul
Anita
```

working on the same project.

---

# SLIDE 18 — Priya Runs the Application

## Text

**Priya clones the project.**

### Visual

Terminal:

```bash
git clone ...
npm install
npm run dev
```

---

# SLIDE 19 — 💥

## Text

**It doesn't work.**

### Visual

Huge terminal error.

Priya looking confused.

---

# SLIDE 20 — The Famous Sentence

## Text

# "It works on my machine."

### Visual

Sam confidently pointing at his laptop.

Priya pointing at her broken laptop.

### Joke

**Developer translation: "Your problem is now a feature."**

---

# SLIDE 21 — The Real Problem

## Text

**The application isn't just the source code.**

### Visual

Show:

```text
Application
+
Runtime
+
Dependencies
+
Libraries
+
Configuration
```

---

# SLIDE 22 — Sam Has an Idea

## Text

**"What if we package all of this together?"**

### Visual

Show application code, Node.js, libraries, dependencies, and configuration being packed into one box.

---

# SLIDE 23 — Enter Containers

## Text

**Containers.**

### Visual

Show several isolated application containers sharing the same host operating system.

```text
Container    Container    Container
   │            │            │
   └────────────┼────────────┘
                │
             Host OS
```

---

# SLIDE 24 — Enter Docker

## Text

# Docker

### Subtitle

**Build once. Run consistently.**

### Visual

Show:

```text
Code
 ↓
Docker Image
 ↓
Container
```

---

# SLIDE 25 — Docker Image

## Text

**An image is the package.**

### Visual

A Docker image represented as a shipping box.

Inside the box:

```text
App
Runtime
Dependencies
Libraries
```

---

# SLIDE 26 — Docker Container

## Text

**A container is a running instance of that image.**

### Visual

Show:

```text
       Docker Image
            │
      ┌─────┴─────┐
      ↓           ↓
 Container     Container
```

---

# SLIDE 27 — But Lehar Keeps Growing...

## Text

**Now imagine 100 containers.**

### Visual

Hundreds of containers filling the screen.

Show labels:

```text
Frontend
Backend
Workers
Database
Redis
API
...
```

---

# SLIDE 28 — New Problem

## Text

**"Who is going to manage all of these?"**

### Visual

Sam buried under hundreds of Docker containers.

### Joke

Sam's expression should communicate:

**"I regret everything."**

---

# SLIDE 29 — Kubernetes

## Text

# Kubernetes

### Subtitle

**Docker helps run containers. Kubernetes helps manage them at scale.**

### Visual

Show Kubernetes controlling many containers.

```text
              Kubernetes
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Frontend     Backend      Worker
   Containers   Containers   Containers
```

---

# SLIDE 30 — Kubernetes: The Simple Idea

## Text

**"Keep my containers running."**

### Visual

Show:

```text
Container crashes
       ↓
Kubernetes
       ↓
New container
```

### Speaker Note

"That's enough Kubernetes for today. We are not opening the Kubernetes rabbit hole yet."

---

# SLIDE 31 — Another Problem

## Text

**The company is releasing code every day.**

### Visual

Show developers constantly pushing code.

```text
Monday → Feature
Tuesday → Bug fix
Wednesday → Feature
Thursday → Bug fix
Friday → "Small change"
```

---

# SLIDE 32 — Manual Deployment

## Text

**Someone has to build, test and deploy all of this.**

### Visual

Show a tired developer manually doing:

```text
Build
 ↓
Test
 ↓
Docker Build
 ↓
Deploy
```

### Joke

**"Automation sounds expensive... until you calculate the cost of doing it manually forever."**

---

# SLIDE 33 — CI/CD

## Text

# CI/CD

### Subtitle

**Automate the journey from code to production.**

### Visual

Pipeline:

```text
Code
 ↓
Build
 ↓
Test
 ↓
Deploy
```

---

# SLIDE 34 — Continuous Integration

## Text

**CI = Automatically build and test changes.**

### Visual

```text
Git Push
   ↓
Build
   ↓
Test
```

Show a green checkmark when tests pass.

---

# SLIDE 35 — Continuous Delivery / Deployment

## Text

**CD = Automatically deliver changes.**

### Visual

```text
Build
 ↓
Test
 ↓
Deploy
 ↓
Production
```

---

# SLIDE 36 — GitHub Actions

## Text

# GitHub Actions

### Subtitle

**One way to implement CI/CD.**

### Visual

GitHub repository connected to a pipeline:

```text
GitHub
  ↓
GitHub Actions
  ↓
Build → Test → Deploy
```

---

# SLIDE 37 — The Infrastructure Gets Bigger

## Text

**Now the infrastructure is getting complicated.**

### Visual

Show AWS-style cloud infrastructure:

```text
VPC
EC2
Load Balancer
Database
Storage
Kubernetes
Networking
```

---

# SLIDE 38 — The Clicking Problem

## Text

**"Sam, recreate production."**

### Visual

Sam clicking through an imaginary cloud console.

Hundreds of settings.

### Joke

**"ClickOps: because apparently infrastructure deserves a memory test."**

---

# SLIDE 39 — Terraform

## Text

# Terraform

### Subtitle

**Infrastructure as Code.**

### Visual

Show:

```text
Terraform Code
      ↓
   Terraform
      ↓
Cloud Infrastructure
```

---

# SLIDE 40 — Infrastructure Becomes Code

## Text

**Instead of clicking infrastructure into existence...**

### Visual

Left:

```text
Click
Click
Click
Click
Click
```

Right:

```text
infrastructure.tf
```

---

# SLIDE 41 — The DevOps Map

## Text

**Now connect the pieces.**

### Visual

Create a clean ecosystem diagram:

```text
                 DEVOPS
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Docker     CI/CD     Terraform
        ↓          ↓          ↓
  Containers  Automation Infrastructure
        ↓
   Kubernetes
```

---

# SLIDE 42 — The Full Journey

## Text

**Code → Container → Deployment → Infrastructure**

### Visual

A cinematic pipeline:

```text
Developer
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Docker
    ↓
Container Registry
    ↓
Kubernetes
    ↓
Cloud
```

Terraform should appear underneath the cloud infrastructure layer.

---

# SLIDE 43 — What Is DevOps?

## Text

**DevOps is the bigger picture.**

### Visual

Show a continuous loop:

```text
Plan
 ↓
Code
 ↓
Build
 ↓
Test
 ↓
Release
 ↓
Deploy
 ↓
Operate
 ↓
Monitor
 ↺
```

---

# SLIDE 44 — One-Line Definitions

## Text

Use four separate visual cards.

### Card 1

**Docker**

Package and run applications consistently.

### Card 2

**Kubernetes**

Manage containers at scale.

### Card 3

**CI/CD**

Automate software delivery.

### Card 4

**Terraform**

Manage infrastructure as code.

---

# SLIDE 45 — Where Does GitHub Actions Fit?

## Text

**GitHub Actions is the automation engine.**

### Visual

```text
Developer
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Build
Test
Deploy
```

---

# SLIDE 46 — The Big Picture

## Text

# DevOps ≠ Docker

### Subtitle

**Docker is one piece of the DevOps ecosystem.**

### Visual

Show DevOps as a large puzzle.

Pieces:

```text
Culture
Automation
CI/CD
Docker
Kubernetes
Cloud
Terraform
Monitoring
Security
```

Docker should be highlighted.

---

# SLIDE 47 — But Today...

## Text

# We Zoom In.

### Visual

Show the large DevOps ecosystem and a camera zooming toward Docker.

---

# SLIDE 48 — Today's Focus

## Text

# DOCKER

### Visual

Large Docker container/whale-inspired visual.

Underneath:

```text
Images
Containers
Dockerfile
Networking
Volumes
Compose
```

Do not explain these yet.

---

# SLIDE 49 — The Question

## Text

# What exactly happens when I run:

```bash
docker run
```

### Visual

Show the command entering a Docker engine and producing a running container.

---

# SLIDE 50 — Let's Find Out

## Text

# Welcome to Docker.

### Subtitle

**Let's build something.**

### Visual

Transition from the Lehar Loom story into a real terminal/Docker environment.

---

# END OF SESSION 1 INTRODUCTION

## Instructor Transition

Say:

> "We started with a company that had one server."

> "Then they had dependency conflicts."

> "Then they used virtual machines."

> "Then the number of applications grew."

> "Then deployments became painful."

> "Then infrastructure became painful."

> "And eventually we arrived at Docker, Kubernetes, CI/CD, GitHub Actions and Terraform."

> "You don't need to master all of those today."

> "You only need to understand where they fit."

> "And now we're going to spend the rest of this workshop understanding Docker."

---

# Visual Design Guidelines

## Overall Style

Use a modern developer / technology workshop aesthetic.

- Dark background
- Large white typography
- Minimal text
- High contrast
- Clean diagrams
- Terminal-style elements
- Subtle developer humor
- Avoid corporate stock photography

## Character Continuity

Keep the same fictional characters throughout:

### Sam
Senior developer.

Appearance:
- 30–40 years old
- Casual developer clothing
- Laptop
- Slightly tired expression

### Priya
Developer joining the team.

Appearance:
- Young software developer
- Laptop
- Curious/confused expression when the application fails

## Company

Use fictional company:

**Lehar Loom**

Secondary brand:

**Lehar Candles**

Keep branding consistent throughout the presentation.

---

# Image Generation Instructions

For slides that need custom illustrations, generate visuals rather than using generic stock images.

## Image 1 — Sam

Illustration of a senior Indian software developer named Sam sitting at a developer workstation, multiple monitors, terminal windows, coffee cup, modern software engineering office, slightly tired but confident expression, cinematic technology illustration.

## Image 2 — Lehar Loom

Modern Indian ethnic clothing e-commerce company website shown on laptop and mobile phone, colorful traditional clothing products, clean modern e-commerce UI, fictional brand "Lehar Loom".

## Image 3 — Physical Server

Small company's physical server room with one server rack, an engineer configuring it, realistic but slightly playful technology illustration.

## Image 4 — Virtual Machines

Clean technical illustration showing one physical server, a hypervisor layer, and multiple virtual machines, each containing its own operating system and application.

## Image 5 — Dependency Conflict

Playful illustration showing two software applications pulling a package dependency in opposite directions, developer looking worried, humorous technology illustration.

## Image 6 — Containers

Clean technical illustration showing multiple isolated application containers sharing one host operating system kernel.

## Image 7 — Docker

Modern Docker-themed illustration showing an application packaged into an image and launched as multiple containers.

## Image 8 — Kubernetes

Clean technical illustration showing Kubernetes orchestrating many containers across multiple machines, with one crashed container being automatically replaced.

## Image 9 — CI/CD

Modern pipeline illustration:

Developer → GitHub → Build → Test → Docker → Deploy

## Image 10 — Terraform

Infrastructure-as-code illustration showing Terraform configuration on a laptop creating cloud infrastructure such as servers, networks, databases, and load balancers.

---

# Humor Guidelines

Use humor occasionally.

Do not turn every slide into a joke.

Recommended jokes:

### Joke 1

**"Congratulations. You are now the entire IT department."**

Use when Sam is developer + sysadmin + support.

### Joke 2

**"It works on my machine."**

Follow with:

**Developer translation: "Your problem is now a feature."**

### Joke 3

**"At this point, the server has more roommates than Sam."**

Use when introducing many virtual machines.

### Joke 4

**"I regret everything."**

Use when Sam sees hundreds of containers.

### Joke 5

**"ClickOps: because apparently infrastructure deserves a memory test."**

Use before Terraform.

### Joke 6

**"We'll learn Kubernetes later. Your laptop has suffered enough."**

Use when briefly introducing Kubernetes.

---

# Important Presentation Rules

1. Do not put paragraphs on slides.
2. Maximum one major sentence per slide.
3. Prefer diagrams over bullet points.
4. Use large text.
5. Use animations/transitions only when they help the story.
6. Keep Sam and Priya visually consistent.
7. Do not explain Docker internals in Session 1.
8. Do not deep dive into Kubernetes.
9. Do not deep dive into CI/CD.
10. Do not deep dive into GitHub Actions.
11. Do not deep dive into Terraform.
12. The purpose of these technologies is to give students the **DevOps map**.
13. Docker is the primary focus.
14. Build curiosity before introducing technical terminology.
15. The story should feel like a problem-solving journey rather than a list of definitions.

---

# Core Narrative

The presentation should communicate this progression:

**One server**

↓

**Multiple applications**

↓

**Dependency conflicts**

↓

**Virtual Machines**

↓

**Too much infrastructure**

↓

**"It works on my machine"**

↓

**Containers**

↓

**Docker**

↓

**Too many containers**

↓

**Kubernetes**

↓

**Too many manual deployments**

↓

**CI/CD**

↓

**GitHub Actions**

↓

**Too much manual infrastructure**

↓

**Terraform**

↓

**Modern DevOps**

↓

# **Now let's learn Docker.**