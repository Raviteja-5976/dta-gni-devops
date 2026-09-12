# Project 6 — Task Manager in Production: Docker Hub, EC2 & HTTPS

**Session:** 4 — Docker to Production
**Slides:** Session 4, sections 03–15 (concepts) and section 16 (hands-on)
**Source folder:** `prj/step3/`

## Purpose

The Task Manager runs on your laptop, described in one `compose.yaml`. For real
users, a new set of questions appears:

- Where does the image live, so a machine that isn't yours can run it?
- What computer runs it, and stays on when you close your laptop?
- How do people find it — and how do they get a padlock in the address bar?
- Where do the passwords come from, if not a file in Git?
- How do you ship version two without breaking version one's data?

This is the capstone. You take the application from Project 5 and put it on the
public internet, on **one server you own**, with a domain name and a valid TLS
certificate.

```text
Code → Image → Docker Hub → EC2 → Compose → Caddy → HTTPS
```

## What this project is not

Say this out loud before you start, because it's the opposite of what most
"Docker on AWS" tutorials do:

| Not using | Why not |
|-----------|---------|
| Amazon ECR | Docker Hub is simpler and it's where `mysql` and `caddy` come from anyway |
| ECS / Fargate | New vocabulary — clusters, tasks, services — that hides the machine |
| Amazon RDS | MySQL runs as a container next to the app, on the same box |
| Kubernetes | A workshop of its own |
| GitHub Actions | Section 15 teaches what a pipeline *would* do; you deploy by hand |

The point is that **every moving part is one you can see and SSH into**. What
you learn here works on EC2, DigitalOcean, Hetzner, or a machine under a desk.

## What you'll build

A **Task Manager** on the public internet: your own domain, valid HTTPS, three
containers on one EC2 instance.

## Architecture

```text
                        Internet
                           │
                           │  tasks.example.com
                           ▼
                   ┌───────────────┐
                   │  DNS A record │
                   └───────┬───────┘
                           ▼
                  EC2 instance (Elastic IP)
  ┌────────────────────────────────────────────────────┐
  │  Docker Engine                                     │
  │                                                    │
  │   caddy  ──── :80 :443  ◄── the ONLY public ports  │
  │     │                                              │
  │     │ reverse_proxy app:5000                       │
  │     ▼                                              │
  │   app    ──── Flask + gunicorn (no published port) │
  │     │                                              │
  │     │ DB_HOST=db                                   │
  │     ▼                                              │
  │   db     ──── MySQL 8.4 (no published port)        │
  │     │                                              │
  │     └──► mysql_data ─┐                             │
  │                      ├─ named volumes on the       │
  │     caddy_data ──────┤   instance's disk           │
  │     caddy_config ────┘                             │
  │                                                    │
  │   network: internal (bridge)                       │
  └────────────────────────────────────────────────────┘
```

Only Caddy publishes ports. `app` and `db` have **no** `ports:` key at all —
they're reachable only from inside the `internal` network.

## Prerequisites

- [Project 5](05-task-manager-compose.md) working locally
- A Docker Hub account, and a **Personal Access Token** (not your password)
- An AWS account
- A domain name whose DNS you control
- An SSH client

## Project structure

```text
step3/
├── app.py                    ← identical to step1 / step2
├── templates/  static/       ← identical
├── Dockerfile                ← identical
├── requirements.txt          ← identical
├── .dockerignore             ← excludes .env and .git
├── .gitignore                ← excludes .env
├── compose.production.yaml   ← new
├── Caddyfile                 ← new
└── .env.example              ← new
```

The application did not change. Prove it before you start:

```powershell
git diff --no-index step2/app.py step3/app.py       # no output
git diff --no-index step2/Dockerfile step3/Dockerfile   # no output
```

Everything in this project is *around* the application.

## Build steps

### Phase 1 — Publish the image to Docker Hub

Create a Docker Hub repository named `taskmanager` (public or private). From the
`step3` directory:

```powershell
docker login -u YOUR_DOCKERHUB_USERNAME
docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0 .
docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0
```

At the password prompt, paste a **Personal Access Token**, not your Docker Hub
account password. A token can be scoped to read-or-write and revoked on its own;
your password can't.

> **Use a real version number, never `:latest`.** `IMAGE_TAG` in `.env` is the
> written record of what production is running. With `:latest` nobody can answer
> "which build is live?", and a rollback means rebuilding. With `1.0.0` a
> rollback is editing one line.

The `mysql` and `caddy` images are pulled from Docker Hub by the server. No AWS
image repository is involved.

### Phase 2 — Launch and secure the instance

1. Launch an **Ubuntu LTS** instance (`t3.micro` is fine) in a public subnet.
2. Create or select a key pair and save the `.pem` file somewhere you back up.
   AWS shows you the private key **once**.
3. Security group inbound rules — and nothing else:

   | Type | Port | Source |
   |------|------|--------|
   | SSH | 22 | **Your public IP only** |
   | HTTP | 80 | `0.0.0.0/0`, `::/0` |
   | HTTPS | 443 | `0.0.0.0/0`, `::/0` |

   Do **not** open 3306 (MySQL) or 5000 (Flask). Port 80 is needed even though
   the site runs on 443 — Let's Encrypt connects back on it to verify you
   control the domain.

4. Allocate an **Elastic IP** and associate it with the instance. Without one,
   stopping and starting the instance changes its address and your DNS record
   goes stale.

```powershell
ssh -i C:\path\to\ec2-key.pem ubuntu@YOUR_ELASTIC_IP
```

### Phase 3 — Install Docker on the server

Ubuntu doesn't ship Docker, and `apt install docker.io` gets you an old build
with no Compose plugin. Use Docker's own repository — the full command block is
in `step3/README.md`. The shape of it:

```bash
# 1. tools + Docker's GPG signing key
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 2. add the repository (see step3/README.md for the exact echo line)

# 3. install the engine and plugins
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# 4. run docker without sudo
sudo usermod -aG docker $USER
exit
```

**SSH in again.** Group membership is applied at login, so skipping the
reconnect gets you `permission denied` on every Docker command. Then:

```bash
docker --version
docker compose version
docker run hello-world
```

### Phase 4 — Copy the deployment files

Only three files go to the server. The code doesn't — it's inside the image.

```powershell
ssh -i C:\path\to\ec2-key.pem ubuntu@YOUR_ELASTIC_IP "mkdir -p ~/taskmanager"

scp -i C:\path\to\ec2-key.pem compose.production.yaml Caddyfile .env.example `
  ubuntu@YOUR_ELASTIC_IP:~/taskmanager/
```

#### What `compose.production.yaml` changes

| | `compose.yaml` (step2) | `compose.production.yaml` (step3) |
|---|---|---|
| App image | `build: .` | `${DOCKERHUB_USERNAME}/taskmanager:${IMAGE_TAG}` |
| Secrets | Written in the file | `${VARIABLES}` from `.env` |
| Published ports | app on 5000 | **caddy only**, on 80 and 443 |
| Restart policy | none | `unless-stopped` |
| Reverse proxy | none | `caddy` |
| Network | default | an explicit `internal` bridge |

`restart: unless-stopped` is what makes the site come back by itself after an
instance reboot — and it respects a deliberate `compose down`.

The `db` service keeps the healthcheck from Project 5, and it matters more here:
after a power event everything starts at once, so `condition: service_healthy`
is the difference between a clean boot and a crash loop.

### Phase 5 — Create the `.env`

```bash
cd ~/taskmanager
cp .env.example .env
chmod 600 .env
nano .env
```

`chmod 600` means owner read/write and nothing for anyone else. The default
`644` lets every user on the box read your database passwords.

Generate a **different** real value for each secret:

```bash
openssl rand -base64 36
```

| Variable | What it is |
|----------|-----------|
| `DOCKERHUB_USERNAME` | Your account, used to build the image name |
| `IMAGE_TAG` | The version running in production — the deploy record |
| `MYSQL_PASSWORD` | The app's database user |
| `MYSQL_ROOT_PASSWORD` | The database superuser — must differ from the above |
| `SECRET_KEY` | Signs Flask session cookies |
| `DOMAIN` | The exact hostname on your DNS record |
| `EMAIL` | Where Let's Encrypt sends expiry notices — use a real one |

If your Docker Hub repository is private, `docker login -u YOUR_USERNAME` on the
server too.

### Phase 6 — Point the domain, then start

Create an **A record** for your hostname pointing at the Elastic IP. For the
root domain use `@`; for a `www` alias add a CNAME.

**Wait for it to resolve before starting Caddy:**

```bash
nslookup tasks.example.com   # must return your Elastic IP
```

This order matters. Caddy asks Let's Encrypt for a certificate the moment it
starts, and Let's Encrypt verifies by connecting back to your domain on port 80.
Starting against a domain that doesn't resolve yet burns attempts against a rate
limit.

The whole TLS configuration is four lines:

```caddyfile
{$DOMAIN} {
    tls {$EMAIL}
    encode zstd gzip
    reverse_proxy app:5000
}
```

`reverse_proxy app:5000` is the Session 3 lesson one last time: the **service
name**, not `localhost`. Inside the Caddy container, `localhost` is Caddy.

Now start it:

```bash
docker compose --env-file .env -f compose.production.yaml pull
docker compose --env-file .env -f compose.production.yaml up -d
docker compose --env-file .env -f compose.production.yaml ps
```

That command is long and you'll type it a lot:

```bash
alias dcp='docker compose --env-file .env -f compose.production.yaml'
```

Open `https://YOUR_DOMAIN`. The app creates the `tasks` table on the first
request, exactly as it does locally.

> **Don't put Cloudflare or another proxy in front until the first certificate
> has been issued**, unless it's configured to allow normal HTTPS validation.

### Phase 7 — Ship version 1.0.1

Change something visible, then, **on your laptop**:

```powershell
docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1 .
docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1
```

**On the server**, set `IMAGE_TAG=1.0.1` in `.env`, then:

```bash
dcp pull app
dcp up -d app
```

Naming the service means only `app` is recreated. `db`, `mysql_data`,
`caddy_data` and the certificates are untouched.

**Rolling back** is the same thing with a smaller number: set `IMAGE_TAG=1.0.0`,
`dcp up -d app`. That takes about fifteen seconds, and it only works because you
never rebuilt a tag.

> There is a second or two of downtime during the swap. Zero-downtime deploys
> need two app containers and a proxy that drains connections — out of scope
> here, and worth knowing you don't have it.

## Test it

1. **Reachable:** open `https://YOUR_DOMAIN` on a phone, on mobile data — not on
   the machine you built it on
2. **Encrypted:** check the padlock, with no browser warning
3. **Working:** add, complete and delete a task
4. **Reboot:** reboot the instance from the AWS console; the site should come
   back on its own
5. **Deploy:** ship `1.0.1` and see the change live
6. **Data:** confirm your tasks survived the redeploy
7. **Rollback:** go back to `1.0.0`

## Acceptance criteria

- [ ] The site loads over HTTPS on a device you did not build it on
- [ ] The certificate is valid, with no browser warning
- [ ] All four task operations work
- [ ] Ports 3306 and 5000 are **not** open in the security group
- [ ] `docker port` shows published ports for `caddy` only
- [ ] No secret is baked into the image, and `.env` is not in Git
- [ ] `.env` is `chmod 600`
- [ ] Tasks survive an app redeploy and an instance reboot
- [ ] You shipped `1.0.1` and rolled back to `1.0.0`
- [ ] You can explain why the Caddyfile says `app:5000` and not `localhost:5000`

## The data question

MySQL runs as a container, and its data lives in a Docker volume **on the EC2
instance's disk**. That is a real, working choice — and it means:

| | MySQL container (what we do) | Managed database (RDS etc.) |
|---|---|---|
| Cost | Included in the instance | A separate bill |
| Setup | Minutes | Longer, plus networking |
| Backups | You script them | A checkbox |
| Upgrades | You plan them | Managed |
| Survives losing the server | **No** | Yes |

> **Take backups.** Terminating the instance destroys the volume with it.

```bash
# a readable dump you can copy off the box
dcp exec db mysqldump -u root -p tasks > tasks-backup.sql
```

Also take EBS snapshots — snapshots protect the machine, dumps protect the data
in a form you can inspect and restore anywhere. You want both.

You'd move the database out when losing the data would end the project, when you
need more than one app server, or when nobody on the team wants to own backups.
If you do, the only change is `DB_HOST`. `app.py` has never changed, all
workshop.

## Debugging checklist

Work **outside in**. Never start at the database.

| What you see | What it means |
|---|---|
| Browser can't connect | DNS, the security group, or Caddy is down |
| Connection times out | Security group (a refusal means it reached the box) |
| Certificate warning | Caddy couldn't get a certificate — read `dcp logs caddy` |
| **502 Bad Gateway** | Caddy is up; `app` is not reachable |
| "Database unavailable" | `app` is up; MySQL is not reachable |
| The old version is served | `IMAGE_TAG`, or you skipped `dcp pull app` |

```bash
nslookup YOUR_DOMAIN     # 1. DNS
dcp ps                   # 2. all three up? db healthy?
dcp logs caddy           # 3. certificates
dcp logs app             # 4. the application
dcp logs db              # 5. the database
dcp exec app sh -c 'env | grep DB_'   # 6. what config did it actually get?
```

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `permission denied` on every docker command | You didn't reconnect after `usermod -aG docker` | `exit`, then SSH in again |
| `could not get certificate: no valid A records` | DNS hadn't propagated when Caddy started | Wait for `nslookup`, then `dcp restart caddy` |
| Certificate requests keep failing | Port 80 closed, or a proxy in front | Open 80; remove the proxy until the first cert is issued |
| 502 Bad Gateway | `reverse_proxy localhost:5000` | It must be `app:5000` — inside Caddy, localhost is Caddy |
| `denied: requested access to the resource is denied` on push | Tag missing your username prefix, or logged in as someone else | `docker login -u YOUR_USERNAME`, retag with the prefix |
| Changed `MYSQL_PASSWORD`, MySQL still rejects it | Those variables apply only when the volume is **first** initialised | A new password needs a fresh volume — which deletes the data |
| Site doesn't come back after a reboot | Missing `restart: unless-stopped` | It's in `compose.production.yaml`; check you're using that file |
| Everything gone after a cleanup | `down -v` deleted `mysql_data` **and** `caddy_data` | Plain `down`. `-v` also destroys your certificates |
| Deployed but the old version is live | Edited `.env` without pulling | `dcp pull app && dcp up -d app` |

**Security note:** the passwords in `.env` are the only thing between the
internet and your database. Generate them with `openssl rand`, never reuse the
workshop values from step1/step2, and never commit the file.

## Where CI/CD fits

You deployed by hand — build, push, SSH, edit `.env`, pull, up. Seven steps for
one line of HTML, and the process lives in one person's head.

A pipeline would do exactly those steps:

| You did | A pipeline would |
|---------|------------------|
| Pick a version number | Use the commit SHA |
| `docker build` | `docker build`, on a runner |
| `docker push` | `docker push`, with a stored token |
| Find the `.pem` and SSH in | SSH with a stored deploy key |
| Edit `.env` by hand | Set `IMAGE_TAG` from the build |
| `pull` + `up -d app` | The same two commands |

It would need three GitHub secrets: a Docker Hub token, an SSH private key, and
the server's hostname. Writing that workflow is the stretch goal below.

The order matters, though: **do it by hand, then automate what you did.** A
pipeline for a process you've never performed is one nobody can debug.

## Stretch goals

- Add a non-root user to the `Dockerfile` (`RUN useradd -m appuser` / `USER appuser`)
- Add a healthcheck to the `app` service so Caddy isn't guessing
- Take a `mysqldump` and restore it into a fresh volume — prove the backup works
- Write the GitHub Actions workflow: build, push, SSH, `pull`, `up -d app`
- Move the secrets out of `.env` and into AWS SSM Parameter Store

## Before you leave

AWS bills by the hour, and an **unattached Elastic IP is charged**:

- [ ] `mysqldump` if you want to keep the data
- [ ] Terminate the instance, or accept the running cost
- [ ] Release the Elastic IP
- [ ] Remove the DNS record

## That's the workshop

```text
Session 1  “It works on my machine.”
Session 2  “It works inside my container.”
Session 3  “My whole application starts with one command.”
Session 4  “Anyone in the world can open it, safely.”
```
