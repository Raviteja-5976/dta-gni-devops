import type { SlideData } from "./slides";
import type {
  Panel,
  SlideBlock,
  TerminalLine,
  Tone,
} from "@/components/slides/blocks/types";

/* ===========================================================
   SESSION 4 — DOCKER TO PRODUCTION
   AWS, Databases & CI/CD. The final session: 189 slides from the
   reference, plus a two-slide appendix (demo cheat sheet, takeaway).

   At this size, literal slide objects become a numbering hazard, so
   this deck is written with small builders: `section()` sets the
   chapter, `slide()` appends with an auto-incrementing number, and the
   block helpers below keep each slide to its content. The output is
   the same SlideData[] every other deck produces.

   Like Session 3, no fictional cast — the Task Manager is the
   through-line, now on its way to a real server.

   The project is prj/step3: the same Flask + MySQL application as
   step1/step2, published to Docker Hub and run on one EC2 instance
   with Caddy in front for HTTPS. No ECR, ECS, Fargate or RDS — those
   appear only as short "what else exists" asides. CI/CD is taught as
   a concept in section 15, not as a lab step, because step3 deploys
   by hand on purpose. Commands, file contents and names on these
   slides match prj/step3 exactly.
   =========================================================== */

/* --- Deck builders ----------------------------------------- */

const deck: SlideData[] = [];
let chapter = "";

function section(label: string) {
  chapter = label;
}

interface Meta {
  title: string;
  note: string;
  subtitle?: string;
  badge?: string;
  joke?: string;
}

function slide({ title, note, subtitle, badge, joke }: Meta, ...blocks: SlideBlock[]) {
  const n = deck.length + 1;
  deck.push({
    id: n,
    slideNumber: n,
    chapter,
    title,
    subtitle,
    badge,
    joke,
    speakerNote: note,
    blocks,
  });
}

/* --- Block helpers ----------------------------------------- */

const flow = (
  steps: string[],
  o: { tone?: Tone; vertical?: boolean; last?: boolean } = {}
): SlideBlock => ({
  kind: "flow",
  steps,
  tone: o.tone,
  orientation: o.vertical ? "vertical" : "horizontal",
  highlightLast: o.last,
});

const cmd = (c: string): TerminalLine => ({ cmd: c });
const out = (o: string): TerminalLine => ({ out: o });
const comment = (c: string): TerminalLine => ({ comment: c });
const term = (...lines: TerminalLine[]): SlideBlock => ({ kind: "terminal", lines });

const code = (
  filename: string,
  language: "dockerfile" | "yaml" | "python" | "bash" | "text",
  source: string
): SlideBlock => ({ kind: "code", filename, language, code: source });

const panel = (
  title: string,
  tone: Tone,
  lines: string[],
  o: { mono?: boolean; note?: string } = {}
): Panel => ({ title, tone, lines, ...o });

const split = (left: Panel, right: Panel): SlideBlock => ({ kind: "split", left, right });

const bullets = (items: string[], tone?: Tone, columns?: 1 | 2): SlideBlock => ({
  kind: "bullets",
  items,
  tone,
  columns,
});

const statement = (text: string, sub?: string, tone?: Tone): SlideBlock => ({
  kind: "statement",
  text,
  sub,
  tone,
});

const callout = (text: string, tone?: Tone, label?: string): SlideBlock => ({
  kind: "callout",
  text,
  tone,
  label,
});

const box = (title: string, lines?: string[], tone?: Tone) => ({ title, lines, tone });

const boxes = (items: ReturnType<typeof box>[], connector?: string): SlideBlock => ({
  kind: "boxes",
  boxes: items,
  connector,
});

const annotated = (
  source: string,
  notes: { label: string; text: string }[],
  o: { filename?: string; language?: "yaml" | "dockerfile" | "bash" } = {}
): SlideBlock => ({ kind: "annotated", code: source, notes, ...o });

/* ===========================================================
   SECTION 1 — WHERE WE ARE
   =========================================================== */
section("01 / WHERE WE ARE");

slide(
  {
    title: "Docker to Production",
    subtitle: "The final workshop session — from a container on your laptop to a website strangers can visit.",
    badge: "SESSION 4",
    note: "Last session. Today the Task Manager leaves the laptop and gets a domain name.",
  },
  boxes([
    box("Docker Hub", ["where the image lives"], "sky"),
    box("EC2", ["where it runs"], "orange"),
    box("HTTPS", ["how users reach it"], "mint"),
  ])
);

slide(
  {
    title: "The journey so far",
    badge: "FOUR SESSIONS",
    note: "Each session answered one question. Today answers the last one.",
  },
  boxes([
    box("Session 1", ["Why Docker?"], "ink"),
    box("Session 2", ["How Docker works"], "ink"),
    box("Session 3", ["How we develop with it"], "ink"),
    box("Session 4", ["How we ship it"], "orange"),
  ])
);

slide(
  {
    title: "What we built",
    subtitle: "The local Task Manager, from step2.",
    badge: "RECAP",
    note: "Session 3's architecture, end to end. Everything today starts from here.",
  },
  flow(["Browser", "Flask container", "Docker network", "MySQL container", "Named volume"], {
    last: true,
  })
);

slide(
  {
    title: "It works!",
    subtitle: "localhost:5000",
    badge: "STATUS",
    note: "Let them enjoy this for a second before the next slide takes it away.",
  },
  bullets(
    [
      "One command starts the whole application",
      "The database waits until it is healthy",
      "Data survives docker compose down",
    ],
    "mint",
    1
  )
);

slide(
  { title: "But…", badge: "THE QUESTION", note: "Pause. Let the question hang." },
  statement("Who else can use it?", undefined, "coral")
);

slide(
  {
    title: "Nobody, is the answer",
    subtitle: "localhost means your machine and no other.",
    badge: "THE GAP",
    note: "Close the laptop and the application ceases to exist for everyone, including you.",
  },
  split(
    panel("What you have", "ink", ["http://localhost:5000"], { mono: true }),
    panel("What you need", "orange", ["https://tasks.example.com"], {
      mono: true,
      note: "Reachable, always on, encrypted",
    })
  )
);

slide(
  {
    title: "New questions",
    subtitle: "If real users are going to depend on this…",
    badge: "PRODUCTION",
    note: "Every question here gets answered by a section of today's session.",
  },
  bullets(
    [
      "Where does the image live?",
      "What computer runs it?",
      "How do users find it?",
      "How do we get a padlock in the browser?",
      "Where do the passwords come from?",
      "How do we ship version two?",
      "What happens when the server reboots?",
      "Who has the backups?",
    ],
    "sky",
    2
  )
);

slide(
  {
    title: "Today's goal",
    subtitle: "By the end of this session.",
    badge: "THE PLAN",
    note: "The map for the whole session. Come back to it at each section break.",
  },
  flow(["Code", "Image", "Docker Hub", "EC2", "Compose", "Caddy", "HTTPS"], { last: true })
);

slide(
  {
    title: "One server, three containers",
    subtitle: "That is the entire production architecture.",
    badge: "SPOILER",
    note: "Say up front how small this is. It is a real deployment, and it fits on one slide.",
  },
  flow(
    ["Internet", "domain", "EC2 Elastic IP", "Caddy (HTTPS)", "Flask app", "MySQL volume"],
    { last: true, tone: "orange" }
  ),
  callout(
    "No RDS, no ECS, no Kubernetes. One virtual machine you can SSH into.",
    "sky",
    "Scope"
  )
);

/* ===========================================================
   SECTION 2 — DEVELOPMENT VS PRODUCTION
   =========================================================== */
section("02 / DEVELOPMENT VS PRODUCTION");

slide(
  {
    title: "Development",
    subtitle: "Perfect for learning and development.",
    badge: "YESTERDAY",
    note: "Everything on one laptop. That's a feature for development.",
  },
  flow(["Laptop", "Docker", "Flask + MySQL containers", "Named volume"], {
    vertical: true,
    tone: "mint",
  })
);

slide(
  {
    title: "Production is different",
    subtitle: "It introduces concerns a laptop never has to face.",
    badge: "NEW CONCERNS",
    note: "None of these existed on localhost.",
  },
  bullets(
    [
      "It has to be reachable",
      "It has to stay up",
      "It has to be encrypted",
      "It has to survive a reboot",
      "Strangers will poke at it",
      "The data has to be backed up",
      "Someone has to deploy version two",
    ],
    "sky",
    2
  )
);

slide(
  {
    title: "Development ≠ Production",
    badge: "THE GAP",
    note: "Same code. Completely different stakes.",
  },
  split(
    panel("Development", "ink", ["“My laptop works.”"]),
    panel("Production", "orange", ["“Other people depend on it.”"])
  )
);

slide(
  {
    title: "What actually changes?",
    subtitle: "Less than you'd think.",
    badge: "THE SHIFT",
    note: "The application does not change at all. Everything that changes is around it.",
  },
  {
    kind: "table",
    columns: ["", "step2 (local)", "step3 (production)"],
    columnTones: ["ink", "sky", "orange"],
    rows: [
      ["app.py", "Same", "Same"],
      ["Dockerfile", "Same", "Same"],
      ["Where the image comes from", "build: .", "Docker Hub"],
      ["What runs it", "Your laptop", "An EC2 instance"],
      ["How you reach it", "localhost:5000", "https://your-domain"],
      ["In front of the app", "Nothing", "Caddy"],
      ["Where secrets live", "compose.yaml", "A .env file, chmod 600"],
    ],
  }
);

slide(
  {
    title: "The application is untouched",
    subtitle: "Three folders, one application.",
    badge: "THE POINT",
    note: "Show the diff live if you can. It is empty, and that is the whole argument for containers.",
  },
  term(
    cmd("git diff --no-index step2/app.py step3/app.py"),
    comment("no output"),
    cmd("git diff --no-index step2/Dockerfile step3/Dockerfile"),
    comment("no output")
  )
);

slide(
  {
    title: "So what is production, really?",
    badge: "DEFINITION",
    note: "A deliberately unglamorous definition. It takes the mystery out of the rest of the day.",
  },
  statement(
    "A computer that is always on, that strangers can reach, safely.",
    "Everything today is one of those three words.",
    "orange"
  )
);

/* ===========================================================
   SECTION 3 — THE PRODUCTION IMAGE
   =========================================================== */
section("03 / THE PRODUCTION IMAGE");

slide(
  {
    title: "First step",
    badge: "PRODUCTION IMAGE",
    note: "Before any server, the image itself has to be fit to ship.",
  },
  statement(
    "Build an image you'd be willing to hand to a stranger",
    "Because that is exactly what publishing it means.",
    "orange"
  )
);

slide(
  {
    title: "Our Dockerfile",
    subtitle: "Unchanged since Session 3 — it was already production-shaped.",
    badge: "STARTING POINT",
    note: "Walk it line by line. Most of it was chosen for reasons we can now name.",
  },
  code(
    "Dockerfile",
    "dockerfile",
    `FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PORT=5000

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", \\
     "--workers", "2", "--timeout", "60", "app:app"]`
  )
);

slide(
  {
    title: "What makes an image production-friendly?",
    badge: "PROPERTIES",
    note: "Four properties. The next few slides work through them against our own file.",
  },
  boxes([
    box("Small", ["-slim base"], "sky"),
    box("Predictable", ["pinned versions"], "yellow"),
    box("Secure", ["no secrets inside"], "coral"),
    box("Self-contained", ["code baked in"], "mint"),
  ])
);

slide(
  {
    title: "Pin your dependencies",
    subtitle: "Same versions on every build, on every machine, forever.",
    badge: "PREDICTABLE",
    note: "Unpinned means every build can pull something different. That's a bug waiting for a Friday.",
  },
  split(
    panel("Unpinned", "coral", ["Flask", "mysql-connector-python", "gunicorn"], { mono: true }),
    panel("Ours", "mint", ["Flask==3.1.0", "mysql-connector-python==9.2.0", "gunicorn==23.0.0"], {
      mono: true,
      note: "requirements.txt, exactly as shipped",
    })
  )
);

slide(
  {
    title: "Not the development server",
    subtitle: "Flask's built-in server says so itself.",
    badge: "SECURE",
    note: "Everyone has seen this warning and ignored it. Today is the day we stop.",
  },
  split(
    panel("flask run", "coral", [
      "Single-threaded",
      "Prints a warning on every start",
      "Not built for real traffic",
    ]),
    panel("gunicorn", "mint", [
      "Multiple worker processes",
      "Request timeouts",
      "Designed to be exposed",
    ])
  )
);

slide(
  {
    title: "The CMD, annotated",
    badge: "gunicorn",
    note: "Four decisions in one line. Ask what each would break if it were wrong.",
  },
  annotated(
    `CMD ["gunicorn", "--bind", "0.0.0.0:5000",
     "--workers", "2", "--timeout", "60", "app:app"]`,
    [
      {
        label: "0.0.0.0:5000",
        text: "Listen on every interface. Bind to 127.0.0.1 and nothing outside the container can reach it.",
      },
      { label: "--workers 2", text: "Two processes, so one slow request doesn't block the app." },
      { label: "--timeout 60", text: "Kill a worker that hangs, rather than wedging forever." },
      { label: "app:app", text: "Module app.py, Flask object named app." },
    ],
    { filename: "Dockerfile", language: "dockerfile" }
  )
);

slide(
  {
    title: "Layer order is not an accident",
    subtitle: "requirements.txt is copied before the source.",
    badge: "FAST BUILDS",
    note: "Project 1's lesson, still earning its keep — an app.py edit doesn't re-run pip.",
  },
  split(
    panel("Copy everything first", "coral", ["COPY . .", "RUN pip install -r requirements.txt"], {
      mono: true,
      note: "Every code edit reinstalls every package",
    }),
    panel("What we do", "mint", ["COPY requirements.txt .", "RUN pip install ...", "COPY . ."], {
      mono: true,
      note: "The pip layer is cached until dependencies change",
    })
  )
);

slide(
  {
    title: "Never put secrets in the image",
    badge: "BAD",
    note: "Anyone who can pull the image can read ENV values with docker inspect. And we are about to publish this image.",
  },
  annotated(
    "ENV DB_PASSWORD=my-secret-password",
    [
      { label: "Problem", text: "The secret becomes part of the image configuration, forever." },
      {
        label: "Worse here",
        text: "We are pushing this image to Docker Hub. A public repository would publish the password too.",
      },
      { label: "Layers remember", text: "Deleting it in a later layer does not remove it from the image." },
    ],
    { filename: "Dockerfile", language: "dockerfile" }
  )
);

slide(
  {
    title: ".dockerignore earns its place today",
    subtitle: "What must never be copied into the image.",
    badge: "SECURE",
    note: "The .env line is the important one. Without it, COPY . . would bake production secrets into a published image.",
  },
  code(
    ".dockerignore",
    "text",
    `__pycache__/
*.py[cod]
.env
.git/`
  )
);

slide(
  {
    title: "Configuration comes at runtime",
    badge: "BETTER",
    note: "The image stays generic. The environment supplies the specifics — the Session 3 lesson, now load-bearing.",
  },
  boxes(
    [
      box("One image", ["taskmanager:1.0.0"], "orange"),
      box("Many environments", ["laptop", "staging", "production"], "sky"),
    ],
    "configured by env vars"
  )
);

slide(
  {
    title: "Development vs production secrets",
    badge: "SECRETS",
    note: "Be honest about where we land today: a chmod 600 file on one server, not a secret manager.",
  },
  split(
    panel("step2, on a laptop", "mint", ["Written into compose.yaml", "Committed to Git"], {
      note: "Fine — they protect nothing",
    }),
    panel("step3, on the server", "sky", [".env, chmod 600", "Never committed", "Unique per install"], {
      note: "The minimum that is not negligent",
    })
  )
);

slide(
  {
    title: "What we are not doing",
    subtitle: "Two honest gaps in our image.",
    badge: "NEXT STEPS",
    note: "Name the gaps rather than pretending. Both are good take-home exercises.",
  },
  split(
    panel("Still root", "coral", ["RUN useradd -m appuser", "USER appuser"], {
      mono: true,
      note: "Two lines we have not added yet",
    }),
    panel("No healthcheck on app", "coral", ["Only db has one", "Caddy assumes app is up"], {
      note: "Fine at this size, worth adding later",
    })
  )
);

slide(
  {
    title: "Production image checklist",
    subtitle: "Before you push anything.",
    badge: "CHECKLIST",
    note: "Run through this before every first publish of a new service.",
  },
  bullets(
    [
      "Small base image",
      "Dependencies pinned",
      "A real application server",
      "No secrets in the image",
      "Listening on 0.0.0.0",
      "Configuration from the environment",
      ".dockerignore excludes .env and .git",
      "Safe to restart at any moment",
    ],
    "mint",
    2
  )
);

/* ===========================================================
   SECTION 4 — PUBLISHING THE IMAGE
   =========================================================== */
section("04 / PUBLISHING THE IMAGE");

slide(
  {
    title: "We have an image — on our laptop",
    subtitle: "A server on the other side of the world cannot see it.",
    badge: "THE GAP",
    note: "The same problem Session 2 raised, now with real consequences.",
  },
  boxes([
    box("Your laptop", ["taskmanager:1.0.0"], "orange"),
    box("EC2 instance", ["can't see it"], "ink"),
  ])
);

slide(
  {
    title: "A registry sits in the middle",
    subtitle: "You push from one machine and pull from another.",
    badge: "REGISTRY",
    note: "The registry is the handover point between building and running.",
  },
  flow(["Your laptop", "docker push", "Registry", "docker pull", "The server"], {
    last: true,
    tone: "sky",
  })
);

slide(
  {
    title: "We're using Docker Hub",
    subtitle: "The registry you already have an account on.",
    badge: "DOCKER HUB",
    note: "Deliberately the simplest option. It is also where mysql and caddy come from.",
  },
  statement("hub.docker.com", "Free, public, and already trusted by the server", "sky")
);

slide(
  {
    title: "Create a repository",
    subtitle: "One repository per application image.",
    badge: "SETUP",
    note: "Public or private both work. Private needs a docker login on the server too.",
  },
  code("Docker Hub", "text", "YOUR_DOCKERHUB_USERNAME\n└── taskmanager")
);

slide(
  {
    title: "Log in — with a token, not your password",
    badge: "AUTH",
    note: "This matters. A PAT can be scoped and revoked; your account password cannot.",
  },
  term(
    cmd("docker login -u YOUR_DOCKERHUB_USERNAME"),
    out("Password:"),
    comment("paste a Personal Access Token, not your account password")
  )
);

slide(
  {
    title: "Why a Personal Access Token?",
    badge: "SECURITY",
    note: "Create it in Docker Hub under Account Settings. Give it the least access that works.",
  },
  split(
    panel("Account password", "coral", [
      "Unlocks the whole account",
      "Can't be scoped",
      "Revoking it locks you out too",
    ]),
    panel("Personal Access Token", "mint", [
      "Scoped to read or write",
      "Revoke one without touching the rest",
      "What CI systems use",
    ])
  )
);

slide(
  {
    title: "Build with a versioned tag",
    subtitle: "The tag is the name the server will ask for.",
    badge: "docker build",
    note: "Note the username prefix. That is what makes it pushable to your account.",
  },
  code(
    "terminal",
    "bash",
    "docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0 ."
  )
);

slide(
  {
    title: "Reading the image name",
    badge: "ANATOMY",
    note: "Three parts. Students mix up the second and third constantly.",
  },
  annotated(
    "YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0",
    [
      { label: "USERNAME", text: "Your Docker Hub account — this is what push permission is checked against." },
      { label: "taskmanager", text: "The repository. One per application." },
      { label: "1.0.0", text: "The tag. One per release." },
    ],
    { language: "bash" }
  )
);

slide(
  {
    title: "Push it",
    badge: "docker push",
    note: "Watch the layers upload. Only layers Docker Hub doesn't already have are sent.",
  },
  term(
    cmd("docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0"),
    out("The push refers to repository [docker.io/.../taskmanager]"),
    out("1.0.0: digest: sha256:9f2c… size: 2841")
  )
);

slide(
  {
    title: "The image now exists somewhere real",
    subtitle: "Any machine with Docker and internet can run your application.",
    badge: "THE PAYOFF",
    note: "This is the moment the application stops being yours alone.",
  },
  term(cmd("docker pull YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0"))
);

slide(
  {
    title: "A repository holds versions",
    badge: "TAGS",
    note: "Each release gets its own tag. None of them are ever overwritten.",
  },
  code(
    "taskmanager",
    "text",
    `taskmanager
├── 1.0.0
├── 1.0.1
├── 1.1.0
└── latest   ← we won't use this`
  )
);

slide(
  {
    title: "Why not :latest?",
    subtitle: "Because you can never answer 'what is running?'",
    badge: "IMMUTABLE TAGS",
    note: "The single most useful operational habit on this slide deck.",
  },
  split(
    panel("With :latest", "coral", [
      "Which build is on the server?",
      "Nobody knows",
      "Rolling back means rebuilding",
    ]),
    panel("With 1.0.0", "mint", [
      "IMAGE_TAG=1.0.0 in .env",
      "The answer is written down",
      "Rollback is editing one line",
    ])
  )
);

slide(
  {
    title: "The next release",
    subtitle: "A new tag. Never a rebuilt one.",
    badge: "VERSIONING",
    note: "Once 1.0.0 is pushed it is frozen. Fixes become 1.0.1.",
  },
  term(
    cmd("docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1 ."),
    cmd("docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1")
  )
);

slide(
  {
    title: "Other registries exist",
    subtitle: "Same three verbs. Different address.",
    badge: "ASIDE",
    note: "Mention these so the names aren't new later, then move on. We are not using them today.",
  },
  {
    kind: "table",
    columns: ["Registry", "Where it lives", "You'd pick it when"],
    columnTones: ["sky", "ink", "mint"],
    rows: [
      ["Docker Hub", "docker.io", "You want the simplest thing that works"],
      ["Amazon ECR", "Your AWS account", "Everything else is already in AWS"],
      ["GitHub Packages", "Next to your repo", "The code is already on GitHub"],
      ["Self-hosted", "Your own server", "Images must not leave your network"],
    ],
  }
);

slide(
  {
    title: "The important idea",
    badge: "REMEMBER",
    note: "The image moves. The Dockerfile stays with the code. Four boxes worth photographing.",
  },
  flow(["Dockerfile", "docker build", "Image", "Docker Hub", "Any server"], { last: true })
);

/* ===========================================================
   SECTION 5 — THE SERVER
   =========================================================== */
section("05 / THE SERVER");

slide(
  {
    title: "A registry is not a runtime",
    subtitle: "Docker Hub stores the image. Something still has to run it.",
    badge: "STORAGE ≠ COMPUTE",
    note: "A common confusion, and worth naming before we go shopping for a server.",
  },
  split(
    panel("Docker Hub does", "mint", ["Store images", "Keep every version", "Serve pulls"]),
    panel("Docker Hub doesn't", "coral", ["Run containers", "Serve your users", "Hold your data"])
  )
);

slide(
  {
    title: "So we need a computer",
    subtitle: "One that is always on, and has a public address.",
    badge: "THE REQUIREMENT",
    note: "Strip it back to this. A cloud server is just a computer you rent by the hour.",
  },
  statement("Amazon EC2", "Elastic Compute Cloud — a virtual machine you rent", "orange")
);

slide(
  {
    title: "What EC2 actually gives you",
    subtitle: "A bare Linux machine. Nothing more.",
    badge: "EC2",
    note: "Emphasise how little comes with it. Everything else today is us installing things.",
  },
  split(
    panel("You get", "sky", ["A CPU and some RAM", "A disk", "Ubuntu", "An IP address", "SSH access"]),
    panel("You don't get", "coral", ["Docker", "A domain", "HTTPS", "Backups", "Anyone watching it"])
  )
);

slide(
  {
    title: "Launch it",
    subtitle: "Ubuntu LTS, in a public subnet.",
    badge: "SETUP",
    note: "t3.micro is plenty for a workshop. Any current Ubuntu LTS is fine.",
  },
  bullets(
    [
      "Ubuntu LTS",
      "t3.micro (small and cheap)",
      "A public subnet with internet access",
      "A key pair you save somewhere safe",
    ],
    "sky",
    1
  )
);

slide(
  {
    title: "The key pair",
    subtitle: "A .pem file is the only way in.",
    badge: "SSH KEY",
    note: "AWS shows you the private key once. Lose it and you cannot SSH into that instance again.",
  },
  callout(
    "Download it, store it somewhere you back up, and never commit it to Git.",
    "coral",
    "Careful"
  )
);

slide(
  {
    title: "The security group is a firewall",
    subtitle: "It decides who may reach which port.",
    badge: "SECURITY GROUP",
    note: "This table is the single most security-relevant slide today. Do not rush it.",
  },
  {
    kind: "table",
    columns: ["Type", "Port", "Source"],
    columnTones: ["ink", "sky", "mint"],
    rows: [
      ["SSH", "22", "Your public IP only"],
      ["HTTP", "80", "0.0.0.0/0 and ::/0"],
      ["HTTPS", "443", "0.0.0.0/0 and ::/0"],
    ],
  }
);

slide(
  {
    title: "Why SSH is not open to everyone",
    subtitle: "Port 22 open to the world gets scanned within minutes.",
    badge: "SSH",
    note: "This is not hypothetical. Check auth.log on any instance that has been up a day.",
  },
  split(
    panel("Source 0.0.0.0/0", "coral", ["Every bot on the internet", "Continuous login attempts"]),
    panel("Source your IP", "mint", ["Only you", "One line to change when you move"])
  )
);

slide(
  {
    title: "What must stay closed",
    subtitle: "Two ports that people open by reflex.",
    badge: "DO NOT OPEN",
    note: "Say both out loud. Every one of these is a database on the public internet.",
  },
  split(
    panel("3306", "coral", ["MySQL", "Would expose the database to the world"], { mono: true }),
    panel("5000", "coral", ["Flask", "Would bypass Caddy and HTTPS entirely"], { mono: true })
  ),
  callout("Only Caddy is reachable from outside. Everything else talks over Docker's network.", "sky")
);

slide(
  {
    title: "An Elastic IP",
    subtitle: "A public address that survives a reboot.",
    badge: "STABLE ADDRESS",
    note: "Without one, stopping the instance changes its IP and the DNS record goes stale.",
  },
  split(
    panel("Default public IP", "coral", ["Changes when you stop/start", "Your domain breaks"]),
    panel("Elastic IP", "mint", ["Yours until you release it", "The domain keeps pointing at it"])
  )
);

slide(
  {
    title: "Connect to it",
    subtitle: "Everything from here happens on the server.",
    badge: "SSH",
    note: "On macOS and Linux you may need chmod 400 on the key first.",
  },
  code("terminal", "bash", "ssh -i C:\\path\\to\\ec2-key.pem ubuntu@YOUR_ELASTIC_IP")
);

slide(
  {
    title: "But now we manage all of it",
    subtitle: "More control. More responsibility.",
    badge: "THE COST",
    note: "Every item here is something you now patch, secure, and get paged about.",
  },
  bullets(
    [
      "The operating system",
      "Security updates",
      "Docker itself",
      "The firewall",
      "Disk space",
      "Backups",
      "Uptime",
    ],
    "coral",
    2
  )
);

slide(
  {
    title: "Other ways to run containers",
    subtitle: "Same image. Someone else holds more of the list above.",
    badge: "ASIDE",
    note: "Name them so they aren't mysterious, say why we aren't using them, and move on.",
  },
  {
    kind: "table",
    columns: ["Option", "Who manages the server", "Why not today"],
    columnTones: ["sky", "ink", "coral"],
    rows: [
      ["EC2 + Compose", "You", "— this is what we're doing"],
      ["ECS on Fargate", "AWS", "New vocabulary: clusters, tasks, services"],
      ["App Runner / Cloud Run", "The provider", "Hides exactly what we want to see"],
      ["Kubernetes", "You, harder", "A whole workshop of its own"],
    ],
  }
);

slide(
  {
    title: "Why a plain server, for this workshop",
    badge: "ON PURPOSE",
    note: "The honest reason: you can see every moving part, and every part is one you already know.",
  },
  statement(
    "Nothing here is hidden from you.",
    "The same docker compose up you ran on your laptop, on a computer with a domain name.",
    "orange"
  )
);

/* ===========================================================
   SECTION 6 — INSTALLING DOCKER ON THE SERVER
   =========================================================== */
section("06 / DOCKER ON THE SERVER");

slide(
  {
    title: "The server is empty",
    subtitle: "Ubuntu does not come with Docker.",
    badge: "STEP ZERO",
    note: "Before anything else, the machine needs the thing that runs containers.",
  },
  term(cmd("docker --version"), out("Command 'docker' not found"))
);

slide(
  {
    title: "Do not install from Ubuntu's own repository",
    subtitle: "It ships an old package under a different name.",
    badge: "CAREFUL",
    note: "apt install docker.io gets you something old and without the compose plugin.",
  },
  split(
    panel("apt install docker.io", "coral", ["Often outdated", "No compose plugin"], { mono: true }),
    panel("Docker's own repository", "mint", ["Current engine", "docker compose included"], {
      mono: true,
    })
  )
);

slide(
  {
    title: "Add Docker's signing key",
    subtitle: "So apt can verify the packages are really Docker's.",
    badge: "TRUST",
    note: "This is the part people paste blindly. Take thirty seconds to say what it does.",
  },
  code(
    "on the server",
    "bash",
    `sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc`
  )
);

slide(
  {
    title: "Why a signing key at all?",
    badge: "SUPPLY CHAIN",
    note: "A short, memorable reason to never skip this step.",
  },
  flow(["Package downloaded", "Signature checked against the key", "Installed"], {
    last: true,
    tone: "mint",
  }),
  callout(
    "Without it, anything that can intercept the download can install anything it likes as root.",
    "coral"
  )
);

slide(
  {
    title: "Add the repository",
    subtitle: "One line that works out your architecture and Ubuntu release.",
    badge: "APT",
    note: "Don't read it out. Point at the two shell substitutions and explain why they're there.",
  },
  code(
    "on the server",
    "bash",
    `echo "deb [arch=$(dpkg --print-architecture) \\
signed-by=/etc/apt/keyrings/docker.asc] \\
https://download.docker.com/linux/ubuntu \\
$(. /etc/os-release && echo "$UBUNTU_CODENAME") stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
  )
);

slide(
  {
    title: "Install the engine and the plugins",
    badge: "INSTALL",
    note: "docker-compose-plugin is the one that gives you 'docker compose' as a subcommand.",
  },
  code(
    "on the server",
    "bash",
    `sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin`
  )
);

slide(
  {
    title: "Run Docker without sudo",
    subtitle: "And then log out. Really.",
    badge: "GROUPS",
    note: "The single most common 'it doesn't work' moment on this page. Group membership is applied at login.",
  },
  term(cmd("sudo usermod -aG docker $USER"), cmd("exit"), comment("then SSH in again")),
  callout(
    "The new group only takes effect in a new login session. Skipping the reconnect gets you permission denied.",
    "yellow",
    "Why exit?"
  )
);

slide(
  {
    title: "Verify",
    badge: "CHECK",
    note: "Three commands. If all three work, the server is ready.",
  },
  term(
    cmd("docker --version"),
    cmd("docker compose version"),
    cmd("docker run hello-world"),
    out("Hello from Docker!")
  )
);

slide(
  {
    title: "The mental model",
    subtitle: "Nothing new has been learned.",
    badge: "REASSURANCE",
    note: "Everything they know about Docker is now true on a machine with a public address.",
  },
  statement("Same Docker. Someone else's computer.", undefined, "mint")
);

/* ===========================================================
   SECTION 7 — GETTING THE FILES THERE
   =========================================================== */
section("07 / GETTING THE FILES THERE");

slide(
  {
    title: "What actually has to reach the server?",
    subtitle: "Less than people expect.",
    badge: "THE QUESTION",
    note: "Ask before answering. Most rooms say 'the code', and the answer is no.",
  },
  split(
    panel("Goes to the server", "mint", ["compose.production.yaml", "Caddyfile", ".env"]),
    panel("Does NOT", "coral", ["app.py", "templates/", "Dockerfile", "The image itself"], {
      note: "The image is pulled from Docker Hub",
    })
  )
);

slide(
  {
    title: "Why the code doesn't go",
    subtitle: "The image already contains it.",
    badge: "THE POINT",
    note: "This is the entire value of building an image. The server never sees source code.",
  },
  flow(["Your laptop", "docker build", "Docker Hub", "docker pull", "The server"], { last: true })
);

slide(
  {
    title: "Make a home for it",
    badge: "SETUP",
    note: "One directory. Everything the deployment needs lives in it.",
  },
  code(
    "from your laptop",
    "bash",
    'ssh -i C:\\path\\to\\ec2-key.pem ubuntu@YOUR_ELASTIC_IP "mkdir -p ~/taskmanager"'
  )
);

slide(
  {
    title: "Copy the three files",
    badge: "scp",
    note: "scp is cp over SSH. Same key, same user, a colon before the remote path.",
  },
  code(
    "from your laptop",
    "bash",
    `scp -i C:\\path\\to\\ec2-key.pem \\
  compose.production.yaml Caddyfile .env.example \\
  ubuntu@YOUR_ELASTIC_IP:~/taskmanager/`
  )
);

slide(
  {
    title: "Why a separate compose file?",
    subtitle: "compose.yaml for the laptop. compose.production.yaml for the server.",
    badge: "TWO FILES",
    note: "They describe the same application with different priorities. Keeping them apart avoids accidents.",
  },
  {
    kind: "table",
    columns: ["", "compose.yaml (step2)", "compose.production.yaml (step3)"],
    columnTones: ["ink", "sky", "orange"],
    rows: [
      ["App image", "build: .", "Pulled from Docker Hub"],
      ["Secrets", "Written in the file", "${VARIABLES} from .env"],
      ["Published ports", "app on 5000", "Caddy on 80 and 443 only"],
      ["Restart policy", "None", "unless-stopped"],
      ["Reverse proxy", "None", "Caddy"],
      ["Network", "Default", "An explicit internal network"],
    ],
  }
);

slide(
  {
    title: "compose.production.yaml — the database",
    badge: "db",
    note: "Identical to step2 apart from restart and the variables. The healthcheck survives unchanged.",
  },
  code(
    "compose.production.yaml",
    "yaml",
    `db:
  image: mysql:8.4
  restart: unless-stopped
  environment:
    MYSQL_DATABASE: \${MYSQL_DATABASE}
    MYSQL_USER: \${MYSQL_USER}
    MYSQL_PASSWORD: \${MYSQL_PASSWORD}
    MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
  volumes:
    - mysql_data:/var/lib/mysql
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost",
           "-uroot", "-p\${MYSQL_ROOT_PASSWORD}"]
    interval: 5s
    retries: 15
    start_period: 15s
  networks:
    - internal`
  )
);

slide(
  {
    title: "compose.production.yaml — the app",
    badge: "app",
    note: "The one real change: image instead of build. No ports at all — Caddy reaches it over the network.",
  },
  code(
    "compose.production.yaml",
    "yaml",
    `app:
  image: \${DOCKERHUB_USERNAME}/taskmanager:\${IMAGE_TAG}
  restart: unless-stopped
  environment:
    DB_HOST: db
    DB_NAME: \${MYSQL_DATABASE}
    DB_USER: \${MYSQL_USER}
    DB_PASSWORD: \${MYSQL_PASSWORD}
    SECRET_KEY: \${SECRET_KEY}
  depends_on:
    db:
      condition: service_healthy
  networks:
    - internal`
  )
);

slide(
  {
    title: "Notice what is missing",
    subtitle: "The app service publishes no ports.",
    badge: "IMPORTANT",
    note: "On the laptop it was 5000:5000. Here, nothing. That is deliberate and it is the security story.",
  },
  split(
    panel("step2, local", "sky", ["ports:", "  - \"5000:5000\""], { mono: true }),
    panel("step3, production", "mint", ["(no ports key)"], {
      mono: true,
      note: "Only Caddy faces the internet",
    })
  )
);

slide(
  {
    title: "compose.production.yaml — Caddy",
    badge: "caddy",
    note: "The only service with ports. Three volumes: the config in, and two for Caddy's own state.",
  },
  code(
    "compose.production.yaml",
    "yaml",
    `caddy:
  image: caddy:2.8-alpine
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  environment:
    DOMAIN: \${DOMAIN}
    EMAIL: \${EMAIL}
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile:ro
    - caddy_data:/data
    - caddy_config:/config
  depends_on:
    - app
  networks:
    - internal`
  )
);

slide(
  {
    title: "Three volumes, three jobs",
    badge: "volumes",
    note: "caddy_data is the one people forget — it holds the certificates.",
  },
  annotated(
    `- ./Caddyfile:/etc/caddy/Caddyfile:ro
- caddy_data:/data
- caddy_config:/config`,
    [
      {
        label: "./Caddyfile",
        text: "A bind mount from the server's directory, read-only. The config we scp'd.",
      },
      {
        label: "caddy_data",
        text: "Certificates and account keys. Lose this and Let's Encrypt re-issues — and rate-limits you.",
      },
      { label: "caddy_config", text: "Caddy's own runtime state." },
    ],
    { filename: "compose.production.yaml", language: "yaml" }
  )
);

slide(
  {
    title: "One explicit network",
    subtitle: "Everything talks on it. Nothing else can.",
    badge: "networks",
    note: "Compose would have made a default network anyway. Naming it makes the intent legible.",
  },
  code(
    "compose.production.yaml",
    "yaml",
    `networks:
  internal:
    driver: bridge`
  ),
  flow(["Caddy", "internal", "app", "internal", "db"], { tone: "sky" })
);

/* ===========================================================
   SECTION 8 — SECRETS AND CONFIGURATION
   =========================================================== */
section("08 / SECRETS AND CONFIG");

slide(
  {
    title: "Every value in that file was a ${VARIABLE}",
    subtitle: "So where do they come from?",
    badge: "THE QUESTION",
    note: "Compose substitutes them before it starts anything. The source is a .env file.",
  },
  flow([".env on the server", "docker compose", "Container environment"], {
    last: true,
    tone: "sky",
  })
);

slide(
  {
    title: ".env.example is not .env",
    subtitle: "One is a template you commit. One is a secret you never do.",
    badge: "TWO FILES",
    note: "The example documents which keys exist. The real file has the real values.",
  },
  split(
    panel(".env.example", "sky", ["Committed to Git", "Placeholder values", "Documentation"]),
    panel(".env", "coral", ["Never committed", "Real secrets", "Created on the server"])
  )
);

slide(
  {
    title: "The template",
    badge: ".env.example",
    note: "Read the two comments out loud. They are instructions, not decoration.",
  },
  code(
    ".env.example",
    "text",
    `# Docker Hub image published from this folder
DOCKERHUB_USERNAME=your-dockerhub-username
IMAGE_TAG=1.0.0

# Use long, unique values on EC2. Do not commit the real .env file.
MYSQL_DATABASE=tasks
MYSQL_USER=taskuser
MYSQL_PASSWORD=replace-with-a-strong-database-password
MYSQL_ROOT_PASSWORD=replace-with-a-different-strong-root-password
SECRET_KEY=replace-with-a-long-random-flask-secret

# Domain which points to the EC2 Elastic IP address
DOMAIN=tasks.example.com
EMAIL=admin@example.com`
  )
);

slide(
  {
    title: "Create the real one",
    badge: "ON THE SERVER",
    note: "chmod 600 is not optional. Other users on the box can read a default-permission file.",
  },
  term(
    cmd("cd ~/taskmanager"),
    cmd("cp .env.example .env"),
    cmd("chmod 600 .env"),
    cmd("nano .env")
  )
);

slide(
  {
    title: "What chmod 600 means",
    badge: "PERMISSIONS",
    note: "Owner read and write. Nobody else, not even read.",
  },
  split(
    panel("644 (the default)", "coral", ["-rw-r--r--", "Every user on the box can read it"], {
      mono: true,
    }),
    panel("600", "mint", ["-rw-------", "Only you"], { mono: true })
  )
);

slide(
  {
    title: "Generate real passwords",
    subtitle: "Not the placeholder. Not your laptop's taskpass.",
    badge: "SECRETS",
    note: "Give them a command so there's no excuse. Every value gets its own.",
  },
  term(
    cmd("openssl rand -base64 36"),
    out("k8Qw…"),
    comment("run it once per secret — four times in total")
  )
);

slide(
  {
    title: "Three different secrets",
    subtitle: "Reusing one is the same as having one.",
    badge: "DON'T REUSE",
    note: "The root password in particular should differ from the app's user password.",
  },
  bullets(
    [
      "MYSQL_PASSWORD — the app's database user",
      "MYSQL_ROOT_PASSWORD — the database superuser",
      "SECRET_KEY — signs Flask session cookies",
    ],
    "sky",
    1
  )
);

slide(
  {
    title: "Using the file",
    subtitle: "Explicit, every time.",
    badge: "--env-file",
    note: "Compose would read ./.env automatically, but naming it keeps the command self-documenting.",
  },
  code(
    "on the server",
    "bash",
    "docker compose --env-file .env -f compose.production.yaml ps"
  )
);

slide(
  {
    title: "That is a long command",
    subtitle: "You will type it many times today.",
    badge: "TIP",
    note: "Suggest an alias. It removes the main source of typos in the hands-on block.",
  },
  code(
    "on the server",
    "bash",
    `alias dcp='docker compose --env-file .env -f compose.production.yaml'

dcp ps
dcp logs -f`
  )
);

slide(
  {
    title: "The .env never goes near Git",
    badge: ".gitignore",
    note: "Both the .gitignore and the .dockerignore exclude it. Belt and braces, on purpose.",
  },
  split(
    panel(".gitignore", "sky", [".env", "__pycache__/", "*.py[cod]"], {
      mono: true,
      note: "Keeps it out of the repository",
    }),
    panel(".dockerignore", "mint", ["__pycache__/", "*.py[cod]", ".env", ".git/"], {
      mono: true,
      note: "Keeps it out of the image",
    })
  )
);

slide(
  {
    title: "Where this goes next",
    subtitle: "A file on one server is the floor, not the ceiling.",
    badge: "HONEST NOTE",
    note: "Name the next step so nobody leaves thinking a .env file is the professional answer at scale.",
  },
  split(
    panel("What we do", "yellow", ["A .env file", "chmod 600", "One server"], {
      note: "Appropriate for one box",
    }),
    panel("At scale", "sky", [
      "AWS Secrets Manager",
      "SSM Parameter Store",
      "Rotation and audit logs",
    ])
  )
);

/* ===========================================================
   SECTION 9 — GETTING USERS IN
   =========================================================== */
section("09 / GETTING USERS IN");

slide(
  {
    title: "An IP address is not a website",
    subtitle: "http://54.221.19.4:5000 is technically reachable. Nobody will type it.",
    badge: "THE GAP",
    note: "Two things missing: a name people can remember, and a padlock.",
  },
  split(
    panel("What EC2 gave us", "ink", ["54.221.19.4"], { mono: true }),
    panel("What we want", "mint", ["https://tasks.example.com"], { mono: true })
  )
);

slide(
  {
    title: "DNS turns a name into an address",
    subtitle: "One record. That's the whole mechanism.",
    badge: "DNS",
    note: "Keep it at this level. A records and propagation are all they need today.",
  },
  flow(["Browser asks for tasks.example.com", "DNS answers 54.221.19.4", "Browser connects"], {
    last: true,
    tone: "sky",
  })
);

slide(
  {
    title: "Create the A record",
    subtitle: "At your registrar or DNS provider.",
    badge: "SETUP",
    note: "The Elastic IP is why this record stays correct after a reboot.",
  },
  {
    kind: "table",
    columns: ["Type", "Name", "Value"],
    columnTones: ["ink", "sky", "mint"],
    rows: [
      ["A", "tasks", "YOUR_ELASTIC_IP"],
      ["A", "@ (for the root domain)", "YOUR_ELASTIC_IP"],
      ["CNAME", "www", "tasks.example.com"],
    ],
  }
);

slide(
  {
    title: "Wait for it to resolve",
    subtitle: "Before you start Caddy. This order matters.",
    badge: "SEQUENCE",
    note: "Starting Caddy against a domain that doesn't resolve yet wastes certificate attempts.",
  },
  term(cmd("nslookup tasks.example.com"), out("Address: 54.221.19.4"))
);

slide(
  {
    title: "Now the padlock",
    subtitle: "HTTP sends everything in the clear.",
    badge: "WHY HTTPS",
    note: "Our app has a login-free UI, but it sets a signed session cookie. And browsers now shame plain HTTP.",
  },
  split(
    panel("Over HTTP", "coral", [
      "Anyone on the path can read it",
      "Anyone can modify it",
      "'Not secure' in the address bar",
    ]),
    panel("Over HTTPS", "mint", ["Encrypted", "Tamper-evident", "The identity is verified"])
  )
);

slide(
  {
    title: "Certificates used to be a chore",
    subtitle: "Buy, generate, install, remember to renew, forget, expire.",
    badge: "HISTORY",
    note: "Anyone who has been in the industry a while will have an expired-cert outage story.",
  },
  flow(["Generate a CSR", "Buy a certificate", "Install it", "Renew it every year"], {
    tone: "coral",
  })
);

slide(
  {
    title: "Caddy",
    subtitle: "A reverse proxy that gets and renews certificates by itself.",
    badge: "THE TOOL",
    note: "Two jobs in one container: terminate HTTPS, and forward to the app.",
  },
  boxes(
    [
      box("Reverse proxy", ["one public door", "many private services"], "sky"),
      box("ACME client", ["gets certificates", "renews them"], "mint"),
    ],
    "in one container"
  )
);

slide(
  {
    title: "What a reverse proxy does",
    subtitle: "It is the only thing the internet talks to.",
    badge: "CONCEPT",
    note: "Draw the line: everything left of Caddy is public, everything right of it is private.",
  },
  flow(["Internet :443", "Caddy", "app :5000", "db :3306"], { last: true, tone: "orange" })
);

slide(
  {
    title: "The entire Caddyfile",
    subtitle: "Four lines.",
    badge: "CONFIG",
    note: "Let the brevity land. This is the whole HTTPS configuration.",
  },
  code(
    "Caddyfile",
    "text",
    `{$DOMAIN} {
    tls {$EMAIL}
    encode zstd gzip
    reverse_proxy app:5000
}`
  )
);

slide(
  {
    title: "Line by line",
    badge: "ANNOTATED",
    note: "The last line is the Session 3 lesson, one more time: a service name, not localhost.",
  },
  annotated(
    `{$DOMAIN} {
    tls {$EMAIL}
    encode zstd gzip
    reverse_proxy app:5000
}`,
    [
      {
        label: "{$DOMAIN}",
        text: "Read from the environment, which Compose filled from .env. Caddy gets a certificate for this name.",
      },
      { label: "tls {$EMAIL}", text: "Where Let's Encrypt sends expiry and problem notices." },
      { label: "encode", text: "Compress responses. Free bandwidth." },
      {
        label: "reverse_proxy app:5000",
        text: "Forward to the app service by name, over the internal network. Not localhost — localhost would be Caddy itself.",
      },
    ],
    { filename: "Caddyfile" }
  )
);

slide(
  {
    title: "localhost, one final time",
    subtitle: "Inside the Caddy container, localhost is Caddy.",
    badge: "THE USUAL SUSPECT",
    note: "Fifth time across two sessions. It is the bug they will hit, in every new context.",
  },
  split(
    panel("Wrong", "coral", ["reverse_proxy localhost:5000"], { mono: true }),
    panel("Right", "mint", ["reverse_proxy app:5000"], { mono: true })
  )
);

slide(
  {
    title: "How the certificate is issued",
    subtitle: "Let's Encrypt has to prove you control the domain.",
    badge: "ACME",
    note: "This is why port 80 must be open even though the site runs on 443.",
  },
  flow(
    [
      "Caddy asks Let's Encrypt",
      "Let's Encrypt challenges",
      "It connects back on port 80",
      "Caddy answers",
      "Certificate issued",
    ],
    { last: true, tone: "mint" }
  )
);

slide(
  {
    title: "Which is why the order is: DNS, then start",
    badge: "SEQUENCE",
    note: "Three preconditions. Get one wrong and the first start fails in a confusing way.",
  },
  {
    kind: "checklist",
    items: [
      "The A record resolves to the Elastic IP",
      "Ports 80 and 443 are open in the security group",
      "DOMAIN in .env is the exact hostname on the record",
      "EMAIL in .env is an address you actually read",
    ],
  }
);

slide(
  {
    title: "One more warning",
    subtitle: "Don't put another proxy in front yet.",
    badge: "CAREFUL",
    note: "Straight from the project README. Cloudflare's orange cloud can break the first issuance.",
  },
  callout(
    "Wait until the first certificate is issued before putting Cloudflare or any other proxy in front of Caddy.",
    "coral",
    "Warning"
  )
);

slide(
  {
    title: "The complete request path",
    badge: "END TO END",
    note: "Trace one click from a phone to the volume and back. This is the architecture slide.",
  },
  flow(
    [
      "User",
      "DNS",
      "Elastic IP",
      "Caddy :443",
      "app :5000",
      "db :3306",
      "mysql_data",
    ],
    { last: true }
  )
);

/* ===========================================================
   SECTION 10 — WHERE THE DATA LIVES
   =========================================================== */
section("10 / WHERE THE DATA LIVES");

slide(
  {
    title: "The one decision we haven't justified",
    badge: "DECISION",
    note: "The most interesting architectural choice of the day, and we made it quietly.",
  },
  statement("MySQL is a container on the same box.", "Is that a good idea?", "sky")
);

slide(
  {
    title: "Option A: a container on the server",
    subtitle: "What step3 does.",
    badge: "OPTION A",
    note: "Familiar, cheap, and entirely under your control.",
  },
  flow(["EC2 instance", "MySQL container", "mysql_data volume", "The instance's disk"], {
    vertical: true,
    tone: "sky",
  })
);

slide(
  {
    title: "Option B: a managed database",
    subtitle: "Amazon RDS, or any managed MySQL.",
    badge: "OPTION B",
    note: "The app stays a container. The database becomes somebody else's operational problem.",
  },
  flow(["EC2 instance", "App container", "Private network", "Amazon RDS"], {
    last: true,
    tone: "mint",
  })
);

slide(
  {
    title: "What option A puts on you",
    badge: "THE LIST",
    note: "Read it slowly. Each one is a job that has to be done by a person, at some hour.",
  },
  bullets(
    [
      "Backups",
      "Restoring from a backup",
      "Disk space",
      "MySQL version upgrades",
      "Monitoring",
      "Availability",
      "Failure handling",
    ],
    "coral",
    2
  )
);

slide(
  {
    title: "And one specific risk",
    subtitle: "The data lives on the instance.",
    badge: "SINGLE POINT",
    note: "Straight from the README's warning box. Say it plainly.",
  },
  callout(
    "MySQL data lives on the EC2 instance in a Docker volume. Terminate the instance and it is gone with it.",
    "coral",
    "Warning"
  )
);

slide(
  {
    title: "So take backups",
    subtitle: "Two ways, and you want both.",
    badge: "BACKUPS",
    note: "Snapshots protect the machine; mysqldump protects the data in a form you can read.",
  },
  split(
    panel("EBS snapshots", "sky", ["The whole disk", "Scheduled in AWS", "Restores an instance"]),
    panel("mysqldump", "mint", ["Just the database", "A file you can inspect", "Restores anywhere"])
  )
);

slide(
  {
    title: "A dump, concretely",
    badge: "mysqldump",
    note: "Running it inside the container avoids installing a MySQL client on the host.",
  },
  code(
    "on the server",
    "bash",
    `docker compose --env-file .env -f compose.production.yaml \\
  exec db mysqldump -u root -p tasks > tasks-backup.sql`
  )
);

slide(
  {
    title: "Compare the two options",
    badge: "SIDE BY SIDE",
    note: "Neither column wins outright. The last row is usually what decides it.",
  },
  {
    kind: "table",
    columns: ["", "MySQL container", "Managed (RDS)"],
    columnTones: ["ink", "sky", "mint"],
    rows: [
      ["Who runs MySQL", "You", "The provider"],
      ["Cost", "Included in the instance", "A separate bill"],
      ["Setup time", "Minutes", "Longer, plus networking"],
      ["Backups", "You script them", "A checkbox"],
      ["Upgrades", "You plan them", "Managed"],
      ["Survives losing the server", "No", "Yes"],
      ["Good for learning", "Excellent", "Also fine"],
    ],
  }
);

slide(
  {
    title: "The honest answer",
    badge: "TRADE-OFF",
    note: "Don't turn this into dogma in either direction.",
  },
  split(
    panel("Possible?", "mint", ["Yes. This is a real deployment."]),
    panel("Always best?", "coral", ["No. It depends what the data is worth."])
  )
);

slide(
  {
    title: "The important lesson",
    badge: "LESSON",
    note: "Possibly the most useful sentence of the whole workshop.",
  },
  statement("Containers don't mean everything must be a container.", undefined, "orange")
);

slide(
  {
    title: "When you'd move the database out",
    badge: "TRIGGERS",
    note: "Give them concrete signals, not a vague 'when it gets serious'.",
  },
  bullets(
    [
      "Losing the data would end the project",
      "You need more than one app server",
      "Somebody asks about recovery time",
      "Nobody on the team wants to own backups",
    ],
    "sky",
    1
  )
);

slide(
  {
    title: "And what would change if you did",
    subtitle: "One line.",
    badge: "THE PAYOFF",
    note: "This is the environment-variable discipline from Session 3 paying its final dividend.",
  },
  split(
    panel("Today", "sky", ["DB_HOST=db"], { mono: true }),
    panel("With a managed database", "mint", ["DB_HOST=mydb.xxxx.rds.amazonaws.com"], {
      mono: true,
    })
  ),
  callout("app.py does not change. It never has, all day.", "mint")
);

/* ===========================================================
   SECTION 11 — STARTING IT
   =========================================================== */
section("11 / STARTING IT");

slide(
  {
    title: "Everything is in place",
    subtitle: "Three files, a domain, and Docker.",
    badge: "READY",
    note: "Quick inventory before the moment of truth.",
  },
  {
    kind: "checklist",
    items: [
      "The image is on Docker Hub",
      "The instance is running with an Elastic IP",
      "Docker and the compose plugin are installed",
      "compose.production.yaml, Caddyfile and .env are in ~/taskmanager",
      "The A record resolves",
    ],
  }
);

slide(
  {
    title: "Pull the images first",
    subtitle: "Three of them: your app, MySQL, Caddy.",
    badge: "pull",
    note: "Pulling separately makes a slow download obvious instead of looking like a hang.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml pull"),
    out("db    Pulled"),
    out("app   Pulled"),
    out("caddy Pulled")
  )
);

slide(
  {
    title: "Start it",
    subtitle: "The same two words you have typed all workshop.",
    badge: "up -d",
    note: "This is the moment. Detached, because you are going to close the SSH session eventually.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml up -d"),
    out(" Network taskmanager_internal  Created"),
    out(" Volume  taskmanager_mysql_data  Created"),
    out(" Container taskmanager-db-1     Healthy"),
    out(" Container taskmanager-app-1    Started"),
    out(" Container taskmanager-caddy-1  Started")
  )
);

slide(
  {
    title: "Check it",
    badge: "ps",
    note: "db healthy, app and caddy running. If caddy is restarting, go straight to the logs.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml ps"),
    out("NAME                  SERVICE  STATUS"),
    out("taskmanager-app-1     app      running"),
    out("taskmanager-caddy-1   caddy    running"),
    out("taskmanager-db-1      db       running (healthy)")
  )
);

slide(
  {
    title: "Open it",
    subtitle: "On your phone, on the projector, on anything.",
    badge: "THE MOMENT",
    note: "Have someone in the room load it on mobile data. That is the proof it left the laptop.",
  },
  {
    kind: "mockup",
    title: "https://tasks.example.com",
    fields: ["What needs doing?"],
    button: "Add task",
    result: "Task Manager",
  }
);

slide(
  {
    title: "The table created itself",
    subtitle: "No migration step, no manual SQL.",
    badge: "FIRST REQUEST",
    note: "CREATE TABLE IF NOT EXISTS, from Session 3. It runs on the server exactly as it did locally.",
  },
  flow(["First request", "ensure_tasks_table()", "CREATE TABLE IF NOT EXISTS", "Ready"], {
    last: true,
    tone: "mint",
  })
);

slide(
  {
    title: "Watch the logs",
    subtitle: "Especially on the first start.",
    badge: "logs -f",
    note: "Caddy logs the certificate issuance. It is genuinely satisfying to watch.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml logs -f"),
    out("caddy  | certificate obtained successfully"),
    out("caddy  | serving initial configuration"),
    out("app    | Listening at: http://0.0.0.0:5000")
  )
);

slide(
  {
    title: "restart: unless-stopped",
    subtitle: "The line that makes it survive a reboot.",
    badge: "UPTIME",
    note: "Without it, an instance reboot is an outage that lasts until someone notices.",
  },
  annotated(
    "restart: unless-stopped",
    [
      { label: "A container crashes", text: "Docker starts it again." },
      { label: "The instance reboots", text: "Docker starts it again." },
      {
        label: "You run compose down",
        text: "It stays down. That is the 'unless-stopped' part — deliberate stops are respected.",
      },
    ],
    { filename: "compose.production.yaml", language: "yaml" }
  )
);

slide(
  {
    title: "The healthcheck matters more here",
    subtitle: "On a laptop it saved you fifteen seconds. On a reboot it prevents an outage.",
    badge: "READINESS",
    note: "After a power event, everything starts at once. Ordering is no longer a nicety.",
  },
  flow(["Instance boots", "db starts", "healthcheck passes", "app starts", "caddy serves"], {
    last: true,
    tone: "mint",
  })
);

/* ===========================================================
   SECTION 12 — SHIPPING VERSION TWO
   =========================================================== */
section("12 / SHIPPING VERSION TWO");

slide(
  {
    title: "A developer changes one line",
    subtitle: "It is live. Now what?",
    badge: "SCENARIO",
    note: "A trivial change. Watch how much process it creates.",
  },
  code("templates/index.html", "text", "<h1>Task Manager</h1>  →  <h1>Our Task Manager</h1>")
);

slide(
  {
    title: "Rule one: never rebuild a tag",
    subtitle: "1.0.0 means one exact image, forever.",
    badge: "IMMUTABLE",
    note: "If you push over a tag, you lose the ability to say what is running or roll back to it.",
  },
  split(
    panel("Don't", "coral", ["Rebuild and push :1.0.0"], { mono: true }),
    panel("Do", "mint", ["Build and push :1.0.1"], { mono: true })
  )
);

slide(
  {
    title: "On your laptop: build and push",
    badge: "STEP 1",
    note: "Same two commands as the first release, with the number moved on.",
  },
  term(
    cmd("docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1 ."),
    cmd("docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.1")
  )
);

slide(
  {
    title: "On the server: change one line",
    badge: "STEP 2",
    note: "The .env file is the record of what production is running. Editing it is the deploy decision.",
  },
  code(".env", "text", "IMAGE_TAG=1.0.0   →   IMAGE_TAG=1.0.1")
);

slide(
  {
    title: "Pull the new image",
    badge: "STEP 3",
    note: "Naming the service means only the app image is fetched, not MySQL and Caddy again.",
  },
  term(cmd("docker compose --env-file .env -f compose.production.yaml pull app"))
);

slide(
  {
    title: "Recreate only the app",
    badge: "STEP 4",
    note: "Compose compares the desired state with what is running and changes only what differs.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml up -d app"),
    out(" Container taskmanager-app-1  Recreated"),
    out(" Container taskmanager-db-1   Running"),
    comment("db and caddy were not touched")
  )
);

slide(
  {
    title: "What was not touched",
    subtitle: "This is why naming the service matters.",
    badge: "IMPORTANT",
    note: "The database never restarted. Neither did the certificate store.",
  },
  split(
    panel("Replaced", "sky", ["The app container"]),
    panel("Untouched", "mint", ["The db container", "mysql_data", "caddy_data and its certificates"])
  )
);

slide(
  {
    title: "Rolling back",
    subtitle: "The same four steps, with a smaller number.",
    badge: "ROLLBACK",
    note: "This is the payoff for immutable tags. A rollback is an edit and a restart, not a rebuild.",
  },
  term(
    comment("edit .env: IMAGE_TAG=1.0.0"),
    cmd("docker compose --env-file .env -f compose.production.yaml up -d app"),
    comment("previous version live again in seconds")
  )
);

slide(
  {
    title: "There is a gap during the swap",
    subtitle: "A second or two where the app is down.",
    badge: "HONEST NOTE",
    note: "Be upfront. Zero-downtime deploys need two app containers and a proxy that drains — out of scope today.",
  },
  flow(["Old container stops", "New container starts", "Caddy retries"], { tone: "yellow" })
);

slide(
  {
    title: "The deploy, in full",
    badge: "SUMMARY",
    note: "Six steps, two machines, done by a person. Remember that shape for the next section.",
  },
  flow(
    ["Edit code", "docker build :1.0.1", "docker push", "ssh", "edit .env", "pull + up -d app"],
    { tone: "coral" }
  )
);

/* ===========================================================
   SECTION 13 — STOPPING, AND NOT LOSING THINGS
   =========================================================== */
section("13 / STOPPING SAFELY");

slide(
  {
    title: "Stopping it",
    badge: "down",
    note: "Containers and the network go. The volumes stay. Same rule as Session 3.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml down"),
    out(" Container taskmanager-caddy-1  Removed"),
    out(" Container taskmanager-app-1    Removed"),
    out(" Container taskmanager-db-1     Removed"),
    out(" Network taskmanager_internal   Removed")
  )
);

slide(
  {
    title: "down -v is a different command",
    subtitle: "On this server it destroys two things, not one.",
    badge: "DANGER",
    note: "The certificate loss is the one nobody expects. Let's Encrypt rate-limits repeat issuance.",
  },
  split(
    panel("down", "mint", ["Containers removed", "mysql_data kept", "caddy_data kept"]),
    panel("down -v", "coral", [
      "Every task deleted",
      "Every certificate deleted",
      "Re-issuance counts against rate limits",
    ])
  )
);

slide(
  {
    title: "The rule",
    badge: "REMEMBER",
    note: "Say it, then move on. It only needs to be heard once, clearly.",
  },
  statement(
    "Never type -v on a production server unless you have just said out loud what it will delete.",
    undefined,
    "coral"
  )
);

slide(
  {
    title: "Before you terminate the instance",
    subtitle: "Termination takes the disk with it.",
    badge: "CHECKLIST",
    note: "Someone in the room will eventually clean up their AWS account. Give them this list first.",
  },
  {
    kind: "checklist",
    items: [
      "Take a mysqldump and copy it off the instance",
      "Take an EBS snapshot",
      "Confirm you can read the dump",
      "Release the Elastic IP only after DNS is repointed",
    ],
  }
);

/* ===========================================================
   SECTION 14 — YOU DID ALL THAT BY HAND
   =========================================================== */
section("14 / BY HAND");

slide(
  {
    title: "Count what you just did",
    subtitle: "For one line of HTML.",
    badge: "THE PROBLEM",
    note: "Get them to count out loud. The number is the argument for the next section.",
  },
  bullets(
    [
      "Built an image",
      "Remembered the right version number",
      "Pushed it",
      "Found the .pem file",
      "SSH'd in",
      "Edited a file with nano",
      "Ran two compose commands",
    ],
    "coral",
    1
  )
);

slide(
  {
    title: "Now do it again",
    subtitle: "A bug fix.",
    badge: "AGAIN",
    note: "Same seven steps. Nobody in the room wants to do this twice a day.",
  },
  flow(["Build", "Push", "SSH", "Edit .env", "Pull", "Up"], { tone: "coral" })
);

slide(
  {
    title: "And again",
    subtitle: "A colleague's change, while you're on holiday.",
    badge: "AND AGAIN",
    note: "This is where the real cost appears: the process lives in one person's head.",
  },
  bullets(
    [
      "“Which tag is on production?”",
      "“Did you push before you edited .env?”",
      "“Who has the .pem file?”",
      "“Was that staging or production?”",
    ],
    "coral",
    1
  )
);

slide(
  {
    title: "Humans are bad deployment systems",
    badge: "THE REAL PROBLEM",
    note: "Not because people are careless — because the process is repetitive and unverified.",
  },
  split(
    panel("What a person does", "coral", ["Remembers", "Types", "Sometimes at 6pm on a Friday"]),
    panel("What a machine does", "mint", ["The same steps", "In the same order", "Every time"])
  )
);

/* ===========================================================
   SECTION 15 — CI/CD, AND WHERE IT WOULD FIT
   =========================================================== */
section("15 / CI/CD");

slide(
  {
    title: "The name for the fix",
    badge: "THE FIX",
    note: "We are not building this today. We are making sure you know what it is and where it plugs in.",
  },
  statement("CI/CD", "Let a machine do the repetitive part.", "orange")
);

slide(
  {
    title: "Continuous integration",
    subtitle: "Every change gets checked, automatically.",
    badge: "CI",
    note: "CI answers one question: is this change safe to merge?",
  },
  flow(["Push", "Checkout", "Install", "Test"], { last: true, tone: "sky" })
);

slide(
  {
    title: "Continuous delivery / deployment",
    subtitle: "After the checks pass, ship it.",
    badge: "CD",
    note: "Delivery stops at 'ready to deploy'. Deployment goes all the way.",
  },
  flow(["Build image", "Push to registry", "Deploy to the server"], { last: true, tone: "mint" })
);

slide(
  {
    title: "What it would do for our setup",
    subtitle: "Exactly the seven steps you did by hand.",
    badge: "MAPPING",
    note: "Every line here is something they typed twenty minutes ago. That is the point of this slide.",
  },
  {
    kind: "table",
    columns: ["You did", "A pipeline would"],
    columnTones: ["coral", "mint"],
    rows: [
      ["Pick a version number", "Use the commit SHA"],
      ["docker build", "docker build, on a runner"],
      ["docker push", "docker push, with a stored token"],
      ["Find the .pem and SSH in", "SSH with a stored deploy key"],
      ["Edit .env by hand", "Set IMAGE_TAG from the build"],
      ["pull + up -d app", "The same two commands"],
    ],
  }
);

slide(
  {
    title: "Where the pipeline lives",
    subtitle: "In the repository, next to the code it ships.",
    badge: "GITHUB ACTIONS",
    note: "GitHub looks in exactly this folder. Nothing to install.",
  },
  code("repository", "text", ".github/\n└── workflows/\n    └── deploy.yml")
);

slide(
  {
    title: "The trigger",
    badge: "on:",
    note: "Only main deploys. Feature branches get the tests and nothing else.",
  },
  annotated(
    "on:\n  push:\n    branches:\n      - main",
    [
      { label: "on", text: "When the workflow runs." },
      { label: "Here", text: "Every push to main. A push to any other branch does not deploy." },
    ],
    { filename: "deploy.yml", language: "yaml" }
  )
);

slide(
  {
    title: "The shape of it",
    subtitle: "Two jobs. Build, then deploy.",
    badge: "SKETCH",
    note: "Deliberately a sketch, not a working file — the details differ per project and per registry.",
  },
  code(
    "deploy.yml (sketch)",
    "yaml",
    `jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t $USER/taskmanager:\${{ github.sha }} .
      - run: docker push $USER/taskmanager:\${{ github.sha }}

  deploy:
    needs: build
    steps:
      - name: Deploy over SSH
        run: |
          ssh ubuntu@$HOST \\
            "cd taskmanager && \\
             IMAGE_TAG=\${{ github.sha }} docker compose ... up -d app"`
  )
);

slide(
  {
    title: "What it would need from you",
    subtitle: "Three secrets, stored in GitHub — never in the repository.",
    badge: "SECRETS",
    note: "Same principle as the .env file, one layer up.",
  },
  bullets(
    [
      "A Docker Hub Personal Access Token",
      "An SSH private key for the server",
      "The server's hostname",
    ],
    "sky",
    1
  )
);

slide(
  {
    title: "Why we stopped short today",
    badge: "HONEST NOTE",
    note: "Say this plainly. Deploying by hand once is the thing that makes the pipeline make sense.",
  },
  split(
    panel("What you can now do", "mint", [
      "Deploy a real application",
      "Explain every step",
      "Fix it when it breaks",
    ]),
    panel("What comes next", "sky", [
      "Write those steps as a workflow",
      "Let a push run them",
      "Stop needing the .pem file",
    ])
  )
);

slide(
  {
    title: "The order that works",
    badge: "ADVICE",
    note: "Automating a process you have never performed produces a pipeline nobody can debug.",
  },
  statement(
    "Do it by hand. Then automate what you did.",
    "Never automate a process you can't perform yourself.",
    "orange"
  )
);

/* ===========================================================
   SECTION 16 — HANDS-ON PROJECT
   =========================================================== */
section("16 / HANDS-ON PROJECT");

slide(
  {
    title: "Final challenge",
    badge: "YOUR TURN",
    note: "The capstone. Everything from four sessions, on one server, with your name on the domain.",
  },
  statement("Put the Task Manager on the internet", undefined, "orange")
);

slide(
  {
    title: "What you're starting from",
    subtitle: "The step3 folder.",
    badge: "SETUP",
    note: "Same app as step2, plus three deployment files. Nothing else is new.",
  },
  code(
    "step3/",
    "text",
    `step3/
├── app.py                    ← same as step2
├── templates/  static/       ← same as step2
├── Dockerfile                ← same as step2
├── requirements.txt          ← same as step2
├── compose.production.yaml   ← new
├── Caddyfile                 ← new
└── .env.example              ← new`
  )
);

slide(
  {
    title: "What you'll need before you start",
    badge: "PREREQUISITES",
    note: "Check the room. The domain is the one people don't have — pair them up if needed.",
  },
  {
    kind: "checklist",
    items: [
      "A Docker Hub account and a Personal Access Token",
      "An AWS account",
      "A domain name you control the DNS for",
      "An SSH client",
    ],
  }
);

slide(
  {
    title: "Step 1: check it still runs locally",
    badge: "STEP 1",
    note: "Never debug a deployment for a bug that was already there. Two minutes well spent.",
  },
  term(cmd("cd prj/step2"), cmd("docker compose up --build"), comment("open localhost:5000"))
);

slide(
  {
    title: "Step 2: build the production image",
    badge: "STEP 2",
    note: "From step3. A versioned tag with your Docker Hub username in front.",
  },
  code("terminal", "bash", "docker build -t YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0 .")
);

slide(
  {
    title: "Step 3: log in and push",
    badge: "STEP 3",
    note: "Paste the token at the password prompt. If push says denied, the tag prefix is wrong.",
  },
  term(
    cmd("docker login -u YOUR_DOCKERHUB_USERNAME"),
    cmd("docker push YOUR_DOCKERHUB_USERNAME/taskmanager:1.0.0")
  )
);

slide(
  {
    title: "Step 4: launch the instance",
    badge: "STEP 4",
    note: "Ubuntu LTS, t3.micro, public subnet, a key pair you save.",
  },
  bullets(["Ubuntu LTS", "t3.micro", "Public subnet", "Save the .pem"], "sky", 2)
);

slide(
  {
    title: "Step 5: the security group",
    badge: "STEP 5",
    note: "Three rules. Then stop. Every extra open port is a decision you have to defend.",
  },
  {
    kind: "table",
    columns: ["Type", "Port", "Source"],
    columnTones: ["ink", "sky", "mint"],
    rows: [
      ["SSH", "22", "Your IP only"],
      ["HTTP", "80", "Anywhere"],
      ["HTTPS", "443", "Anywhere"],
    ],
  }
);

slide(
  {
    title: "Step 6: Elastic IP, then SSH in",
    badge: "STEP 6",
    note: "Allocate and associate before you touch DNS.",
  },
  code("terminal", "bash", "ssh -i C:\\path\\to\\ec2-key.pem ubuntu@YOUR_ELASTIC_IP")
);

slide(
  {
    title: "Step 7: install Docker",
    badge: "STEP 7",
    note: "The block from section 6. Then exit and reconnect — that step is not optional.",
  },
  term(
    comment("Docker's apt repository, then:"),
    cmd("sudo apt install -y docker-ce docker-ce-cli containerd.io \\"),
    cmd("  docker-buildx-plugin docker-compose-plugin"),
    cmd("sudo usermod -aG docker $USER"),
    cmd("exit")
  )
);

slide(
  {
    title: "Step 8: verify Docker",
    badge: "STEP 8",
    note: "Nobody proceeds until hello-world runs without sudo.",
  },
  term(cmd("docker compose version"), cmd("docker run hello-world"))
);

slide(
  {
    title: "Step 9: copy the deployment files",
    badge: "STEP 9",
    note: "From your laptop, from the step3 directory.",
  },
  code(
    "from your laptop",
    "bash",
    `ssh -i key.pem ubuntu@YOUR_ELASTIC_IP "mkdir -p ~/taskmanager"

scp -i key.pem compose.production.yaml Caddyfile .env.example \\
  ubuntu@YOUR_ELASTIC_IP:~/taskmanager/`
  )
);

slide(
  {
    title: "Step 10: create the .env",
    badge: "STEP 10",
    note: "Real passwords. Not the placeholders, and not the ones from your laptop.",
  },
  term(
    cmd("cd ~/taskmanager"),
    cmd("cp .env.example .env"),
    cmd("chmod 600 .env"),
    cmd("openssl rand -base64 36"),
    cmd("nano .env")
  )
);

slide(
  {
    title: "Step 11: point the domain",
    badge: "STEP 11",
    note: "An A record to the Elastic IP. Then wait for it, genuinely, before the next step.",
  },
  term(cmd("nslookup tasks.example.com"), out("Address: YOUR_ELASTIC_IP"))
);

slide(
  {
    title: "Step 12: start it",
    badge: "STEP 12",
    note: "Pull first so a slow download does not look like a failure.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml pull"),
    cmd("docker compose --env-file .env -f compose.production.yaml up -d"),
    cmd("docker compose --env-file .env -f compose.production.yaml ps")
  )
);

slide(
  {
    title: "Step 13: open it on a phone",
    subtitle: "Not on the machine you built it on.",
    badge: "STEP 13",
    note: "Mobile data, not the office wifi. That is the proof it is really on the internet.",
  },
  callout("https://YOUR_DOMAIN — check for the padlock.", "mint", "The moment")
);

slide(
  {
    title: "Step 14: exercise it",
    badge: "STEP 14",
    note: "The same four operations as Session 3, now over HTTPS from anywhere.",
  },
  {
    kind: "checklist",
    items: [
      "Add a task",
      "Mark it complete",
      "Delete it",
      "Add three more and leave them there",
    ],
  }
);

slide(
  {
    title: "Step 15: reboot the instance",
    subtitle: "From the AWS console.",
    badge: "STEP 15",
    note: "This tests restart: unless-stopped and the healthcheck together. It should come back alone.",
  },
  flow(["Reboot", "Docker starts", "db healthy", "app starts", "Site is back"], {
    last: true,
    tone: "mint",
  })
);

slide(
  {
    title: "Step 16: ship version 1.0.1",
    subtitle: "Change something visible.",
    badge: "STEP 16",
    note: "A visible change makes the deploy obvious to the whole room.",
  },
  code("templates/index.html", "text", "<h1>Task Manager</h1>  →  <h1>YOUR NAME's Tasks</h1>")
);

slide(
  {
    title: "Step 17: build, push, deploy",
    badge: "STEP 17",
    note: "Four commands across two machines. Have them narrate which machine they are on.",
  },
  term(
    comment("on your laptop"),
    cmd("docker build -t YOUR_USERNAME/taskmanager:1.0.1 ."),
    cmd("docker push YOUR_USERNAME/taskmanager:1.0.1"),
    comment("on the server, after editing IMAGE_TAG in .env"),
    cmd("docker compose --env-file .env -f compose.production.yaml pull app"),
    cmd("docker compose --env-file .env -f compose.production.yaml up -d app")
  )
);

slide(
  {
    title: "Step 18: confirm the tasks survived",
    subtitle: "You replaced the application container. The data did not move.",
    badge: "STEP 18",
    note: "The Session 2 volume lesson, proven on a real server, at the end of the workshop.",
  },
  flow(["New app version", "Same db container", "Same mysql_data", "Same tasks"], {
    last: true,
    tone: "mint",
  })
);

slide(
  {
    title: "Step 19: roll it back",
    badge: "STEP 19",
    note: "Set IMAGE_TAG back to 1.0.0. Fifteen seconds. This is why we never reuse a tag.",
  },
  term(
    comment("edit .env: IMAGE_TAG=1.0.0"),
    cmd("docker compose --env-file .env -f compose.production.yaml up -d app")
  )
);

slide(
  {
    title: "Acceptance criteria",
    badge: "DONE WHEN",
    note: "Read these out. Anyone who can tick all eight has genuinely deployed something.",
  },
  {
    kind: "checklist",
    items: [
      "The site loads over HTTPS on a device you did not build it on",
      "The padlock is valid, with no browser warning",
      "All four task operations work",
      "Port 3306 and port 5000 are not open in the security group",
      "No secret is in the image or in Git",
      "Tasks survive an app redeploy and an instance reboot",
      "You shipped 1.0.1 and rolled back to 1.0.0",
      "You can explain why Caddy proxies to app:5000 and not localhost:5000",
    ],
  }
);

slide(
  {
    title: "Stretch goals",
    badge: "IF YOU FINISH EARLY",
    note: "Three genuine improvements, in increasing order of effort.",
  },
  bullets(
    [
      "Add a non-root user to the Dockerfile",
      "Take a mysqldump and restore it into a fresh volume",
      "Write the GitHub Actions workflow from section 15",
    ],
    "sky",
    1
  )
);

slide(
  {
    title: "Before you leave the room",
    subtitle: "AWS bills by the hour.",
    badge: "CLEAN UP",
    note: "Genuinely say this. Somebody will otherwise find a bill next month.",
  },
  {
    kind: "checklist",
    items: [
      "Take a mysqldump if you want to keep the data",
      "Terminate the instance, or accept the running cost",
      "Release the Elastic IP — an unattached one is charged",
      "Remove the DNS record",
    ],
  }
);

/* ===========================================================
   SECTION 17 — DEBUGGING PRODUCTION
   =========================================================== */
section("17 / DEBUGGING PRODUCTION");

slide(
  {
    title: "Something will break",
    badge: "REALITY",
    joke: "Definitely while you are presenting.",
    note: "Get the laugh, then make it serious: have a process, not a panic.",
  },
  statement("Eventually.", "Probably during the demo.", "coral")
);

slide(
  {
    title: "The debugging mindset",
    subtitle: "Don't randomly change things.",
    badge: "MINDSET",
    note: "Locate before you fix. The next slides are the layers, from outside in.",
  },
  callout("Where exactly does the request stop?", "sky", "Ask")
);

slide(
  {
    title: "Layer 1: DNS",
    subtitle: "Does the name point at your server?",
    badge: "LAYER 1",
    note: "Start at the very outside. A stale A record looks exactly like a dead server.",
  },
  term(cmd("nslookup tasks.example.com"), comment("does it return your Elastic IP?"))
);

slide(
  {
    title: "Layer 2: the firewall",
    subtitle: "Can anything reach the box at all?",
    badge: "LAYER 2",
    note: "A connection that times out is almost always the security group.",
  },
  split(
    panel("Times out", "coral", ["Security group", "Or the instance is stopped"]),
    panel("Connection refused", "yellow", ["It reached the box", "Nothing is listening"])
  )
);

slide(
  {
    title: "Layer 3: the containers",
    subtitle: "Are all three actually running?",
    badge: "LAYER 3",
    note: "A container in a restart loop is the single most common cause. ps tells you immediately.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml ps"),
    comment("db healthy? app running? caddy running?")
  )
);

slide(
  {
    title: "Layer 4: Caddy and the certificate",
    subtitle: "A browser warning is a Caddy problem, not an app problem.",
    badge: "LAYER 4",
    note: "Caddy's logs say exactly why issuance failed. They are unusually readable.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml logs caddy"),
    out("could not get certificate: no valid A records found")
  )
);

slide(
  {
    title: "Layer 5: the application",
    subtitle: "502 from Caddy means Caddy is fine and the app is not.",
    badge: "LAYER 5",
    note: "Teach this mapping. It saves half an hour every time.",
  },
  {
    kind: "table",
    columns: ["What you see", "What it means"],
    columnTones: ["ink", "sky"],
    rows: [
      ["Browser can't connect", "DNS, firewall, or Caddy is down"],
      ["Certificate warning", "Caddy could not get a certificate"],
      ["502 Bad Gateway", "Caddy is up; app is not reachable"],
      ["“Database unavailable”", "app is up; MySQL is not reachable"],
      ["The old version is served", "IMAGE_TAG or the pull"],
    ],
  }
);

slide(
  {
    title: "Layer 6: the database",
    subtitle: "The Session 3 checklist, unchanged.",
    badge: "LAYER 6",
    note: "Everything they learned locally applies identically here.",
  },
  {
    kind: "checklist",
    items: [
      "Is db healthy?",
      "Is DB_HOST still db?",
      "Do the credentials in .env match the volume's?",
      "Did someone change MYSQL_PASSWORD after the volume was created?",
    ],
  }
);

slide(
  {
    title: "The credential trap, on a server",
    subtitle: "MySQL only reads those variables once.",
    badge: "GOTCHA",
    note: "Changing MYSQL_PASSWORD in .env does nothing to an already-initialised volume.",
  },
  split(
    panel("What people expect", "coral", ["Edit .env", "up -d", "New password works"]),
    panel("What happens", "ink", [
      "The volume already has the old user",
      "The app is refused",
      "Only a fresh volume applies the change",
    ])
  )
);

slide(
  {
    title: "Getting inside a container",
    badge: "exec",
    note: "Last resort, but invaluable. Check the environment the app actually received.",
  },
  term(
    cmd("docker compose --env-file .env -f compose.production.yaml exec app sh"),
    cmd("env | grep DB_"),
    comment("is DB_HOST really db?")
  )
);

slide(
  {
    title: "The debugging flow",
    badge: "PROCESS",
    note: "Outside in, one layer at a time. Never start at the database.",
  },
  flow(["DNS", "Firewall", "Containers", "Caddy", "App", "Database"], { tone: "sky" })
);

/* ===========================================================
   SECTION 18 — DEV VS PROD, REVISITED
   =========================================================== */
section("18 / DEV VS PROD, REVISITED");

slide(
  {
    title: "Side by side",
    badge: "COMPARE",
    note: "Two architectures, one codebase. Sit on this slide for a moment.",
  },
  split(
    panel("Development (step2)", "mint", [
      "Laptop",
      "├── app container",
      "└── db container",
      "      └── mysql_data",
    ], { mono: true }),
    panel("Production (step3)", "sky", [
      "EC2",
      "├── caddy  :80 :443",
      "├── app",
      "└── db",
      "      └── mysql_data",
    ], { mono: true })
  )
);

slide(
  {
    title: "Why change the shape at all?",
    subtitle: "Different goals justify different architectures.",
    badge: "WHY",
    note: "Convenience locally; reachability and safety in production.",
  },
  split(
    panel("Development", "mint", ["Optimised for a fast loop"]),
    panel("Production", "sky", ["Optimised for being reachable, safely, always"])
  )
);

slide(
  {
    title: "One more important idea",
    badge: "PRINCIPLE",
    note: "They are allowed to change the architecture as the needs change.",
  },
  statement(
    "Your architecture can evolve.",
    "Development and production don't have to look the same.",
    "sky"
  )
);

/* ===========================================================
   SECTION 19 — WHAT ABOUT KUBERNETES?
   =========================================================== */
section("19 / WHAT ABOUT KUBERNETES?");

slide(
  {
    title: "We didn't use Kubernetes",
    badge: "ON PURPOSE",
    note: "Someone always asks. Answer it head-on.",
  },
  statement("And that's intentional.", undefined, "sky")
);

slide(
  {
    title: "We also didn't use ECS, Fargate or RDS",
    subtitle: "Also on purpose.",
    badge: "SCOPE",
    note: "Be explicit that these were choices, not omissions. Then say what the choice bought.",
  },
  split(
    panel("Our goal", "mint", [
      "Deploy something real",
      "Understand every moving part",
      "Be able to fix it",
    ]),
    panel("Not our goal", "coral", ["Learn one cloud's vocabulary", "Hide the machine"])
  )
);

slide(
  {
    title: "What you learned instead is portable",
    subtitle: "A Linux box with Docker is a Linux box with Docker.",
    badge: "THE PAYOFF",
    note: "Everything today works identically on any provider, or on a machine under a desk.",
  },
  bullets(
    ["AWS EC2", "DigitalOcean", "Hetzner", "A server in your office"],
    "sky",
    2
  )
);

slide(
  {
    title: "Where the bigger tools fit",
    subtitle: "At a scale this deployment doesn't have.",
    badge: "LATER",
    note: "Many services, many machines, many teams — that's when the complexity earns itself.",
  },
  flow(["One container", "One server", "Many servers", "Orchestration"], { last: true })
);

slide(
  {
    title: "Docker vs Kubernetes",
    badge: "DIFFERENT JOBS",
    note: "Not competitors. One builds on the other.",
  },
  split(
    panel("Docker", "sky", ["Container technology"]),
    panel("Kubernetes", "orange", ["Container orchestration"])
  )
);

slide(
  {
    title: "The important point",
    badge: "ADVICE",
    note: "Session 1 showed Kubernetes as the destination. Now they know the road.",
  },
  statement("Learn Docker first.", "Then orchestration makes much more sense.", "orange")
);

/* ===========================================================
   SECTION 20 — FINAL ARCHITECTURE
   =========================================================== */
section("20 / FINAL ARCHITECTURE");

slide(
  {
    title: "Runtime: where requests go",
    badge: "RUNTIME",
    note: "Left to right, the path of a single click.",
  },
  flow(
    ["User", "DNS", "Elastic IP", "Caddy", "Flask app", "MySQL", "mysql_data"],
    { last: true }
  )
);

slide(
  {
    title: "Delivery: where code goes",
    badge: "DELIVERY",
    note: "The other half. Two machines, one registry in the middle.",
  },
  flow(
    ["Your laptop", "docker build", "Docker Hub", "docker pull", "EC2", "compose up -d"],
    { last: true, tone: "sky" }
  )
);

slide(
  {
    title: "What's inside the box",
    badge: "ON THE INSTANCE",
    note: "Three containers, three volumes, one network. That is the whole production system.",
  },
  {
    kind: "stack",
    layers: [
      { label: "EC2 instance (Ubuntu)", tone: "ink" },
      { label: "Docker Engine", tone: "sky" },
      { label: "caddy — the only public ports", tone: "orange" },
      { label: "app — Flask + gunicorn", tone: "yellow" },
      { label: "db — MySQL + mysql_data", tone: "mint" },
    ],
    caption: "one network, internal — only caddy is reachable from outside",
  }
);

slide(
  {
    title: "The whole thing on one line",
    badge: "EVERYTHING",
    note: "The slide from the very start of the session, now with every word earned.",
  },
  flow(["Internet", "domain", "EC2 Elastic IP", "Caddy (HTTPS)", "Flask app", "MySQL volume"], {
    last: true,
    tone: "orange",
  })
);

/* ===========================================================
   SECTION 21 — THE COMPLETE JOURNEY
   One sentence per slide, deliberately — the rhythm is the point.
   =========================================================== */
section("21 / THE COMPLETE JOURNEY");

slide(
  {
    title: "Where we started",
    badge: "SESSION 1",
    note: "Slow down for this sequence. Click through with a beat on each.",
  },
  statement("“It works on my machine.”", undefined, "coral")
);

slide(
  { title: "Then", badge: "SESSION 2", note: "Containers." },
  statement("“It works inside my container.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "SESSION 2", note: "Persistence." },
  statement("“My data survives.”", undefined, "mint")
);

slide(
  { title: "Then", badge: "SESSION 3", note: "Networking." },
  statement("“My containers can talk to each other.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "SESSION 3", note: "Compose." },
  statement("“My whole application starts with one command.”", undefined, "yellow")
);

slide(
  { title: "Then", badge: "REGISTRY", note: "Distribution." },
  statement("“My image is somewhere anyone can pull it.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "THE SERVER", note: "The cloud." },
  statement("“It runs on a computer that is always on.”", undefined, "orange")
);

slide(
  { title: "Finally", badge: "HTTPS", note: "Land this one. It is the whole workshop in a sentence." },
  statement("“Anyone in the world can open it, safely.”", undefined, "orange")
);

/* ===========================================================
   SECTION 22 — FINAL RECAP
   =========================================================== */
section("22 / FINAL RECAP");

slide(
  { title: "Docker mental model", badge: "RECAP", note: "The foundation from Session 2." },
  flow(["Dockerfile", "Image", "Container"], { last: true })
);

slide(
  { title: "Development mental model", badge: "RECAP", note: "Session 3's loop." },
  flow(["Code", "compose up --build", "Containers", "Network", "Volume"], {
    last: true,
    tone: "mint",
  })
);

slide(
  { title: "Delivery mental model", badge: "RECAP", note: "Today's path from laptop to server." },
  flow(["Build", "Tag", "Push", "Pull", "Up"], { last: true, tone: "sky" })
);

slide(
  { title: "Networking mental model", badge: "RECAP", note: "One rule, four sessions, five contexts." },
  split(
    panel("Never", "coral", ["localhost"], { mono: true }),
    panel("Always", "mint", ["the service name"], { mono: true })
  )
);

slide(
  { title: "Data mental model", badge: "RECAP", note: "Containers are disposable; volumes are not; backups are yours." },
  flow(["Container", "Named volume", "Backup", "Somewhere else"], { last: true, tone: "mint" })
);

slide(
  {
    title: "The big picture",
    badge: "EVERYTHING",
    note: "Both halves of the system, one above the other.",
  },
  flow(["Code", "Image", "Docker Hub", "EC2", "Compose", "Caddy", "Users"], { last: true }),
  flow(["MySQL container", "mysql_data", "Backups"], { last: true, tone: "mint" })
);

/* ===========================================================
   SECTION 23 — WHAT YOU KNOW NOW
   =========================================================== */
section("23 / WHAT YOU KNOW NOW");

slide(
  {
    title: "You can explain Docker",
    badge: "YOU CAN",
    note: "Ask a volunteer to answer one of these out loud.",
  },
  bullets(["What is an image?", "What is a container?", "What is a volume?"], "sky", 1)
);

slide(
  { title: "You can build images", badge: "YOU CAN", note: "And say why each line of the Dockerfile is there." },
  term(cmd("docker build -t user/taskmanager:1.0.0 ."))
);

slide(
  { title: "You can publish them", badge: "YOU CAN", note: "With a token, and a version number that means something." },
  flow(["Build", "Tag", "Push", "Docker Hub"], { last: true, tone: "sky" })
);

slide(
  { title: "You can run a multi-container app", badge: "YOU CAN", note: "One file, three services, one command." },
  flow(["compose.yaml", "Services", "One application"], { last: true, tone: "yellow" })
);

slide(
  { title: "You can rent and secure a server", badge: "YOU CAN", note: "And you know which ports to leave closed." },
  bullets(["Launch an instance", "Write a security group", "SSH in", "Install Docker"], "sky", 2)
);

slide(
  { title: "You can put a site on a domain", badge: "YOU CAN", note: "An A record and a four-line Caddyfile." },
  flow(["A record", "Caddy", "Let's Encrypt", "HTTPS"], { last: true, tone: "mint" })
);

slide(
  { title: "You can ship a new version", badge: "YOU CAN", note: "And roll it back in fifteen seconds." },
  flow(["New tag", "Push", "IMAGE_TAG", "up -d app"], { last: true })
);

slide(
  { title: "You can debug it when it breaks", badge: "YOU CAN", note: "Outside in, one layer at a time." },
  flow(["DNS", "Firewall", "Containers", "Caddy", "App", "Database"], { tone: "sky" })
);

slide(
  {
    title: "You can make an architectural argument",
    badge: "YOU CAN",
    note: "And that is the difference between following a tutorial and doing the job.",
  },
  split(
    panel("MySQL in a container", "sky", ["Cheap", "Yours to back up"]),
    panel("A managed database", "mint", ["Costs more", "Survives losing the server"])
  )
);

/* ===========================================================
   SECTION 24 — FINAL CHALLENGE
   =========================================================== */
section("24 / FINAL CHALLENGE");

slide(
  { title: "Your take-home challenge", badge: "TAKE-HOME", note: "Four verbs, in order. Not the Task Manager this time." },
  flow(["Build something", "Containerise it", "Publish it", "Deploy it"], { last: true })
);

slide(
  {
    title: "The rule",
    subtitle: "Use your own application, not this one.",
    badge: "CONSTRAINT",
    note: "Repeating today's steps on unfamiliar code is where it actually sticks.",
  },
  callout(
    "Anything with a database. A blog, a bookmark list, a scoreboard. The infrastructure is identical.",
    "sky"
  )
);

slide(
  {
    title: "Target architecture",
    badge: "TARGET",
    note: "What a finished submission looks like.",
  },
  flow(["Your code", "Docker Hub", "A server", "Caddy", "HTTPS", "A domain"], { last: true })
);

slide(
  {
    title: "Bonus",
    subtitle: "Automate the part you did by hand.",
    badge: "BONUS",
    note: "Now that they have done it manually, the workflow file will make sense.",
  },
  code("repository", "text", ".github/workflows/deploy.yml")
);

slide(
  {
    title: "Discussion",
    badge: "ASK THE ROOM",
    note: "Let a few people argue each side. There is no single right answer.",
  },
  callout(
    "If this application had real users tomorrow, what is the first thing you would change about today's setup?",
    "sky",
    "Ask"
  )
);

/* ===========================================================
   SECTION 25 — FINAL SLIDE
   =========================================================== */
section("25 / FINAL SLIDE");

slide(
  { title: "You started here", badge: "SESSION 1", note: "Callback to the very first slide of the workshop." },
  statement("“It works on my machine.”", undefined, "coral")
);

slide(
  { title: "You end here", badge: "SESSION 4", note: "Every box is something they now know how to do." },
  flow(["Code", "Image", "Registry", "Server", "HTTPS", "Users"], { last: true })
);

slide(
  {
    title: "You didn't just learn Docker",
    subtitle: "You learned how an application gets from a laptop to a domain name.",
    badge: "FINAL MESSAGE",
    note: "Say this one slowly.",
  },
  flow(["Developer laptop", "Docker", "A server", "The internet"], { last: true })
);

slide(
  {
    title: "That's the DevOps mindset",
    badge: "END OF THE WORKSHOP",
    note: "Thank them. That's the series.",
  },
  flow(["Build", "Package", "Publish", "Run", "Operate"], { last: true })
);

/* ===========================================================
   APPENDIX — a cheat sheet for the hands-on block, and the
   closing takeaway, kept after the final slide for Q&A.
   =========================================================== */
section("APPENDIX");

slide(
  { title: "Demo cheat sheet", badge: "REFERENCE", note: "Keep this up during the hands-on block." },
  {
    kind: "cheatsheet",
    groups: [
      {
        title: "On your laptop",
        commands: [
          "docker login -u USERNAME",
          "docker build -t USERNAME/taskmanager:1.0.0 .",
          "docker push USERNAME/taskmanager:1.0.0",
        ],
      },
      {
        title: "Getting there",
        commands: [
          "ssh -i key.pem ubuntu@ELASTIC_IP",
          "scp -i key.pem compose.production.yaml Caddyfile \\\n  .env.example ubuntu@ELASTIC_IP:~/taskmanager/",
        ],
      },
      {
        title: "On the server",
        commands: [
          "alias dcp='docker compose --env-file .env \\\n  -f compose.production.yaml'",
          "dcp pull",
          "dcp up -d",
          "dcp ps",
          "dcp logs -f",
        ],
      },
      {
        title: "Shipping an update",
        commands: ["# edit IMAGE_TAG in .env", "dcp pull app", "dcp up -d app"],
      },
    ],
  }
);

slide(
  {
    title: "Remember",
    subtitle: "The workshop in four lines.",
    badge: "TAKEAWAY",
    note: "The last thing on screen.",
  },
  bullets(
    [
      "Build once, run anywhere.",
      "Configuration comes from the environment.",
      "Never reuse a version number.",
      "Do it by hand before you automate it.",
    ],
    "orange",
    1
  )
);

export const SESSION4_SLIDES: SlideData[] = deck;
