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
   through-line, now on its way to AWS.
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
    subtitle: "The final workshop session — from local containers to a production application.",
    badge: "SESSION 4",
    note: "Last session. Today the Task Manager leaves the laptop.",
  },
  boxes([
    box("AWS", ["where it runs"], "orange"),
    box("Databases", ["where data lives"], "sky"),
    box("CI/CD", ["how it ships"], "mint"),
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
    subtitle: "The local Task Manager.",
    badge: "RECAP",
    note: "Session 3's architecture, end to end. Everything today starts from here.",
  },
  flow(["Browser", "Streamlit", "Docker network", "MySQL", "Named volume"], { last: true })
);

slide(
  {
    title: "It works!",
    subtitle: "localhost:8501",
    badge: "STATUS",
    note: "Let them enjoy this for a second before the next slide takes it away.",
  },
  bullets(
    ["Application is running", "Database is running", "Data survives container restarts"],
    "mint",
    1
  )
);

slide(
  { title: "But…", badge: "THE QUESTION", note: "Pause. Let the question hang." },
  statement("Is this production-ready?", undefined, "coral")
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
      "Where does it run?",
      "How do we expose it?",
      "Where does the image live?",
      "Where does the database live?",
      "How do we update it?",
      "What happens when it crashes?",
      "How do we deploy on every push?",
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
  flow(["Code", "Docker", "Registry", "AWS", "Database", "CI/CD"], { last: true })
);

/* ===========================================================
   SECTION 2 — DEVELOPMENT VS PRODUCTION
   =========================================================== */
section("02 / DEVELOPMENT VS PRODUCTION");

slide(
  {
    title: "Development",
    subtitle: "Perfect for learning and development.",
    badge: "TODAY",
    note: "Everything on one laptop. That's a feature for development.",
  },
  flow(["Laptop", "Docker", "Streamlit + MySQL containers", "Named volume"], {
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
      "Reliability",
      "Security",
      "Availability",
      "Scaling",
      "Monitoring",
      "Deployment automation",
      "Persistent data",
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
    panel("Production", "orange", ["“Thousands of users depend on it.”"])
  )
);

slide(
  {
    title: "Our development setup",
    subtitle: "Everything on one laptop.",
    badge: "LOCAL",
    note: "Keep this picture in mind — we'll swap pieces of it out one by one.",
  },
  flow(["Streamlit container", "Docker network", "MySQL container", "Named volume"], {
    last: true,
  })
);

slide(
  {
    title: "What changes?",
    subtitle: "Two things move.",
    badge: "THE SHIFT",
    note: "Where it runs, and where the data lives. Those are today's two big decisions.",
  },
  flow(["Laptop", "Cloud"], { last: true }),
  flow(["Local MySQL", "Production database"], { tone: "sky", last: true })
);

/* ===========================================================
   SECTION 3 — PRODUCTION DOCKER IMAGE
   =========================================================== */
section("03 / PRODUCTION IMAGE");

slide(
  {
    title: "First step",
    badge: "PRODUCTION IMAGE",
    note: "Before AWS, the image itself has to be fit to ship.",
  },
  statement(
    "Build a production image",
    "We shouldn't deploy our development environment blindly.",
    "orange"
  )
);

slide(
  {
    title: "Our current Dockerfile",
    badge: "STARTING POINT",
    note: "The slim image from Session 2. Good foundation — now we harden it.",
  },
  code(
    "Dockerfile",
    "dockerfile",
    `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app.py .

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]`
  )
);

slide(
  {
    title: "What makes an image production-friendly?",
    badge: "PROPERTIES",
    note: "Four properties. The next few slides work through them.",
  },
  boxes([
    box("Small", [], "sky"),
    box("Predictable", [], "yellow"),
    box("Secure", [], "coral"),
    box("Reproducible", [], "mint"),
  ])
);

slide(
  {
    title: "Pin your dependencies",
    subtitle: "Same dependencies. Same environment. More predictable deployments.",
    badge: "PREDICTABLE",
    note: "Unpinned means every build can pull something different. That's a bug waiting for a Friday.",
  },
  split(
    panel("Unpinned", "coral", ["streamlit", "mysql-connector-python"], { mono: true }),
    panel("Pinned", "mint", ["streamlit==1.x.x", "mysql-connector-python==9.x.x"], {
      mono: true,
      note: "The same versions on every build",
    })
  )
);

slide(
  {
    title: "Don't put secrets in the image",
    badge: "BAD",
    note: "Anyone who can pull the image can read ENV values with docker inspect.",
  },
  annotated(
    "ENV DB_PASSWORD=my-secret-password",
    [
      { label: "Problem", text: "The secret becomes part of the image configuration." },
      {
        label: "Why it matters",
        text: "Anyone who can pull the image can read it with docker inspect.",
      },
    ],
    { filename: "Dockerfile", language: "dockerfile" }
  )
);

slide(
  {
    title: "Better: pass configuration at runtime",
    badge: "BETTER",
    note: "The image stays generic. The environment supplies the specifics.",
  },
  boxes(
    [
      box("Runtime config", ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"], "sky"),
      box("Container", ["reads os.environ"], "orange"),
    ],
    "injected into"
  )
);

slide(
  {
    title: "Environment variables",
    badge: "CONFIG",
    note: "Same five values from Session 3.",
  },
  code(
    ".env",
    "text",
    `DB_HOST=db
DB_PORT=3306
DB_NAME=tasks
DB_USER=root
DB_PASSWORD=example`
  )
);

slide(
  {
    title: "Development vs production secrets",
    badge: "SECRETS",
    note: "A .env file is fine on your laptop. In production, use a real secret store.",
  },
  split(
    panel("Development", "mint", [".env", "Docker Compose"], { mono: true }),
    panel("Production", "sky", ["AWS Secrets Manager", "AWS Systems Manager Parameter Store"], {
      note: "A proper secret-management mechanism",
    })
  )
);

slide(
  {
    title: "Don't run as root",
    subtitle: "Containers shouldn't run everything as root by default.",
    badge: "SECURE",
    note: "If the app is compromised, a non-root user limits what an attacker can do.",
  },
  code(
    "Dockerfile",
    "dockerfile",
    `RUN useradd -m appuser

USER appuser`
  )
);

slide(
  {
    title: "Production checklist",
    subtitle: "Before you deploy.",
    badge: "CHECKLIST",
    note: "Run through this before every first deploy of a new service.",
  },
  bullets(
    [
      "Small base image",
      "Dependencies controlled",
      "No secrets in the image",
      "Listens on the correct interface",
      "Configuration from the environment",
      "Safe to restart",
    ],
    "mint",
    2
  )
);

/* ===========================================================
   SECTION 4 — CONTAINER REGISTRIES
   =========================================================== */
section("04 / CONTAINER REGISTRIES");

slide(
  {
    title: "We have an image — on our laptop",
    subtitle: "AWS can't reach an image sitting on your machine.",
    badge: "THE GAP",
    note: "Same problem as Session 2's Docker Hub section, now with AWS on the other end.",
  },
  boxes([box("Your laptop", ["hello-user:2.0"], "orange"), box("AWS", ["can't see it"], "ink")])
);

slide(
  {
    title: "Where does the image go?",
    subtitle: "A container registry stores images.",
    badge: "REGISTRY",
    note: "The registry sits between building and running.",
  },
  flow(["Docker image", "Container registry", "Cloud"], { last: true, tone: "sky" })
);

slide(
  {
    title: "Docker Hub — we've done this",
    badge: "RECAP",
    note: "Quick callback. They pushed to Docker Hub in Session 2.",
  },
  term(cmd("docker login"), cmd("docker tag hello-user:2.0 YOUR_USERNAME/hello-user:2.0"))
);

slide(
  { title: "Push", badge: "RECAP", note: "Now the image exists remotely." },
  term(cmd("docker push YOUR_USERNAME/hello-user:2.0"), comment("now the image exists remotely"))
);

slide(
  {
    title: "Pull",
    subtitle: "Any other machine can now run it.",
    badge: "RECAP",
    note: "Close the loop, then move to AWS's own registry.",
  },
  term(cmd("docker pull YOUR_USERNAME/hello-user:2.0"))
);

slide(
  {
    title: "AWS needs a registry too",
    badge: "AMAZON ECR",
    note: "Same idea as Docker Hub, living inside your AWS account.",
  },
  statement("Amazon ECR", "Elastic Container Registry", "sky")
);

slide(
  {
    title: "The ECR mental model",
    badge: "MENTAL MODEL",
    note: "Build locally, push to ECR, AWS pulls from ECR. Three verbs.",
  },
  flow(
    ["Your laptop", "docker build", "Docker image", "docker push", "Amazon ECR", "docker pull", "AWS compute"],
    { last: true }
  )
);

slide(
  {
    title: "Create an ECR repository",
    subtitle: "One repository per application image.",
    badge: "SETUP",
    note: "Create it in the console or CLI. The name is all that matters today.",
  },
  code("ECR", "text", "ECR\n└── task-manager")
);

slide(
  {
    title: "A repository holds versions",
    badge: "TAGS",
    note: "Tags again — the same idea from Session 2, now in ECR.",
  },
  code("task-manager", "text", "task-manager\n├── 1.0\n├── 1.1\n├── 1.2\n└── latest")
);

slide(
  {
    title: "Tagging for ECR",
    badge: "docker tag",
    note: "The long registry prefix is what tells Docker where to push.",
  },
  annotated(
    "docker tag task-manager:1.0 \\\n  <ECR-URL>/task-manager:1.0",
    [
      {
        label: "<ECR-URL>",
        text: "Your registry's address, built from your AWS account ID and region. The next slide spells it out.",
      },
      { label: "task-manager:1.0", text: "Repository name and tag, as before." },
    ],
    { language: "bash" }
  )
);

slide(
  {
    title: "Push to ECR",
    subtitle: "Here's <ECR-URL> written out in full.",
    badge: "docker push",
    note: "Same push command — only the destination changed. Point at the account ID and region.",
  },
  code(
    "terminal",
    "bash",
    "docker push \\\n  <AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/task-manager:1.0"
  )
);

slide(
  {
    title: "The important idea",
    badge: "REMEMBER",
    note: "Four boxes. The image moves; the Dockerfile stays with the code.",
  },
  flow(["Dockerfile", "Docker image", "ECR", "AWS"], { last: true })
);

/* ===========================================================
   SECTION 5 — WHERE DOES THE CONTAINER RUN?
   =========================================================== */
section("05 / WHERE DOES IT RUN?");

slide(
  {
    title: "A registry is not a runtime",
    subtitle: "ECR stores the image. So who runs the container?",
    badge: "REGISTRY ≠ RUNTIME",
    note: "A common confusion. ECR is storage, not compute.",
  },
  split(
    panel("ECR does", "mint", ["Store images", "Keep versions"]),
    panel("ECR doesn't", "coral", ["Run containers", "Serve traffic"])
  )
);

slide(
  {
    title: "Option 1: a virtual machine",
    badge: "EC2",
    note: "It works. It's also the most hands-on option.",
  },
  flow(["EC2", "Docker", "Container"], { vertical: true, tone: "sky" })
);

slide(
  {
    title: "But now we manage all of it",
    subtitle: "More control. More responsibility.",
    badge: "THE COST",
    note: "Every item here is a thing you now patch, secure and get paged for.",
  },
  bullets(
    ["Server", "Operating system", "Docker", "Security", "Updates", "Networking", "The container"],
    "coral",
    2
  )
);

slide(
  { title: "Option 2", badge: "AMAZON ECS", note: "Let AWS run the containers for us." },
  statement("Amazon ECS", "Elastic Container Service", "orange")
);

slide(
  {
    title: "What is ECS?",
    subtitle: "A service for running and managing containers on AWS.",
    badge: "ECS",
    note: "ECS pulls from ECR and keeps containers running.",
  },
  flow(["ECR", "ECS", "Containers"], { last: true })
);

slide(
  { title: "Fargate", badge: "ECS + FARGATE", note: "No servers to patch. You describe the container; AWS finds somewhere to run it." },
  statement(
    "ECS + Fargate",
    "Fargate runs your containers without you managing the underlying servers.",
    "mint"
  )
);

slide(
  {
    title: "The simple mental model",
    badge: "MENTAL MODEL",
    note: "Four tools, four jobs. This slide is worth a photo.",
  },
  boxes([
    box("Docker", ["build & package"], "ink"),
    box("ECR", ["store the image"], "sky"),
    box("ECS", ["manage containers"], "orange"),
    box("Fargate", ["run containers"], "mint"),
  ])
);

slide(
  {
    title: "ECS architecture",
    badge: "ARCHITECTURE",
    note: "Each layer lives inside the one above it.",
  },
  {
    kind: "stack",
    layers: [
      { label: "AWS", tone: "ink" },
      { label: "ECS Cluster", tone: "sky" },
      { label: "ECS Service", tone: "orange" },
      { label: "Container", tone: "mint" },
    ],
    caption: "each layer sits inside the one above",
  }
);

slide(
  {
    title: "Cluster",
    subtitle: "A logical grouping of ECS resources.",
    badge: "CONCEPT",
    note: "Just a grouping. It doesn't do much on its own.",
  },
  {
    kind: "stack",
    layers: [
      { label: "ECS Cluster", tone: "ink" },
      { label: "Task", tone: "sky" },
      { label: "Task", tone: "sky" },
      { label: "Task", tone: "sky" },
    ],
    caption: "one cluster, many tasks",
  }
);

slide(
  {
    title: "Task",
    subtitle: "A running instance of a task definition.",
    badge: "CONCEPT",
    note: "Task is to task definition what container is to image.",
  },
  callout("Think of a task as the running workload.", "sky", "Think")
);

slide(
  {
    title: "Task definition",
    subtitle: "Describes how ECS should run the container.",
    badge: "CONCEPT",
    note: "It's the ECS equivalent of a docker run command, written down.",
  },
  bullets(
    ["Image", "CPU", "Memory", "Port", "Environment variables", "Secrets", "Logging"],
    "sky",
    2
  )
);

slide(
  {
    title: "Service",
    subtitle: "Keeps the desired number of tasks running.",
    badge: "CONCEPT",
    note: "You declare how many. ECS makes it true, and keeps it true.",
  },
  split(
    panel("You declare", "ink", ["desired count = 2"], { mono: true }),
    panel("ECS maintains", "mint", ["Task 1 — running", "Task 2 — running"])
  )
);

slide(
  {
    title: "If a container dies?",
    badge: "SELF-HEALING",
    note: "The service is what turns a crash into a restart instead of an outage.",
  },
  split(
    panel("Without a service", "coral", ["Container dies", "  ↓", "Application stops"], { mono: true }),
    panel("With an ECS service", "mint", ["Container dies", "  ↓", "ECS notices", "  ↓", "New task starts"], {
      mono: true,
    })
  )
);

slide(
  {
    title: "Our deployment flow",
    badge: "THE PATH",
    note: "From image to running container, through every ECS concept we just met.",
  },
  flow(
    ["Docker image", "ECR", "Task definition", "ECS service", "Fargate", "Running container"],
    { last: true }
  )
);

/* ===========================================================
   SECTION 6 — GETTING USERS TO THE APPLICATION
   =========================================================== */
section("06 / GETTING USERS IN");

slide(
  {
    title: "Our local application",
    badge: "LOCALHOST",
    note: "localhost only means anything on your own machine.",
  },
  statement("localhost:8501", "Works on your laptop — and nowhere else.", "coral")
);

slide(
  {
    title: "Production needs a path in",
    badge: "PRODUCTION",
    note: "Users arrive from the internet. Something has to route them.",
  },
  flow(["Internet", "AWS", "Application"], { last: true })
);

slide(
  {
    title: "The application port",
    subtitle: "Streamlit listens on 8501. The cloud has to route traffic to it.",
    badge: "PORTS",
    note: "Same port as always. What's new is everything in front of it.",
  },
  boxes(
    [box("Cloud networking", ["routes traffic"], "sky"), box("Container", [":8501"], "orange")],
    "to"
  )
);

slide(
  {
    title: "Network flow",
    badge: "CONCEPTUAL",
    note: "Keep it conceptual — load balancers and security groups are their own topic.",
  },
  flow(["User", "Public endpoint", "AWS networking", "ECS service", "Container :8501"], {
    last: true,
  })
);

slide(
  {
    title: "Container port ≠ public internet",
    subtitle: "Listening on a port doesn't make it reachable.",
    badge: "IMPORTANT",
    note: "A very common assumption. Public access is something you configure.",
  },
  split(
    panel("The container listens on", "ink", ["8501"], { mono: true }),
    panel("That does not mean", "coral", ["https://myapp.com"], {
      mono: true,
      note: "Public access has to be configured",
    })
  )
);

/* ===========================================================
   SECTION 7 — THE DATABASE DECISION
   =========================================================== */
section("07 / THE DATABASE DECISION");

slide(
  { title: "Now the big question", badge: "DECISION", note: "The most interesting architectural choice of the day." },
  statement("Where does MySQL live?", "We have two options.", "sky")
);

slide(
  {
    title: "Option A: MySQL in a container",
    subtitle: "Exactly what we did in Session 3.",
    badge: "OPTION A",
    note: "Familiar and fully under your control.",
  },
  flow(["ECS", "App + MySQL containers", "Persistent storage"], { vertical: true, tone: "sky" })
);

slide(
  {
    title: "Option B: managed MySQL",
    subtitle: "Amazon RDS for MySQL.",
    badge: "OPTION B",
    note: "The app stays in a container. The database becomes AWS's job.",
  },
  flow(["ECS", "App container", "Amazon RDS", "MySQL"], { last: true, tone: "mint" })
);

/* ===========================================================
   SECTION 8 — MYSQL CONTAINER + VOLUME
   =========================================================== */
section("08 / MYSQL CONTAINER + VOLUME");

slide(
  { title: "What we did locally", badge: "OPTION A", note: "Straight from Session 2 and 3." },
  flow(["MySQL container", "Named volume"], { vertical: true, last: true, tone: "mint" })
);

slide(
  {
    title: "Why the volume?",
    subtitle: "Containers are disposable.",
    badge: "WHY",
    note: "The container's lifetime and the data's lifetime must be separate.",
  },
  split(
    panel("The container", "ink", ["Container", "  ↓", "Deleted"], { mono: true }),
    panel("Without persistent storage", "coral", ["Data", "  ↓", "Gone"], { mono: true })
  )
);

slide(
  {
    title: "With a volume",
    subtitle: "Delete the container — the data stays.",
    badge: "PERSISTENCE",
    note: "The Session 2 demo, restated.",
  },
  flow(["Container", "Named volume", "Persistent data"], { last: true, tone: "mint" }),
  boxes([
    box("Container", ["deleted"], "coral"),
    box("Volume", ["kept"], "mint"),
    box("Data", ["kept"], "mint"),
  ])
);

slide(
  { title: "Create the volume", badge: "HANDS-ON", note: "Same command as Session 2." },
  term(cmd("docker volume create mysql-data"), out("mysql-data"))
);

slide(
  { title: "Run MySQL", badge: "HANDS-ON", note: "The -v flag is what ties the data to the volume." },
  code(
    "terminal",
    "bash",
    `docker run -d \\
  --name task-db \\
  -e MYSQL_ROOT_PASSWORD=example \\
  -e MYSQL_DATABASE=tasks \\
  -v mysql-data:/var/lib/mysql \\
  mysql:8`
  )
);

slide(
  { title: "Container + volume", badge: "DIAGRAM", note: "MySQL writes to a path; the path is backed by the volume." },
  flow(["MySQL container", "/var/lib/mysql", "mysql-data volume"], {
    vertical: true,
    last: true,
    tone: "mint",
  })
);

slide(
  {
    title: "The advantage: you control everything",
    badge: "PROS",
    note: "Full control is genuinely useful — especially while learning.",
  },
  bullets(["Docker", "MySQL", "Configuration", "Storage", "Backups", "Updates"], "mint", 2)
);

slide(
  {
    title: "The problem: you're responsible for everything",
    badge: "CONS",
    note: "Read this list slowly. Each one is a job someone has to do at 3am.",
  },
  bullets(
    [
      "Backups",
      "Recovery",
      "Storage",
      "Monitoring",
      "Database upgrades",
      "High availability",
      "Security",
      "Failure handling",
    ],
    "coral",
    2
  )
);

slide(
  {
    title: "A database in a container, in production?",
    badge: "HONEST ANSWER",
    note: "Don't make it dogma either way. It's a trade-off.",
  },
  split(panel("Possible?", "mint", ["Yes."]), panel("Always best?", "coral", ["Not necessarily."]))
);

/* ===========================================================
   SECTION 9 — AMAZON RDS
   =========================================================== */
section("09 / AMAZON RDS");

slide(
  {
    title: "What is RDS?",
    subtitle: "A managed relational database service.",
    badge: "AMAZON RDS",
    note: "Managed means AWS handles most of the operational list from two slides ago.",
  },
  flow(["Amazon RDS", "MySQL"], { last: true, tone: "sky" })
);

slide(
  {
    title: "RDS architecture",
    badge: "ARCHITECTURE",
    note: "The database sits on a private network — not exposed to the internet.",
  },
  flow(["App container on ECS", "Private network", "MySQL on RDS"], {
    vertical: true,
    last: true,
    tone: "sky",
  })
);

slide(
  {
    title: "App connection",
    subtitle: "The application gets the RDS endpoint instead.",
    badge: "CONFIG",
    note: "Only the host changes. This is why we moved config into env vars.",
  },
  split(
    panel("Locally", "ink", ['host="task-db"'], { mono: true }),
    panel("On AWS", "sky", ["DB_HOST=<RDS-ENDPOINT>"], { mono: true })
  )
);

slide(
  { title: "Example configuration", badge: "CONFIG", note: "In production the password comes from a secret store, not a file." },
  code(
    "environment",
    "text",
    `DB_HOST=mydb.xxxxx.region.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tasks
DB_USER=appuser
DB_PASSWORD=********`
  )
);

slide(
  {
    title: "The application doesn't care",
    subtitle: "Only the configuration changes.",
    badge: "PAYOFF",
    note: "This is the Session 3 environment-variable work paying off.",
  },
  code(
    "app.py",
    "python",
    `connection = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"]
)`
  )
);

/* ===========================================================
   SECTION 10 — CONTAINER MYSQL VS RDS
   =========================================================== */
section("10 / CONTAINER MYSQL VS RDS");

slide(
  {
    title: "Compare them",
    badge: "SIDE BY SIDE",
    note: "Neither column wins outright. The last row is usually what decides it.",
  },
  {
    kind: "table",
    columns: ["", "MySQL container", "Amazon RDS"],
    columnTones: ["ink", "sky", "mint"],
    rows: [
      ["Who runs MySQL", "You", "AWS"],
      ["Storage", "Volume", "Managed storage"],
      ["Backups", "You manage", "AWS features"],
      ["Updates", "You manage", "AWS-supported"],
      ["Scaling", "You manage", "Managed options"],
      ["For learning", "Excellent", "Excellent"],
      ["Production responsibility", "Higher", "Lower"],
    ],
  }
);

slide(
  {
    title: "For development",
    subtitle: "Simple. Portable. Cheap.",
    badge: "DEVELOPMENT",
    note: "Compose with a MySQL container is the right call on a laptop.",
  },
  flow(["Docker Compose", "App + MySQL", "Volume"], { vertical: true, tone: "mint" })
);

slide(
  {
    title: "Production option A",
    subtitle: "You manage more.",
    badge: "OPTION A",
    note: "Everything from the responsibility list lands on your team.",
  },
  flow(["ECS", "App + MySQL", "Persistent storage"], { vertical: true, tone: "sky" })
);

slide(
  {
    title: "Production option B",
    subtitle: "AWS manages more of the database infrastructure.",
    badge: "OPTION B",
    note: "The operational list mostly moves to AWS.",
  },
  flow(["ECS", "App", "RDS", "MySQL"], { last: true, tone: "mint" })
);

slide(
  { title: "The important lesson", badge: "LESSON", note: "Possibly the most useful sentence of the whole workshop." },
  statement("Containers don't mean everything must be a container.", undefined, "orange")
);

slide(
  {
    title: "Choose the right tool",
    badge: "PRINCIPLE",
    note: "Containers for the app you change often; a managed service for the data you can't lose.",
  },
  split(
    panel("Application", "orange", ["Runs in a container"]),
    panel("Database", "mint", ["Runs on a managed service"])
  ),
  callout("This is often the better production architecture.", "yellow")
);

slide(
  {
    title: "But know both",
    badge: "BOTH HAVE A PLACE",
    note: "Knowing when to use each is the actual skill.",
  },
  split(
    panel("Containerised MySQL", "sky", ["Development", "Testing", "Learning", "Controlled environments"]),
    panel("Amazon RDS", "mint", ["When you want managed database infrastructure"])
  )
);

/* ===========================================================
   SECTION 11 — FINAL PRODUCTION ARCHITECTURE
   =========================================================== */
section("11 / PRODUCTION ARCHITECTURE");

slide(
  { title: "Development architecture", badge: "BEFORE", note: "Where we started this morning." },
  flow(["Browser", "Streamlit container", "Docker network", "MySQL container", "Named volume"], {
    last: true,
  })
);

slide(
  { title: "Production architecture", badge: "AFTER", note: "Same application, different home." },
  flow(["Users", "AWS network", "ECS / Fargate", "App container", "Amazon RDS", "MySQL"], {
    last: true,
    tone: "sky",
  })
);

slide(
  {
    title: "Same application",
    subtitle: "The code stays largely the same.",
    badge: "THE POINT",
    note: "One environment variable is the difference between the two architectures.",
  },
  split(
    panel("Development", "mint", ["DB_HOST=task-db"], { mono: true }),
    panel("Production", "sky", ["DB_HOST=<RDS-ENDPOINT>"], { mono: true })
  )
);

/* ===========================================================
   SECTION 12 — MANUAL DEPLOYMENT
   =========================================================== */
section("12 / MANUAL DEPLOYMENT");

slide(
  { title: "Imagine a developer changes one line", badge: "SCENARIO", note: "A trivial change. Watch how much work it creates." },
  code("app.py", "python", 'st.title("Task Manager v2")')
);

slide(
  { title: "The manual process", badge: "BY HAND", note: "Six steps, every change, done by a person." },
  flow(["Change code", "Build image", "Tag image", "Push to ECR", "Update ECS", "Deploy"], {
    tone: "coral",
  })
);

slide(
  { title: "Another change", subtitle: "And again…", badge: "AGAIN", note: "Build, push, deploy." },
  flow(["Build", "Push", "Deploy"], { tone: "coral" })
);

slide(
  { title: "A bug fix", subtitle: "And again…", badge: "AND AGAIN", note: "Same three steps. By now someone has made a mistake." },
  flow(["Build", "Push", "Deploy"], { tone: "coral" })
);

slide(
  {
    title: "Humans are bad CI/CD systems",
    badge: "THE REAL PROBLEM",
    note: "Everyone has heard at least one of these in a real team.",
  },
  bullets(
    [
      "“Did you push the latest image?”",
      "“Did you update ECS?”",
      "“Which tag?”",
      "“Was that production?”",
    ],
    "coral",
    1
  )
);

/* ===========================================================
   SECTION 13 — CI/CD
   =========================================================== */
section("13 / CI/CD");

slide(
  { title: "We need automation", badge: "THE FIX", note: "Hand the repetitive, error-prone part to a machine." },
  statement("CI/CD", "Let a machine do the repetitive part.", "orange")
);

slide(
  {
    title: "Continuous integration",
    subtitle: "Developers push often. Automation checks every change.",
    badge: "CI",
    note: "CI answers: is this change safe to merge?",
  },
  flow(["Code", "Build", "Test"], { last: true, tone: "sky" })
);

slide(
  {
    title: "Continuous delivery / deployment",
    subtitle: "After validation, ship it.",
    badge: "CD",
    note: "Delivery stops at ready-to-deploy; deployment goes all the way to production.",
  },
  flow(["Build", "Package", "Publish", "Deploy"], { last: true, tone: "mint" })
);

slide(
  { title: "Our pipeline", badge: "THE PLAN", note: "One git push kicks off all of it." },
  flow(["Developer", "git push", "GitHub", "GitHub Actions", "Test, build, push, deploy", "AWS"], {
    last: true,
  })
);

/* ===========================================================
   SECTION 14 — GITHUB ACTIONS
   =========================================================== */
section("14 / GITHUB ACTIONS");

slide(
  {
    title: "GitHub Actions",
    subtitle: "Automate workflows directly from your repository.",
    badge: "TOOL",
    note: "The pipeline lives in the repo, next to the code it deploys.",
  },
  flow(["Your repository", "Workflow file", "GitHub-hosted runner"], { last: true })
);

slide(
  { title: "The workflow file", badge: "WHERE IT LIVES", note: "GitHub looks for workflows in exactly this folder." },
  code("repository", "text", ".github/\n└── workflows/\n    └── deploy.yml")
);

slide(
  { title: "Trigger", badge: "on:", note: "Only main deploys. Feature branches don't." },
  annotated(
    "on:\n  push:\n    branches:\n      - main",
    [
      { label: "on", text: "When the workflow runs." },
      { label: "Here", text: "Every push to main starts it." },
    ],
    { filename: "deploy.yml", language: "yaml" }
  )
);

slide(
  { title: "Check out the code", badge: "STEP", note: "The runner starts empty. This gives it our repository." },
  annotated(
    "- uses: actions/checkout@v4",
    [{ label: "checkout", text: "Gives the runner a copy of our source code." }],
    { filename: "deploy.yml", language: "yaml" }
  )
);

slide(
  { title: "Run the tests", badge: "STEP", note: "If tests fail, nothing after this runs. That's the safety net." },
  annotated(
    "- name: Run tests\n  run: pytest",
    [{ label: "run", text: "A failing test stops the pipeline before anything ships." }],
    { filename: "deploy.yml", language: "yaml" }
  )
);

slide(
  { title: "Build the image", badge: "STEP", note: "The same docker build we've typed all workshop, now run by the pipeline." },
  annotated(
    "- name: Build image\n  run: docker build -t task-manager .",
    [{ label: "run", text: "The same docker build command — run by the pipeline, not a person." }],
    { filename: "deploy.yml", language: "yaml" }
  )
);

slide(
  {
    title: "Authenticate to ECR",
    subtitle: "The runner needs permission to push.",
    badge: "AUTH",
    note: "Prefer short-lived credentials via OIDC over long-lived access keys stored as secrets.",
  },
  flow(["GitHub Actions", "AWS authentication", "ECR"], { last: true, tone: "sky" })
);

slide(
  { title: "Push the image", badge: "STEP", note: "Same push, different pusher." },
  flow(["Docker image", "GitHub Actions", "Amazon ECR"], { last: true })
);

slide(
  { title: "Deploy", badge: "STEP", note: "ECS starts new tasks on the new image and retires the old ones." },
  flow(["New image", "ECS", "New task", "Application updated"], { last: true, tone: "mint" })
);

slide(
  { title: "The complete pipeline", badge: "END TO END", note: "Everything since slide 81, now automatic." },
  flow(
    ["git push", "GitHub", "GitHub Actions", "Test + build", "ECR", "ECS / Fargate", "App container", "RDS"],
    { last: true }
  )
);

/* ===========================================================
   SECTION 15 — WHAT HAPPENS WHEN WE PUSH?
   =========================================================== */
section("15 / WHAT HAPPENS ON PUSH");

slide(
  { title: "A developer pushes code", badge: "TRIGGER", note: "Three ordinary git commands. That's the only manual part left." },
  term(cmd("git add ."), cmd('git commit -m "Update task manager"'), cmd("git push origin main"))
);

slide(
  { title: "GitHub detects the push", badge: "1", note: "The trigger from the workflow file fires." },
  flow(["push to main", "workflow starts"], { last: true })
);

slide(
  { title: "CI starts", badge: "2", note: "Check out, install, test." },
  flow(["Checkout", "Install dependencies", "Run tests"], { last: true, tone: "sky" })
);

slide(
  { title: "Docker build", badge: "3", note: "Only reached if the tests passed." },
  flow(["Dockerfile", "docker build", "Image"], { last: true })
);

slide(
  { title: "The image is published", badge: "4", note: "Now it's somewhere AWS can pull it from." },
  flow(["Image", "Amazon ECR"], { last: true, tone: "sky" })
);

slide(
  { title: "Deployment", badge: "5", note: "ECS rolls the new version out." },
  flow(["ECS", "New task", "New container", "New version"], { last: true, tone: "mint" })
);

slide(
  {
    title: "Users get the update",
    subtitle: "Nobody logged into a server.",
    badge: "6",
    note: "That's the whole promise of CI/CD, delivered.",
  },
  flow(["User", "AWS", "ECS", "New version"], { last: true })
);

/* ===========================================================
   SECTION 16 — FINAL HANDS-ON PROJECT
   =========================================================== */
section("16 / FINAL HANDS-ON PROJECT");

slide(
  { title: "Final challenge", badge: "YOUR TURN", note: "The capstone. Everything from four sessions in one exercise." },
  statement("Take the Task Manager to production", undefined, "orange")
);

slide(
  {
    title: "Starting point",
    subtitle: "We already have all of this.",
    badge: "WHAT WE HAVE",
    note: "Nothing today starts from zero.",
  },
  boxes([
    box("Streamlit", [], "orange"),
    box("MySQL", [], "sky"),
    box("Docker", [], "ink"),
    box("Compose", [], "yellow"),
    box("Network", [], "sky"),
    box("Volume", [], "mint"),
  ])
);

slide(
  { title: "Step 1: verify the application", badge: "STEP 1", note: "Make sure it works locally before blaming AWS for anything." },
  term(cmd("docker compose up"))
);

slide(
  { title: "Step 2: build the production image", badge: "STEP 2", note: "A versioned tag, not latest." },
  code("terminal", "bash", "docker build \\\n  -t task-manager:1.0 .")
);

slide(
  {
    title: "Step 3: test the image locally",
    badge: "STEP 3",
    note: "Without DB environment variables the UI loads but database calls fail — that's expected here.",
  },
  code("terminal", "bash", "docker run \\\n  -p 8501:8501 \\\n  task-manager:1.0")
);

slide(
  { title: "Step 4: create an ECR repository", badge: "STEP 4", note: "Console or CLI — either is fine." },
  code("repository name", "text", "task-manager")
);

slide(
  { title: "Step 5: tag the image", badge: "STEP 5", note: "Registry prefix plus repository plus tag." },
  code("terminal", "bash", "docker tag task-manager:1.0 \\\n  <ECR-URL>/task-manager:1.0")
);

slide(
  { title: "Step 6: push the image", badge: "STEP 6", note: "Log in to ECR first, or this fails with an auth error." },
  code("terminal", "bash", "docker push \\\n  <ECR-URL>/task-manager:1.0")
);

slide(
  { title: "Step 7: create ECS resources", badge: "STEP 7", note: "Cluster, task definition, service — in that order." },
  flow(["ECS cluster", "Task definition", "Service", "Fargate"], { last: true })
);

slide(
  {
    title: "Step 8: configure the application",
    subtitle: "Set these in the task definition's environment.",
    badge: "STEP 8",
    note: "DB_PASSWORD should come from Secrets Manager, not plain text.",
  },
  code("environment", "text", "DB_HOST\nDB_PORT\nDB_NAME\nDB_USER\nDB_PASSWORD")
);

slide(
  {
    title: "Step 9A: database option A",
    subtitle: "Run MySQL as a container.",
    badge: "STEP 9A",
    note: "The Session 3 approach, moved to ECS.",
  },
  flow(["ECS", "App + MySQL", "Persistent storage"], { vertical: true, tone: "sky" })
);

slide(
  {
    title: "Step 9B: database option B",
    subtitle: "Use Amazon RDS.",
    badge: "STEP 9B",
    note: "The managed approach.",
  },
  flow(["ECS", "App", "RDS", "MySQL"], { last: true, tone: "mint" })
);

slide(
  {
    title: "Compare during the demo",
    subtitle: "Ask the room.",
    badge: "DISCUSS",
    note: "Genuinely wait for answers. The disagreement is the useful part.",
  },
  bullets(
    [
      "Which one requires more database management?",
      "Which one is easier to start locally?",
      "Which one would you choose for a production application?",
    ],
    "yellow",
    1
  )
);

slide(
  {
    title: "Step 10: connect the application",
    badge: "STEP 10",
    note: "Only the host changes between the two.",
  },
  split(
    panel("Development", "mint", ["task-db:3306"], { mono: true }),
    panel("Production", "sky", ["RDS-ENDPOINT:3306"], { mono: true })
  )
);

slide(
  { title: "Step 11: verify", badge: "STEP 11", note: "Work through it in order." },
  {
    kind: "checklist",
    items: ["Open the application", "Create a task", "Refresh the page", "Confirm the task still exists"],
  }
);

slide(
  { title: "Step 12: test persistence", badge: "STEP 12", note: "Restart the app. The data must still be there." },
  split(
    panel("Containerised MySQL", "sky", ["Restart app", "  ↓", "Data remains"], { mono: true }),
    panel("Amazon RDS", "mint", ["Restart app", "  ↓", "Database remains"], { mono: true })
  )
);

slide(
  { title: "Step 13: GitHub Actions", badge: "STEP 13", note: "Now automate everything from steps 2 to 7." },
  code("repository", "text", ".github/workflows/deploy.yml")
);

slide(
  { title: "Step 14: push the code", badge: "STEP 14", note: "This push should trigger the pipeline." },
  term(cmd("git add ."), cmd('git commit -m "Deploy task manager"'), cmd("git push origin main"))
);

slide(
  { title: "Step 15: watch the pipeline", badge: "STEP 15", note: "Open the Actions tab and follow it live." },
  flow(["GitHub", "Actions", "Test", "Build", "ECR", "ECS"], { last: true })
);

slide(
  { title: "Step 16: make another change", subtitle: "Something visible.", badge: "STEP 16", note: "A visible change makes the deploy obvious." },
  code("app.py", "python", 'st.title("Task Manager 🚀")')
);

slide(
  { title: "Push again", badge: "STEP 17", note: "No docker commands this time. Just git." },
  term(cmd("git add ."), cmd('git commit -m "Update UI"'), cmd("git push"))
);

slide(
  { title: "Watch it deploy", badge: "PAYOFF", note: "Refresh the production URL when it finishes. That's the moment." },
  flow(["Code", "CI/CD", "Docker", "ECR", "ECS", "Production"], { last: true })
);

/* ===========================================================
   SECTION 17 — THE BIG COMPARISON
   =========================================================== */
section("17 / THE BIG COMPARISON");

slide(
  { title: "Session 2", subtitle: "We learned to package.", badge: "LOOKING BACK", note: "One chain per session." },
  flow(["Dockerfile", "Image", "Container"], { last: true, tone: "sky" })
);

slide(
  { title: "Session 3", subtitle: "We learned to connect.", badge: "LOOKING BACK", note: "From one container to an application." },
  flow(["Container", "Network", "Multiple containers", "Compose"], { last: true, tone: "yellow" })
);

slide(
  { title: "Session 4", subtitle: "We learned to ship.", badge: "LOOKING BACK", note: "From a laptop to production." },
  flow(["Container", "Image registry", "Cloud", "Production database", "CI/CD"], { last: true })
);

slide(
  { title: "Docker's role: package the application", badge: "ROLES", note: "One job per tool — that's the clarity we want." },
  flow(["Code", "+ Dependencies", "+ Runtime", "Container image"], { last: true })
);

slide(
  { title: "ECR's role: store the image", badge: "ROLES", note: "Storage, not compute." },
  flow(["Image", "ECR"], { last: true, tone: "sky" })
);

slide(
  { title: "ECS's role: run the application", badge: "ROLES", note: "Pulls from ECR, keeps it running." },
  flow(["ECR", "ECS", "Container"], { last: true, tone: "orange" })
);

slide(
  { title: "RDS's role: run the database", badge: "ROLES", note: "The data lives outside the container entirely." },
  flow(["Application", "RDS", "MySQL"], { last: true, tone: "mint" })
);

slide(
  { title: "GitHub Actions' role: automate the journey", badge: "ROLES", note: "It connects all the other tools." },
  flow(["Code", "Test", "Build", "Push", "Deploy"], { last: true })
);

/* ===========================================================
   SECTION 18 — DEVELOPMENT VS PRODUCTION, REVISITED
   =========================================================== */
section("18 / DEV VS PROD, REVISITED");

slide(
  { title: "Side by side", badge: "COMPARE", note: "Two architectures, one codebase." },
  split(
    panel("Development", "mint", ["Laptop", "├── App container", "└── MySQL container", "      └── Volume"], {
      mono: true,
    }),
    panel("Production", "sky", ["AWS", "├── ECS / Fargate", "│     └── App", "└── RDS", "      └── MySQL"], {
      mono: true,
    })
  )
);

slide(
  {
    title: "Why change the architecture?",
    subtitle: "Production has different requirements.",
    badge: "WHY",
    note: "Different goals justify different shapes.",
  },
  split(
    panel("Development", "mint", ["Optimised for convenience"]),
    panel("Production", "sky", ["Optimised for reliability and operations"])
  )
);

slide(
  { title: "One more important idea", badge: "PRINCIPLE", note: "You're allowed to change the architecture as needs change." },
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
  { title: "We didn't use Kubernetes", badge: "ON PURPOSE", note: "Someone always asks. Answer it head-on." },
  statement("And that's intentional.", undefined, "sky")
);

slide(
  {
    title: "Why not?",
    badge: "SCOPE",
    note: "Kubernetes is a lot of new concepts at once. Docker first makes it approachable.",
  },
  split(
    panel("Our goal", "mint", ["Learn Docker", "Deploy containers", "Understand the cloud", "Automate deployment"]),
    panel("Not our goal", "coral", ["Learn 47 Kubernetes objects"])
  )
);

slide(
  { title: "Where Kubernetes fits", subtitle: "At larger scale.", badge: "LATER", note: "Many services across many machines — that's when it earns its complexity." },
  flow(["Docker images", "Kubernetes", "Many containers", "Many services", "Many machines"], {
    last: true,
  })
);

slide(
  { title: "Docker vs Kubernetes", badge: "DIFFERENT JOBS", note: "Not competitors. One builds on the other." },
  split(
    panel("Docker", "sky", ["Container technology"]),
    panel("Kubernetes", "orange", ["Container orchestration"])
  )
);

slide(
  { title: "The important point", badge: "ADVICE", note: "Session 1 showed Kubernetes as the destination. Now they know the road." },
  statement("Learn Docker first.", "Then orchestration makes much more sense.", "orange")
);

/* ===========================================================
   SECTION 20 — DEBUGGING PRODUCTION
   =========================================================== */
section("20 / DEBUGGING PRODUCTION");

slide(
  {
    title: "Something will break",
    badge: "REALITY",
    joke: "Definitely when you are presenting.",
    note: "Get the laugh, then make it serious: have a process.",
  },
  statement("Eventually.", "Probably during the demo.", "coral")
);

slide(
  {
    title: "The debugging mindset",
    subtitle: "Don't randomly change things.",
    badge: "MINDSET",
    note: "Locate before you fix. The next five slides are the layers to check.",
  },
  callout("Where does the failure occur?", "sky", "Ask")
);

slide(
  { title: "Layer 1: application", subtitle: "Does the application work?", badge: "LAYER 1", note: "Start with what the app itself says." },
  bullets(["Logs", "Exceptions", "Configuration"], "sky", 1)
);

slide(
  { title: "Layer 2: container", subtitle: "Is the container running?", badge: "LAYER 2", note: "Same question locally and on ECS — different tools." },
  split(
    panel("Locally", "ink", ["docker ps"], { mono: true }),
    panel("On ECS", "sky", ["Task status", "Container status", "Logs"])
  )
);

slide(
  { title: "Layer 3: network", subtitle: "Can the application reach the database?", badge: "LAYER 3", note: "The localhost trap from Session 3 lives here." },
  flow(["App", "Network", "Database"], { tone: "sky" })
);

slide(
  { title: "Layer 4: database", subtitle: "Is MySQL available?", badge: "LAYER 4", note: "Check each value — one typo is enough." },
  bullets(["Host", "Port", "Credentials", "Database"], "sky", 2)
);

slide(
  { title: "Layer 5: deployment", subtitle: "Is the right image actually running?", badge: "LAYER 5", note: "Surprisingly often, the fix is deployed — just not running." },
  bullets(["Image tag", "Task definition", "Running task"], "sky", 1)
);

slide(
  { title: "The debugging flow", badge: "PROCESS", note: "Outside in, one layer at a time." },
  flow(["User reports a problem", "Application", "Container", "Network", "Database", "Deployment"])
);

/* ===========================================================
   SECTION 21 — FINAL ARCHITECTURE
   =========================================================== */
section("21 / FINAL ARCHITECTURE");

slide(
  { title: "The architecture we built", badge: "RUNTIME", note: "Where requests go." },
  flow(["Users", "AWS", "ECS / Fargate", "App container", "Amazon RDS", "MySQL"], { last: true })
);

slide(
  { title: "Where the image comes from", badge: "DELIVERY", note: "Where code goes." },
  flow(["Developer", "GitHub", "GitHub Actions", "Docker build", "ECR", "ECS / Fargate"], {
    last: true,
    tone: "sky",
  })
);

slide(
  { title: "The complete pipeline", badge: "EVERYTHING", note: "Both halves joined up." },
  flow(
    [
      "GitHub",
      "git push",
      "GitHub Actions",
      "Test, build, check",
      "ECR",
      "ECS / Fargate",
      "App container",
      "Amazon RDS",
      "MySQL",
    ],
    { last: true }
  )
);

/* ===========================================================
   SECTION 22 — THE COMPLETE DOCKER JOURNEY
   One sentence per slide, deliberately — the rhythm is the point.
   =========================================================== */
section("22 / THE COMPLETE JOURNEY");

slide(
  { title: "Where we started", badge: "SESSION 1", note: "Slow down for this sequence. Click through with a beat on each." },
  statement("“It works on my machine.”", undefined, "coral")
);

slide(
  { title: "Then", badge: "SESSION 2", note: "Containers." },
  statement("“It works inside my container.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "SESSION 3", note: "Networking." },
  statement("“My containers can communicate.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "VOLUMES", note: "Persistence." },
  statement("“My data survives.”", undefined, "mint")
);

slide(
  { title: "Then", badge: "REGISTRY", note: "Distribution." },
  statement("“My image is in a registry.”", undefined, "sky")
);

slide(
  { title: "Then", badge: "AWS", note: "The cloud." },
  statement("“My container runs in AWS.”", undefined, "orange")
);

slide(
  { title: "Then", badge: "RDS", note: "Managed data." },
  statement("“My database is running in production.”", undefined, "mint")
);

slide(
  { title: "Finally", badge: "CI/CD", note: "Land this one. It's the whole workshop in a sentence." },
  statement("“I push code… and the system deploys it.”", undefined, "orange")
);

/* ===========================================================
   SECTION 23 — FINAL RECAP
   =========================================================== */
section("23 / FINAL RECAP");

slide(
  { title: "Docker mental model", badge: "RECAP", note: "The foundation from Session 2." },
  flow(["Dockerfile", "Image", "Container"], { last: true })
);

slide(
  { title: "Development mental model", badge: "RECAP", note: "Session 3's loop." },
  flow(["Code", "Bind mount", "Container", "Network", "Database"], { last: true, tone: "mint" })
);

slide(
  { title: "Production mental model", badge: "RECAP", note: "Today's delivery path." },
  flow(["Code", "Docker build", "Image", "ECR", "ECS / Fargate", "Application"], {
    last: true,
    tone: "sky",
  })
);

slide(
  { title: "Database mental model", badge: "RECAP", note: "Container and volume locally; managed service in production." },
  split(
    panel("Development", "mint", ["MySQL container", "  ↓", "Named volume"], { mono: true }),
    panel("Production", "sky", ["Application", "  ↓", "RDS", "  ↓", "MySQL"], { mono: true })
  )
);

slide(
  { title: "CI/CD mental model", badge: "RECAP", note: "One push, four automated steps." },
  flow(["git push", "Test", "Build", "Push", "Deploy"], { last: true })
);

slide(
  { title: "The big picture", badge: "EVERYTHING", note: "The application path, and the database beside it." },
  flow(
    ["Code", "Git", "CI/CD", "Docker build", "Image", "Amazon ECR", "ECS / Fargate", "Application", "Users"],
    { last: true }
  ),
  flow(["Database", "Amazon RDS", "MySQL"], { last: true, tone: "mint" })
);

/* ===========================================================
   SECTION 24 — WHAT YOU KNOW NOW
   =========================================================== */
section("24 / WHAT YOU KNOW NOW");

slide(
  { title: "You can explain Docker", badge: "YOU CAN", note: "Ask a volunteer to answer one of these out loud." },
  bullets(["What is an image?", "What is a container?", "What is a Dockerfile?"], "sky", 1)
);

slide(
  { title: "You can run containers", badge: "YOU CAN", note: "Muscle memory by now." },
  term(cmd("docker run"), cmd("docker ps"), cmd("docker stop"), cmd("docker rm"))
);

slide(
  { title: "You can build images", badge: "YOU CAN", note: "From Dockerfile to image, on demand." },
  term(cmd("docker build -t task-manager:1.0 ."))
);

slide(
  { title: "You understand storage", badge: "YOU CAN", note: "Containers are disposable; volumes aren't." },
  flow(["Container", "Volume", "Persistent data"], { last: true, tone: "mint" })
);

slide(
  { title: "You understand networking", badge: "YOU CAN", note: "Service names, not localhost." },
  flow(["Container", "Docker network", "Container"], { tone: "sky" })
);

slide(
  { title: "You understand Compose", badge: "YOU CAN", note: "One file, one application." },
  flow(["compose.yaml", "Multiple services", "One application"], { last: true, tone: "yellow" })
);

slide(
  { title: "You understand registries", badge: "YOU CAN", note: "How images travel." },
  flow(["Image", "ECR", "Cloud"], { last: true, tone: "sky" })
);

slide(
  { title: "You understand cloud containers", badge: "YOU CAN", note: "How they run without servers to manage." },
  flow(["ECS", "Fargate", "Running containers"], { last: true, tone: "orange" })
);

slide(
  { title: "You understand database choices", badge: "YOU CAN", note: "And that the choice is a trade-off, not a rule." },
  split(
    panel("MySQL container + volume", "sky", ["You run the database"]),
    panel("Amazon RDS", "mint", ["AWS runs the database"])
  )
);

slide(
  { title: "You understand CI/CD", badge: "YOU CAN", note: "From a push to production, automatically." },
  flow(["git push", "Automation", "Production"], { last: true })
);

/* ===========================================================
   SECTION 25 — FINAL CHALLENGE
   =========================================================== */
section("25 / FINAL CHALLENGE");

slide(
  { title: "Your final challenge", badge: "TAKE-HOME", note: "Four verbs, in order." },
  flow(["Build it", "Containerise it", "Deploy it", "Automate it"], { last: true })
);

slide(
  { title: "Challenge architecture", badge: "TARGET", note: "What a finished submission looks like." },
  flow(["GitHub", "GitHub Actions", "Docker", "Amazon ECR", "ECS / Fargate", "Task Manager", "Amazon RDS"], {
    last: true,
  })
);

slide(
  {
    title: "Bonus challenge",
    subtitle: "Build the other database architecture too, then compare.",
    badge: "BONUS",
    note: "Doing both is the best way to feel the trade-off.",
  },
  split(
    panel("Option A", "sky", ["ECS", "├── App", "└── MySQL container", "      └── Persistent storage"], {
      mono: true,
    }),
    panel("Option B", "mint", ["ECS", "└── App", "      └── RDS"], { mono: true })
  )
);

slide(
  { title: "Discussion", badge: "ASK THE ROOM", note: "Let a few people argue each side." },
  callout(
    "If you were building a real application tomorrow, which database architecture would you choose?",
    "sky",
    "Ask"
  )
);

slide(
  { title: "Final question", subtitle: "What happens when you run this?", badge: "QUIZ", note: "Let the room answer before the next slide." },
  term(cmd("git push"))
);

slide(
  { title: "The answer", badge: "ANSWER", note: "If they got most of this, the workshop worked." },
  flow(["GitHub", "GitHub Actions", "Tests", "Docker build", "ECR", "ECS", "Application", "Users"], {
    last: true,
  })
);

/* ===========================================================
   SECTION 26 — FINAL SLIDE
   =========================================================== */
section("26 / FINAL SLIDE");

slide(
  { title: "You started here", badge: "SESSION 1", note: "Callback to the very first slide of the workshop." },
  statement("“It works on my machine.”", undefined, "coral")
);

slide(
  { title: "You end here", badge: "SESSION 4", note: "Every box is something they now know how to do." },
  flow(["Code", "Docker", "Registry", "Cloud", "Database", "CI/CD", "Production"], { last: true })
);

slide(
  {
    title: "You didn't just learn Docker",
    subtitle: "You learned how a containerised application moves from a laptop to production.",
    badge: "FINAL MESSAGE",
    note: "Say this one slowly.",
  },
  flow(["Developer laptop", "Docker", "Cloud", "Production"], { last: true })
);

slide(
  {
    title: "That's the DevOps mindset",
    badge: "END OF THE WORKSHOP",
    note: "Thank them. That's the series.",
  },
  flow(["Build", "Package", "Run", "Deploy", "Automate"], { last: true })
);

/* ===========================================================
   APPENDIX — from the reference's optional demo cheat sheet and
   final takeaway, kept after the closing slide for the Q&A.
   =========================================================== */
section("APPENDIX");

slide(
  { title: "Demo cheat sheet", badge: "REFERENCE", note: "Keep this up during the hands-on block." },
  {
    kind: "cheatsheet",
    groups: [
      { title: "Local", commands: ["docker compose up"] },
      {
        title: "Build and run",
        commands: ["docker build -t task-manager:1.0 .", "docker run -p 8501:8501 task-manager:1.0"],
      },
      {
        title: "Ship",
        commands: [
          "docker tag task-manager:1.0 \\\n  <ECR-URL>/task-manager:1.0",
          "docker push \\\n  <ECR-URL>/task-manager:1.0",
        ],
      },
      {
        title: "Git",
        commands: ["git add .", 'git commit -m "Deploy application"', "git push origin main"],
      },
    ],
  }
);

slide(
  { title: "Remember", subtitle: "The workshop in four lines.", badge: "TAKEAWAY", note: "The last thing on screen." },
  bullets(
    [
      "Build once.",
      "Package consistently.",
      "Deploy automatically.",
      "Choose the right infrastructure for the job.",
    ],
    "orange",
    1
  )
);

export const SESSION4_SLIDES: SlideData[] = deck;
