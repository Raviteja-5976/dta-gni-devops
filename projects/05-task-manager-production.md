# Project 5 — Task Manager in Production: AWS, Databases & CI/CD

**Session:** 4 — Docker to Production
**Slides:** Session 4, slides 13–22 (production image), 23–48 (ECR and ECS),
54–80 (database decision), 81–106 (CI/CD), 107–128 (hands-on), 180–185 (final challenge)

## Purpose

The Task Manager runs on your laptop. For real users, a new set of questions
appears:

- Where does it run?
- How do users reach it?
- Where does the image live?
- Where does the database live?
- How do we ship updates without a person typing deployment commands?

This is the capstone project. You take the application from Project 4 to AWS
and then automate the journey so that **a `git push` is the only manual step
left**. Along the way you'll make a real architecture decision, a database in
a container vs a managed database, and justify it.

```text
Code → Docker → Registry → AWS → Database → CI/CD → Production
```

## What you'll build

- A **production-ready image** of the Task Manager
- The image stored in **Amazon ECR**
- The app running on **Amazon ECS with Fargate**
- A production database: **Amazon RDS for MySQL** (Option B, recommended),
  or MySQL in a container (Option A, the bonus challenge)
- A **GitHub Actions** pipeline that tests, builds, pushes and deploys on every push to `main`

## Architecture

**Runtime: where requests go**

```text
Users
  │
  ▼
AWS networking (public endpoint)
  │
  ▼
ECS / Fargate
  │
  ▼
App container (:8501)
  │   private network
  ▼
Amazon RDS (MySQL)
```

**Delivery: where code goes**

```text
Developer ─ git push ─► GitHub ─► GitHub Actions
                                   ├── Test
                                   ├── Build
                                   ├── Push ──► Amazon ECR
                                   └── Deploy ─► ECS / Fargate
```

## Prerequisites

- Project 4 working locally with `docker compose up`
- An AWS account with permission to use ECR, ECS, RDS and IAM
- The AWS CLI installed and configured
- A GitHub repository for the Task Manager

> **Cost warning:** unlike every earlier project, this one spends money. RDS,
> Fargate tasks, load balancers and NAT gateways are billed while they run.
> Follow the **Clean up** section when you're done.

## Build steps

### Phase 1 — Make the image production-ready

Don't deploy your development environment blindly. Aim for an image that is
**small, predictable, secure and reproducible.**

1. **Pin dependencies** in `requirements.txt` (exact versions, e.g.
   `streamlit==<version>`) so every build installs the same thing.
2. **Copy the code into the image.** In Project 3 the code arrived through a
   bind mount. Production has no host folder to mount, so the Dockerfile must
   `COPY` everything the app needs.
3. **Keep secrets out of the image.** Never use
   `ENV DB_PASSWORD=...`: anyone who can pull the image can read it with
   `docker inspect`. Supply configuration at runtime.
4. **Don't run as root:**

   ```dockerfile
   RUN useradd -m appuser
   USER appuser
   ```

5. Keep `--server.address=0.0.0.0` so the app listens on the correct interface.

**Pre-deployment checklist**

- [ ] Small base image
- [ ] Dependencies pinned
- [ ] No secrets in the image
- [ ] Listens on `0.0.0.0`
- [ ] Configuration comes from environment variables
- [ ] Safe to restart

### Phase 2 — Verify locally

```bash
docker compose up                       # the app still works
docker build -t task-manager:1.0 .      # the production image builds
docker run -p 8501:8501 task-manager:1.0
```

Without database environment variables, the UI loads but database calls fail.
That's expected: it proves the image isn't secretly depending on your laptop.

### Phase 3 — Push the image to Amazon ECR

Create an ECR repository named `task-manager`, then authenticate Docker to it.
The login command isn't on the slides, but you need it:

```bash
aws ecr get-login-password --region <REGION> \
  | docker login --username AWS --password-stdin <ECR-URL>
```

`<ECR-URL>` is `<AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com`.

```bash
docker tag task-manager:1.0 <ECR-URL>/task-manager:1.0
docker push <ECR-URL>/task-manager:1.0
```

### Phase 4 — Choose and create the database

| | Option A: MySQL container | Option B: Amazon RDS |
|---|---|---|
| Who runs MySQL | You | AWS |
| Storage | A volume you provide | Managed storage |
| Backups, updates, scaling | You manage | AWS features |
| Production responsibility | Higher | Lower |

**Build Option B for the main project.** Create an RDS MySQL instance that:

- Lives in the **same VPC** as your ECS service
- Is **not publicly accessible**
- Has a security group allowing port **3306 only from the ECS tasks' security group**
- Has a `tasks` database (created with the instance, or on first connection)

The application code doesn't change. Only `DB_HOST` does:

```text
Development:  DB_HOST=task-db     (or db, in Compose)
Production:   DB_HOST=<RDS-ENDPOINT>
```

### Phase 5 — Run it on ECS with Fargate

Create, in order:

1. **Cluster:** a logical grouping for your resources
2. **Task definition:** how to run the container:
   - Image: `<ECR-URL>/task-manager:1.0`
   - CPU and memory
   - Container port `8501`
   - Environment: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`
   - `DB_PASSWORD` supplied as a **secret** from AWS Secrets Manager or
     Systems Manager Parameter Store, not as plain text
   - Logging to CloudWatch, so you can debug
3. **Service:** keeps the desired number of tasks running and replaces any that die
4. **Fargate:** runs the tasks without servers for you to manage

Expose the app to users, either by giving the task a public IP or, more
typically, through a load balancer, and allow inbound traffic to it in the
security group. Remember that a container listening on `8501` **isn't
automatically on the public internet.** You have to configure access.

### Phase 6 — Verify in production

1. Open the application's public address
2. Create a task
3. Refresh the page
4. Confirm the task still exists
5. **Persistence:** stop the running task and let the service start a new one.
   The data remains, because it lives in RDS, not the container.

### Phase 7 — Automate with GitHub Actions

Create `.github/workflows/deploy.yml`. The slides show these pieces; putting
them together into a working workflow is part of the exercise:

```yaml
on:
  push:
    branches:
      - main
```

```yaml
- uses: actions/checkout@v4

- name: Run tests
  run: pytest

- name: Build image
  run: docker build -t task-manager .
```

Your workflow must also:

- **Authenticate to AWS.** Prefer short-lived credentials via GitHub's OIDC
  integration over long-lived access keys stored as repository secrets.
- **Push to ECR** with a **unique tag per build**, such as the commit SHA. See
  the pitfalls table for why.
- **Deploy to ECS** by registering a new task definition revision with the new
  image and updating the service.

`pytest` needs at least one test to run. Add a small test, for example one that
checks a helper function returns the expected result, so the pipeline has a
real gate.

Then prove the pipeline end to end:

```bash
git add .
git commit -m "Deploy task manager"
git push origin main
```

Watch the **Actions** tab. Make a visible change:

```python
st.title("Task Manager 🚀")
```

Push again, and refresh the production URL once the pipeline finishes.

## Acceptance criteria

- [ ] The production image runs as a non-root user and contains no secrets
- [ ] `task-manager` exists in ECR with at least one pushed image
- [ ] An ECS service on Fargate keeps the app running
- [ ] The app is reachable from a public address
- [ ] Tasks are stored in RDS and survive the ECS task being replaced
- [ ] The database is not reachable from the public internet
- [ ] `DB_PASSWORD` comes from a secret store, not the task definition's plain environment
- [ ] A push to `main` runs tests, builds, pushes and deploys with no manual steps
- [ ] A visible code change reaches production through the pipeline alone

## Debugging, layer by layer

Don't change things at random. First work out **where** the failure is.

| Layer | Question | Where to look |
|-------|----------|---------------|
| 1. Application | Does the app work? | Logs, exceptions, configuration |
| 2. Container | Is it running? | `docker ps` locally; ECS task and container status |
| 3. Network | Can the app reach the database? | Security groups, VPC, `DB_HOST` |
| 4. Database | Is MySQL available? | Host, port, credentials, database name |
| 5. Deployment | Is the right image running? | Image tag, task definition revision, running task |

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| App in ECS shows an old version, or code is missing | The image relied on the Project 3 bind mount | `COPY` the source in the Dockerfile |
| Push succeeded but ECS still runs the old version | Reusing a tag like `latest` doesn't change the task definition, so nothing redeploys | Tag images uniquely (e.g. commit SHA) and register a new revision |
| Tasks fail with `CannotPullContainerError` | The task execution role lacks ECR permissions, or the task has no route to ECR | Grant the execution role ECR access; use a public IP or a NAT/VPC endpoints |
| App can't reach RDS | Security group doesn't allow 3306 from the ECS tasks | Allow inbound 3306 from the tasks' security group |
| `Can't connect to localhost:3306` in production | `DB_HOST` still points at a local name | Set `DB_HOST` to the RDS endpoint |
| App is running but unreachable | Container port isn't exposed publicly | Add a public IP or load balancer and open the security group |
| UI disconnects or resets with several tasks behind a load balancer | Streamlit keeps a websocket session per browser tab | Enable sticky sessions on the target group |
| Pipeline passes but deploys nothing | Tests ran, but the push or deploy step is missing or silently skipped | Check each job's logs in the Actions tab |

## Bonus challenge — the other database architecture

Build **Option A** as well: MySQL running as a container in ECS, with
persistent storage.

```text
ECS
 ├── App container
 └── MySQL container
        │
        ▼
   Persistent storage
```

On Fargate, a container's own storage is **ephemeral**. Persistent storage
means attaching an **Amazon EFS** volume, the cloud counterpart of Project 3's
named volume.

Then answer the questions from the slides:

- Which option requires more database management?
- Which is easier to start locally?
- Which would you choose for a production application tomorrow, and why?

The lesson to take away: **containers don't mean everything must be a
container.** Choose the right tool for each part.

## Clean up

To stop being billed, delete in roughly this order:

- The ECS service, then the cluster
- The RDS instance (take a final snapshot if you want to keep the data)
- Any load balancer and target groups
- Any NAT gateway and its Elastic IP
- Images in the ECR repository, then the repository
- The GitHub OIDC role or any access keys you created for the pipeline

## What you'll have learned

```text
Build → Package → Run → Deploy → Automate
```

You started with *"It works on my machine."* You end with *"I push code, and
the system deploys it."*
