import type { SlideData } from "./slides";

/* ===========================================================
   SESSION 3 — DOCKER DEVELOPMENT WORKFLOW
   Bind Mounts, Networking & Compose. 115 slides.

   Note the tonal shift the reference asks for: Sessions 1 and 2 ran
   on the Lehar Loom / Sam story, but this one drops the narrative and
   stays practical throughout — "let's build something real". The
   Task Manager is the through-line instead of a cast.
   =========================================================== */

const CH = {
  intro: "01 / SESSION INTRODUCTION",
  bind: "02 / BIND MOUNTS",
  devprod: "03 / DEV VS PRODUCTION",
  multi: "04 / MULTIPLE CONTAINERS",
  net: "05 / DOCKER NETWORKING",
  taskapp: "06 / TASK MANAGER APP",
  env: "07 / ENVIRONMENT VARIABLES",
  manual: "08 / THE MANUAL PROBLEM",
  compose: "09 / DOCKER COMPOSE",
  running: "10 / RUNNING COMPOSE",
  workflow: "11 / DEVELOPMENT WORKFLOW",
  debug: "12 / DEBUGGING",
  handson: "13 / HANDS-ON PROJECT",
  model: "14 / FINAL MENTAL MODEL",
  learned: "15 / WHAT WE LEARNED",
  next: "16 / NEXT SESSION",
} as const;

export const SESSION3_SLIDES: SlideData[] = [
  /* ========== SECTION 1 — INTRODUCTION ========== */
  {
    id: 1,
    slideNumber: 1,
    chapter: CH.intro,
    title: "Docker Development Workflow",
    subtitle: "Session 3 — from one container to a real application.",
    badge: "SESSION 3",
    speakerNote:
      "Session 2 packaged one app. Today we make several containers work together, and make developing with them bearable.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Bind mounts",
          "Docker networking",
          "Multiple containers",
          "Docker Compose",
          "Environment variables",
          "Debugging",
        ],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    id: 2,
    slideNumber: 2,
    chapter: CH.intro,
    title: "Where we are",
    subtitle: "We can already package and run an application.",
    badge: "RECAP",
    speakerNote: "One quick look back at Session 2's chain, then straight into the problem.",
    blocks: [
      {
        kind: "flow",
        steps: ["Dockerfile", "Image", "Container", "Running application"],
        orientation: "horizontal",
      },
    ],
  },
  {
    id: 3,
    slideNumber: 3,
    chapter: CH.intro,
    title: "But there's a problem",
    subtitle: "You change one line of code. Then what?",
    badge: "THE PAIN",
    speakerNote:
      "This is the exact question Session 2 ended on. Now we answer it.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker build -t task-app ." },
          { cmd: "docker stop task-app" },
          { cmd: "docker rm task-app" },
          { cmd: "docker run -p 8501:8501 task-app" },
          { comment: "…and again. And again." },
        ],
      },
    ],
  },
  {
    id: 4,
    slideNumber: 4,
    chapter: CH.intro,
    title: "Let's actually try it",
    subtitle: "How does the container see this change?",
    badge: "DEMO",
    speakerNote:
      "Make the edit live. Let them watch nothing happen in the browser.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Before",
          tone: "ink",
          mono: true,
          lines: ['st.title("Hello User")'],
        },
        right: {
          title: "After",
          tone: "sky",
          mono: true,
          lines: ['st.title("My Task Manager")'],
        },
      },
    ],
  },
  {
    id: 5,
    slideNumber: 5,
    chapter: CH.intro,
    title: "The slow workflow",
    subtitle: "Seven steps to see a one-line change.",
    badge: "THE COST",
    speakerNote:
      "Count them out loud. The absurdity is the argument for bind mounts.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Change code",
          "Build image",
          "Stop container",
          "Remove container",
          "Create container",
          "Run",
          "Test",
        ],
        orientation: "horizontal",
        tone: "coral",
      },
    ],
  },
  {
    id: 6,
    slideNumber: 6,
    chapter: CH.intro,
    title: "This is not development",
    subtitle: "We need a better workflow.",
    badge: "THE ASK",
    joke: "Rebuilding the entire universe because you changed a button label.",
    speakerNote: "Land the joke, then pivot straight into bind mounts.",
    blocks: [
      {
        kind: "statement",
        text: "We need a better workflow.",
        tone: "coral",
      },
    ],
  },

  /* ========== SECTION 2 — BIND MOUNTS ========== */
  {
    id: 7,
    slideNumber: 7,
    chapter: CH.bind,
    title: "Enter bind mounts",
    subtitle:
      "A directory on your computer becomes visible inside the container.",
    badge: "NEW CONCEPT",
    speakerNote: "One sentence definition. Keep it that simple for now.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Host machine", lines: ["your project folder"], tone: "sky" },
          { title: "Container", lines: ["/app"], tone: "orange" },
        ],
        connector: "bind mount",
      },
    ],
  },
  {
    id: 8,
    slideNumber: 8,
    chapter: CH.bind,
    title: "The idea, before and after",
    badge: "COMPARE",
    speakerNote:
      "Without: code travels via a build. With: code is just there, live.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Without a bind mount",
          tone: "coral",
          mono: true,
          lines: ["Host", "  docker build", "Image", "Container"],
        },
        right: {
          title: "With a bind mount",
          tone: "mint",
          mono: true,
          lines: ["Host code", "  bind mount", "Container"],
        },
      },
    ],
  },
  {
    id: 9,
    slideNumber: 9,
    chapter: CH.bind,
    title: "The same files, both sides",
    badge: "EXAMPLE",
    speakerNote: "Not a copy — the same files, seen from two places.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "On your machine",
          tone: "sky",
          mono: true,
          lines: ["project/", "├── app.py", "└── requirements.txt"],
        },
        right: {
          title: "Inside the container",
          tone: "orange",
          mono: true,
          lines: ["/app/", "├── app.py", "└── requirements.txt"],
        },
      },
    ],
  },
  {
    id: 10,
    slideNumber: 10,
    chapter: CH.bind,
    title: "The -v option",
    badge: "SYNTAX",
    speakerNote:
      "Same shape as -p and the named volume from Session 2: host on the left, container on the right.",
    blocks: [
      {
        kind: "annotated",
        code: '-v "$(pwd):/app"',
        notes: [
          { label: "left", text: "A path on your machine — here, the current directory." },
          { label: "right", text: "Where it appears inside the container." },
          {
            label: "Shape",
            text: "HOST_PATH:CONTAINER_PATH — the same left-to-right rule as -p.",
          },
        ],
      },
    ],
  },
  {
    id: 11,
    slideNumber: 11,
    chapter: CH.bind,
    title: "On Windows",
    subtitle: "Same idea, different way of saying 'current directory'.",
    badge: "PLATFORM",
    speakerNote:
      "Worth pausing — a good share of the room will be on PowerShell.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "macOS / Linux",
          tone: "ink",
          mono: true,
          lines: ['-v "$(pwd):/app"'],
        },
        right: {
          title: "PowerShell",
          tone: "sky",
          mono: true,
          lines: ['-v "${PWD}:/app"'],
        },
      },
    ],
  },
  {
    id: 12,
    slideNumber: 12,
    chapter: CH.bind,
    title: "Run it with a bind mount",
    badge: "HANDS-ON",
    speakerNote: "Same image as Session 2 — only the -v flag is new.",
    blocks: [
      {
        kind: "code",
        filename: "terminal",
        language: "bash",
        code: `docker run \\
  -p 8501:8501 \\
  -v "$(pwd):/app" \\
  hello-user:2.0`,
      },
    ],
  },
  {
    id: 13,
    slideNumber: 13,
    chapter: CH.bind,
    title: "Now change the code",
    subtitle: "Edit the file. Save it. Watch the browser.",
    badge: "THE MOMENT",
    speakerNote:
      "Do it live. The reload is the payoff for the whole section.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: 'st.title("Docker Task Manager")',
      },
    ],
  },
  {
    id: 14,
    slideNumber: 14,
    chapter: CH.bind,
    title: "What you did not have to do",
    badge: "THE POINT",
    speakerNote: "Four things they didn't do. That's the whole win.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Not needed",
          tone: "coral",
          lines: [
            "Build a new image",
            "Push an image",
            "Delete the container",
            "Create another container",
          ],
        },
        right: {
          title: "What happened instead",
          tone: "mint",
          lines: [
            "The source was already mounted",
            "The container saw the file change",
            "Streamlit reloaded itself",
          ],
        },
      },
    ],
  },
  {
    id: 15,
    slideNumber: 15,
    chapter: CH.bind,
    title: "The development workflow",
    subtitle: "Much faster.",
    badge: "WORKFLOW",
    speakerNote: "Contrast this directly with the seven-step chain on slide 5.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Edit code",
          "Save",
          "Bind mount",
          "Container sees change",
          "App reloads",
        ],
        orientation: "horizontal",
        highlightLast: true,
        tone: "mint",
      },
    ],
  },
  {
    id: 16,
    slideNumber: 16,
    chapter: CH.bind,
    title: "Where bind mounts shine",
    badge: "GOOD FOR",
    speakerNote: "All development-side. Note that production is missing from this list.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Local development",
          "Source code",
          "Fast iteration",
          "Debugging",
          "Live reload",
        ],
        columns: 2,
        tone: "mint",
      },
    ],
  },
  {
    id: 17,
    slideNumber: 17,
    chapter: CH.bind,
    title: "A word of warning",
    subtitle: "Bind mounts expose host files to the container.",
    badge: "CAREFUL",
    joke: "Giving a container your entire laptop is technically a deployment strategy.",
    speakerNote:
      "Mount the project directory. Never the drive root or your home folder.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Don't mount",
          tone: "coral",
          mono: true,
          lines: ["C:\\", "/", "/home", "/etc"],
        },
        right: {
          title: "Do mount",
          tone: "mint",
          mono: true,
          lines: ["your project directory", "and nothing above it"],
        },
      },
    ],
  },

  /* ========== SECTION 3 — DEVELOPMENT VS PRODUCTION ========== */
  {
    id: 18,
    slideNumber: 18,
    chapter: CH.devprod,
    title: "Development",
    subtitle: "Code stays on the host and is mounted in. Fast feedback.",
    badge: "DEV",
    speakerNote: "The workflow we just built.",
    blocks: [
      {
        kind: "flow",
        steps: ["Host source code", "Bind mount", "Container"],
        highlightLast: true,
        tone: "mint",
      },
    ],
  },
  {
    id: 19,
    slideNumber: 19,
    chapter: CH.devprod,
    title: "Production",
    subtitle: "Code is baked into the image. Nothing is mounted.",
    badge: "PROD",
    speakerNote:
      "In production the image must be self-contained — no host to mount from.",
    blocks: [
      {
        kind: "flow",
        steps: ["Source code", "docker build", "Image", "Container"],
        orientation: "horizontal",
        highlightLast: true,
        tone: "sky",
      },
    ],
  },
  {
    id: 20,
    slideNumber: 20,
    chapter: CH.devprod,
    title: "Two different workflows — don't confuse them",
    badge: "IMPORTANT",
    speakerNote:
      "A recurring source of confusion later. Name it clearly now.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Development",
          tone: "mint",
          mono: true,
          lines: ["Edit → Save → Reload"],
        },
        right: {
          title: "Production",
          tone: "sky",
          mono: true,
          lines: ["Code → Build → Test → Deploy"],
        },
      },
    ],
  },

  /* ========== SECTION 4 — MULTIPLE CONTAINERS ========== */
  {
    id: 21,
    slideNumber: 21,
    chapter: CH.multi,
    title: "Real applications aren't alone",
    subtitle: "Each piece could run in its own container.",
    badge: "REALITY",
    speakerNote: "Ask what the apps they use at work are made of. Usually 3+ services.",
    blocks: [
      {
        kind: "bullets",
        items: ["Frontend", "Backend", "Database", "Cache", "Message queue"],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    id: 22,
    slideNumber: 22,
    chapter: CH.multi,
    title: "What we're building: Task Manager",
    subtitle: "Two services — a Streamlit app and a MySQL database.",
    badge: "THE PROJECT",
    speakerNote: "This is the thing we build for the rest of the session.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Streamlit", lines: ["the app"], tone: "orange" },
          { title: "MySQL", lines: ["the database"], tone: "sky" },
        ],
      },
    ],
  },
  {
    id: 23,
    slideNumber: 23,
    chapter: CH.multi,
    title: "Two containers, no connection",
    subtitle: "They exist. They cannot reach each other.",
    badge: "THE GAP",
    speakerNote: "Exactly where Session 2 stopped. Now we close it.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Streamlit container",
          tone: "orange",
          lines: ["Runs the UI", "Knows nothing about MySQL"],
        },
        right: {
          title: "MySQL container",
          tone: "sky",
          lines: ["Runs the database", "Knows nothing about Streamlit"],
        },
      },
    ],
  },
  {
    id: 24,
    slideNumber: 24,
    chapter: CH.multi,
    title: "So how do they talk?",
    badge: "THE QUESTION",
    speakerNote: "Let them guess before you name it.",
    blocks: [
      {
        kind: "statement",
        text: "Docker Networking",
        tone: "sky",
      },
    ],
  },

  /* ========== SECTION 5 — DOCKER NETWORKING ========== */
  {
    id: 25,
    slideNumber: 25,
    chapter: CH.net,
    title: "What is a Docker network?",
    subtitle: "A shared space where containers can reach one another.",
    badge: "CONCEPT",
    speakerNote: "Keep it conceptual. No subnets, no bridge internals today.",
    blocks: [
      {
        kind: "flow",
        steps: ["Container A", "Docker network", "Container B"],
        orientation: "horizontal",
        tone: "sky",
      },
    ],
  },
  {
    id: 26,
    slideNumber: 26,
    chapter: CH.net,
    title: "Create a network",
    badge: "HANDS-ON",
    speakerNote: "Networks are objects like volumes — create, list, remove.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker network create task-network" },
          { out: "b3f19c2a7d40" },
          { cmd: "docker network ls" },
          { out: "NETWORK ID     NAME           DRIVER" },
          { out: "b3f19c2a7d40   task-network   bridge" },
        ],
      },
    ],
  },
  {
    id: 27,
    slideNumber: 27,
    chapter: CH.net,
    title: "Run MySQL on the network",
    badge: "HANDS-ON",
    speakerNote:
      "Same MySQL command as Session 2, plus --network. Point at that one line.",
    blocks: [
      {
        kind: "code",
        filename: "terminal",
        language: "bash",
        code: `docker run -d \\
  --name task-db \\
  --network task-network \\
  -e MYSQL_ROOT_PASSWORD=example \\
  -e MYSQL_DATABASE=tasks \\
  -v mysql-data:/var/lib/mysql \\
  mysql:8`,
      },
    ],
  },
  {
    id: 28,
    slideNumber: 28,
    chapter: CH.net,
    title: "Run the app on the same network",
    badge: "HANDS-ON",
    speakerNote:
      "Same network name. That's what puts them in reach of each other.",
    blocks: [
      {
        kind: "code",
        filename: "terminal",
        language: "bash",
        code: `docker run -d \\
  --name task-app \\
  --network task-network \\
  -p 8501:8501 \\
  -v "$(pwd):/app" \\
  hello-user:2.0`,
      },
    ],
  },
  {
    id: 29,
    slideNumber: 29,
    chapter: CH.net,
    title: "Now we have a connection",
    badge: "PROGRESS",
    speakerNote: "Two containers, one network, a route between them.",
    blocks: [
      {
        kind: "flow",
        steps: ["Streamlit container", "task-network", "MySQL container"],
        highlightLast: true,
        tone: "sky",
      },
    ],
  },
  {
    id: 30,
    slideNumber: 30,
    chapter: CH.net,
    title: "The localhost trap",
    subtitle: "Inside a container, localhost means that container itself.",
    badge: "CRITICAL",
    speakerNote:
      "The single most common bug in this session. Say it twice.",
    blocks: [
      {
        kind: "callout",
        text: "Inside the Streamlit container, localhost is the Streamlit container — not MySQL.",
        tone: "coral",
        label: "Trap",
      },
    ],
  },
  {
    id: 31,
    slideNumber: 31,
    chapter: CH.net,
    title: "The mistake almost everyone makes",
    badge: "COMMON ERROR",
    speakerNote:
      "Show the wrong config and the error it produces, so they recognise it later.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "What people write",
          tone: "coral",
          mono: true,
          lines: ["MYSQL_HOST=localhost"],
          note: "Points at the app's own container",
        },
        right: {
          title: "What happens",
          tone: "ink",
          mono: true,
          lines: ["Can't connect to", "localhost:3306"],
        },
      },
    ],
  },
  {
    id: 32,
    slideNumber: 32,
    chapter: CH.net,
    title: "Use the container's name instead",
    badge: "THE FIX",
    speakerNote: "The name you gave with --name is the hostname. That's the trick.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Wrong",
          tone: "coral",
          mono: true,
          lines: ["MYSQL_HOST=localhost"],
        },
        right: {
          title: "Right",
          tone: "mint",
          mono: true,
          lines: ["MYSQL_HOST=task-db"],
        },
      },
    ],
  },
  {
    id: 33,
    slideNumber: 33,
    chapter: CH.net,
    title: "Container name as hostname",
    subtitle: "Docker's network resolves the name for you.",
    badge: "HOW IT WORKS",
    speakerNote: "No IP addresses, no config files. The name is enough.",
    blocks: [
      {
        kind: "flow",
        steps: ["Streamlit", "hostname: task-db", "MySQL"],
        orientation: "horizontal",
        highlightLast: true,
        tone: "sky",
      },
    ],
  },
  {
    id: 34,
    slideNumber: 34,
    chapter: CH.net,
    title: "Networking mental model",
    badge: "REMEMBER",
    speakerNote: "Four steps. This is the summary they should write down.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Same network",
          "Containers can communicate",
          "Use the container name",
          "Connect to the right port",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    id: 35,
    slideNumber: 35,
    chapter: CH.net,
    title: "Internal vs external ports",
    subtitle: "Who's asking decides which address you use.",
    badge: "DISTINCTION",
    speakerNote:
      "Browser talks to the host. Containers talk to each other by name.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "From your browser",
          tone: "orange",
          mono: true,
          lines: ["localhost:8501"],
          note: "External — goes through the published port",
        },
        right: {
          title: "From the app container",
          tone: "sky",
          mono: true,
          lines: ["task-db:3306"],
          note: "Internal — goes across the Docker network",
        },
      },
    ],
  },
  {
    id: 36,
    slideNumber: 36,
    chapter: CH.net,
    title: "Port mapping, once more",
    badge: "RECAP",
    speakerNote: "Quick callback to Session 2 — they've seen this shape.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Host :8501", lines: ["your machine"], tone: "sky" },
          { title: "Container :8501", lines: ["Streamlit"], tone: "orange" },
        ],
        connector: "-p 8501:8501",
      },
    ],
  },
  {
    id: 37,
    slideNumber: 37,
    chapter: CH.net,
    title: "MySQL doesn't need a published port",
    subtitle: "If only the app talks to it, it never has to reach your host.",
    badge: "GOOD PRACTICE",
    speakerNote:
      "A small security point: don't expose a database to the host without reason.",
    blocks: [
      {
        kind: "flow",
        steps: ["Streamlit", "Docker network", "MySQL"],
        orientation: "horizontal",
        tone: "mint",
      },
      {
        kind: "callout",
        text: "No -p 3306:3306 needed. The database stays reachable only from inside the network.",
        tone: "mint",
      },
    ],
  },

  /* ========== SECTION 6 — TASK MANAGER APPLICATION ========== */
  {
    id: 38,
    slideNumber: 38,
    chapter: CH.taskapp,
    title: "Project architecture",
    badge: "ARCHITECTURE",
    speakerNote: "The whole stack in one line. We'll build it piece by piece.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Browser",
          "Streamlit container",
          "Docker network",
          "MySQL container",
          "Named volume",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    id: 39,
    slideNumber: 39,
    chapter: CH.taskapp,
    title: "What the app will do",
    subtitle: "Keep the UI simple — the Docker part is the lesson.",
    badge: "FEATURES",
    speakerNote: "Four operations. Deliberately plain CRUD.",
    blocks: [
      {
        kind: "bullets",
        items: ["Create task", "View tasks", "Complete task", "Delete task"],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    id: 40,
    slideNumber: 40,
    chapter: CH.taskapp,
    title: "The database table",
    badge: "SQL",
    speakerNote: "Three columns. Don't get drawn into schema design.",
    blocks: [
      {
        kind: "code",
        filename: "schema.sql",
        language: "sql",
        code: `CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);`,
      },
    ],
  },
  {
    id: 41,
    slideNumber: 41,
    chapter: CH.taskapp,
    title: "What a database connection needs",
    badge: "CONNECTION",
    speakerNote: "Five values. Note that host is task-db, not localhost.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Required",
          tone: "ink",
          lines: ["Host", "Port", "Database", "Username", "Password"],
        },
        right: {
          title: "Ours",
          tone: "sky",
          mono: true,
          lines: [
            "Host:     task-db",
            "Port:     3306",
            "Database: tasks",
            "User:     root",
          ],
        },
      },
    ],
  },
  {
    id: 42,
    slideNumber: 42,
    chapter: CH.taskapp,
    title: "We need a MySQL client library",
    subtitle: "Python can't speak to MySQL on its own.",
    badge: "DEPENDENCY",
    speakerNote:
      "Flag this early: changing requirements.txt means a rebuild. Comes back on slide 82.",
    blocks: [
      {
        kind: "statement",
        text: "mysql-connector-python",
        sub: "Add it to requirements.txt.",
        tone: "sky",
      },
    ],
  },
  {
    id: 43,
    slideNumber: 43,
    chapter: CH.taskapp,
    title: "requirements.txt",
    badge: "CODE",
    speakerNote: "Two lines now. This file changing is a rebuild trigger.",
    blocks: [
      {
        kind: "code",
        filename: "requirements.txt",
        language: "text",
        code: "streamlit\nmysql-connector-python",
      },
    ],
  },
  {
    id: 44,
    slideNumber: 44,
    chapter: CH.taskapp,
    title: "Connecting from Python",
    badge: "CODE",
    speakerNote: 'Point straight at host="task-db". That is the whole networking lesson.',
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `import mysql.connector

connection = mysql.connector.connect(
    host="task-db",
    port=3306,
    user="root",
    password="example",
    database="tasks"
)`,
      },
    ],
  },
  {
    id: 45,
    slideNumber: 45,
    chapter: CH.taskapp,
    title: "Why task-db and not localhost?",
    badge: "REINFORCE",
    speakerNote:
      "Third time we've made this point. That's deliberate — it's the one they'll get wrong.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "localhost means",
          tone: "coral",
          lines: ["The Streamlit container itself", "Where MySQL is not running"],
        },
        right: {
          title: "task-db means",
          tone: "mint",
          lines: [
            "The MySQL container",
            "Resolved by the Docker network",
          ],
        },
      },
    ],
  },
  {
    id: 46,
    slideNumber: 46,
    chapter: CH.taskapp,
    title: "Create a task",
    badge: "CODE",
    speakerNote: "Note the commit — without it nothing is saved.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `cursor.execute(
    "INSERT INTO tasks (title) VALUES (%s)",
    (title,)
)

connection.commit()`,
      },
    ],
  },
  {
    id: 47,
    slideNumber: 47,
    chapter: CH.taskapp,
    title: "Read tasks",
    badge: "CODE",
    speakerNote: "Reads need no commit.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `cursor.execute(
    "SELECT id, title, completed FROM tasks"
)

tasks = cursor.fetchall()`,
      },
    ],
  },
  {
    id: 48,
    slideNumber: 48,
    chapter: CH.taskapp,
    title: "Complete a task",
    badge: "CODE",
    speakerNote: "An update, and a commit again.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `cursor.execute(
    "UPDATE tasks SET completed = TRUE WHERE id = %s",
    (task_id,)
)

connection.commit()`,
      },
    ],
  },
  {
    id: 49,
    slideNumber: 49,
    chapter: CH.taskapp,
    title: "Delete a task",
    badge: "CODE",
    speakerNote: "Last of the four. Then we zoom back out.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `cursor.execute(
    "DELETE FROM tasks WHERE id = %s",
    (task_id,)
)

connection.commit()`,
      },
    ],
  },
  {
    id: 50,
    slideNumber: 50,
    chapter: CH.taskapp,
    title: "The full path of one request",
    badge: "END TO END",
    speakerNote:
      "Trace a button click all the way to the volume and back.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Browser",
          "Streamlit",
          "MySQL driver",
          "Docker network",
          "MySQL",
          "Volume",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 7 — ENVIRONMENT VARIABLES ========== */
  {
    id: 51,
    slideNumber: 51,
    chapter: CH.env,
    title: "There's a problem with our code",
    badge: "SMELL",
    speakerNote: "A password sitting in source. Everyone nods; few change it.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: 'password="example"',
      },
      {
        kind: "callout",
        text: "Hardcoded configuration. It works, and it's a habit worth breaking early.",
        tone: "coral",
      },
    ],
  },
  {
    id: 52,
    slideNumber: 52,
    chapter: CH.env,
    title: "Configuration should be configurable",
    badge: "PRINCIPLE",
    speakerNote: "Name the fix before showing it.",
    blocks: [
      {
        kind: "statement",
        text: "Environment variables",
        sub: "The same image, configured differently per environment.",
        tone: "sky",
      },
    ],
  },
  {
    id: 53,
    slideNumber: 53,
    chapter: CH.env,
    title: "The values we need",
    badge: "CONFIG",
    speakerNote: "Five variables replace five hardcoded strings.",
    blocks: [
      {
        kind: "code",
        filename: ".env",
        language: "text",
        code: `DB_HOST=task-db
DB_PORT=3306
DB_NAME=tasks
DB_USER=root
DB_PASSWORD=example`,
      },
    ],
  },
  {
    id: 54,
    slideNumber: 54,
    chapter: CH.env,
    title: "Python reads them",
    badge: "CODE",
    speakerNote: "os.getenv. Nothing exotic.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `import os

db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")`,
      },
    ],
  },
  {
    id: 55,
    slideNumber: 55,
    chapter: CH.env,
    title: "Why bother?",
    subtitle: "One image, many environments.",
    badge: "THE PAYOFF",
    speakerNote:
      "This is what makes an image portable. Same artefact, different config.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Development",
          tone: "mint",
          mono: true,
          lines: ["DB_HOST=task-db"],
        },
        right: {
          title: "Production",
          tone: "sky",
          mono: true,
          lines: ["DB_HOST=production-db"],
        },
      },
    ],
  },
  {
    id: 56,
    slideNumber: 56,
    chapter: CH.env,
    title: "One security note",
    subtitle: "Fine for a workshop. Not fine for a real system.",
    badge: "SECURITY",
    speakerNote:
      "Be honest that we're taking a shortcut, and name what the real answer is.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Today",
          tone: "yellow",
          mono: true,
          lines: ["DB_PASSWORD=example"],
          note: "Fine for a workshop",
        },
        right: {
          title: "In a real application",
          tone: "coral",
          lines: [
            "Don't commit secrets to Git",
            "Use a secret manager",
            "Rotate credentials",
          ],
        },
      },
    ],
  },

  /* ========== SECTION 8 — THE MANUAL WORKFLOW PROBLEM ========== */
  {
    id: 57,
    slideNumber: 57,
    chapter: CH.manual,
    title: "Look at what it takes to run this",
    badge: "THE PROBLEM",
    speakerNote: "Four commands, in order, every time, on every machine.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker network create task-network" },
          { cmd: "docker volume create mysql-data" },
          { cmd: "docker run -d --name task-db --network ... mysql:8" },
          { cmd: "docker run -d --name task-app --network ... -p 8501:8501 ..." },
        ],
      },
    ],
  },
  {
    id: 58,
    slideNumber: 58,
    chapter: CH.manual,
    title: "And then someone asks how to run it",
    badge: "THE ASK",
    joke: "Here's my 17-line command sequence.",
    speakerNote: "Everyone has been handed a README like this. Let them groan.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "They ask",
          tone: "sky",
          lines: ["How do I run this project?"],
        },
        right: {
          title: "You answer",
          tone: "coral",
          lines: ["Here's my 17-line command sequence."],
        },
      },
    ],
  },
  {
    id: 59,
    slideNumber: 59,
    chapter: CH.manual,
    title: "There must be a better way",
    subtitle: "All of this deserves to be written down once, as a file.",
    badge: "THE TURN",
    speakerNote: "List everything we're juggling, then name Compose.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "2 containers",
          "1 network",
          "1 volume",
          "Environment variables",
          "Ports",
          "Build configuration",
        ],
        columns: 2,
        tone: "coral",
      },
    ],
  },

  /* ========== SECTION 9 — DOCKER COMPOSE ========== */
  {
    id: 60,
    slideNumber: 60,
    chapter: CH.compose,
    title: "Docker Compose",
    subtitle: "Define a multi-container application in one YAML file.",
    badge: "NEW TOOL",
    speakerNote: "The shift: from many commands to one description.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Instead of",
          tone: "coral",
          lines: ["Many Docker commands", "Run in the right order", "Every time"],
        },
        right: {
          title: "We describe",
          tone: "mint",
          lines: ["One application", "In one file", "Started with one command"],
        },
      },
    ],
  },
  {
    id: 61,
    slideNumber: 61,
    chapter: CH.compose,
    title: "The Compose mental model",
    badge: "MENTAL MODEL",
    speakerNote: "One file describes the whole application, not one container.",
    blocks: [
      {
        kind: "flow",
        steps: ["compose.yaml", "Application definition", "App + DB + Network + Volume"],
        highlightLast: true,
        tone: "sky",
      },
    ],
  },
  {
    id: 62,
    slideNumber: 62,
    chapter: CH.compose,
    title: "compose.yaml",
    subtitle: "The whole application, in one file.",
    badge: "THE FILE",
    speakerNote:
      "Show it whole once. The next nine slides take it apart piece by piece.",
    blocks: [
      {
        kind: "code",
        filename: "compose.yaml",
        language: "yaml",
        code: `services:
  app:
    build: .
    ports:
      - "8501:8501"
    volumes:
      - .:/app
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: tasks
      DB_USER: root
      DB_PASSWORD: example
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: tasks
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:`,
      },
    ],
  },
  {
    id: 63,
    slideNumber: 63,
    chapter: CH.compose,
    title: "Compose has services",
    subtitle: "Each service is a container in the application.",
    badge: "STRUCTURE",
    speakerNote: "Two services here. Bigger apps have more.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "app", lines: ["Streamlit"], tone: "orange" },
          { title: "db", lines: ["MySQL"], tone: "sky" },
        ],
      },
    ],
  },
  {
    id: 64,
    slideNumber: 64,
    chapter: CH.compose,
    title: "The app service builds from our Dockerfile",
    badge: "build",
    speakerNote: "build: . means use the Dockerfile in this directory.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `app:
  build: .`,
        notes: [
          {
            label: "build",
            text: "Build this service's image from the Dockerfile in the current directory.",
          },
        ],
      },
    ],
  },
  {
    id: 65,
    slideNumber: 65,
    chapter: CH.compose,
    title: "Publishing the app's port",
    badge: "ports",
    speakerNote: "Same host:container mapping as -p on the command line.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `ports:
  - "8501:8501"`,
        notes: [
          {
            label: "ports",
            text: "Makes Streamlit reachable from your browser at localhost:8501.",
          },
        ],
      },
    ],
  },
  {
    id: 66,
    slideNumber: 66,
    chapter: CH.compose,
    title: "The bind mount, in Compose",
    badge: "volumes",
    speakerNote: "This one line is our whole development workflow, carried over.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `volumes:
  - .:/app`,
        notes: [
          {
            label: "bind mount",
            text: "The project directory is mounted into the container — edit and save, no rebuild.",
          },
        ],
      },
    ],
  },
  {
    id: 67,
    slideNumber: 67,
    chapter: CH.compose,
    title: "The database service needs no Dockerfile",
    badge: "image",
    speakerNote: "We build our app; we just use MySQL's published image.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `db:
  image: mysql:8`,
        notes: [
          {
            label: "image",
            text: "Pull and run an existing image instead of building one.",
          },
          {
            label: "Why",
            text: "MySQL already publishes a good image. There's nothing for us to add.",
          },
        ],
      },
    ],
  },
  {
    id: 68,
    slideNumber: 68,
    chapter: CH.compose,
    title: "The database volume",
    subtitle: "So the data survives container replacement.",
    badge: "volumes",
    speakerNote: "Named volume, exactly as in Session 2 — just declared instead of created.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `volumes:
  - mysql-data:/var/lib/mysql`,
        notes: [
          {
            label: "named volume",
            text: "Docker-managed storage mounted at MySQL's data directory.",
          },
          {
            label: "Note",
            text: "A name on the left rather than a path means a volume, not a bind mount.",
          },
        ],
      },
    ],
  },
  {
    id: 69,
    slideNumber: 69,
    chapter: CH.compose,
    title: "Environment variables in Compose",
    badge: "environment",
    speakerNote: "Note DB_HOST is db — the service name, not localhost.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `environment:
  DB_HOST: db
  DB_PORT: 3306
  DB_NAME: tasks`,
        notes: [
          {
            label: "DB_HOST",
            text: "The service name db — not localhost, for exactly the reason from slide 30.",
          },
        ],
      },
    ],
  },
  {
    id: 70,
    slideNumber: 70,
    chapter: CH.compose,
    title: "Why db?",
    subtitle: "Compose creates a network and registers each service under its own name.",
    badge: "NAMING",
    speakerNote:
      "Same rule as --name earlier. Compose just does the naming for you.",
    blocks: [
      {
        kind: "flow",
        steps: ["app", "hostname: db", "db"],
        orientation: "horizontal",
        highlightLast: true,
        tone: "sky",
      },
    ],
  },
  {
    id: 71,
    slideNumber: 71,
    chapter: CH.compose,
    title: "Compose manages the network for you",
    badge: "NETWORKING",
    speakerNote: "No docker network create. One less thing to remember.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "By hand",
          tone: "coral",
          mono: true,
          lines: ["docker network create", "--network task-network", "on every run"],
        },
        right: {
          title: "With Compose",
          tone: "mint",
          lines: ["Created automatically", "Services joined automatically"],
        },
      },
    ],
  },
  {
    id: 72,
    slideNumber: 72,
    chapter: CH.compose,
    title: "depends_on",
    subtitle: "Expresses startup order — not readiness.",
    badge: "CAREFUL",
    speakerNote:
      "Important caveat: MySQL being started is not MySQL being ready to accept connections.",
    blocks: [
      {
        kind: "annotated",
        filename: "compose.yaml",
        language: "yaml",
        code: `depends_on:
  - db`,
        notes: [
          { label: "Does", text: "Starts db before app." },
          {
            label: "Does NOT",
            text: "Wait for MySQL to be ready to accept connections. Your app still needs to retry.",
          },
        ],
      },
    ],
  },

  /* ========== SECTION 10 — RUNNING COMPOSE ========== */
  {
    id: 73,
    slideNumber: 73,
    chapter: CH.running,
    title: "Start everything",
    subtitle: "One command replaces the four from slide 57.",
    badge: "HANDS-ON",
    speakerNote: "This is the moment Compose sells itself.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose up" },
          { out: "[+] Running 3/3" },
          { out: " Network taskmanager_default  Created" },
          { out: " Container taskmanager-db-1   Started" },
          { out: " Container taskmanager-app-1  Started" },
        ],
      },
    ],
  },
  {
    id: 74,
    slideNumber: 74,
    chapter: CH.running,
    title: "Detached mode",
    subtitle: "Run it in the background and get your terminal back.",
    badge: "-d",
    speakerNote: "Same -d as docker run.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker compose up -d" }, { out: "[+] Running 3/3" }],
      },
    ],
  },
  {
    id: 75,
    slideNumber: 75,
    chapter: CH.running,
    title: "See what's running",
    badge: "ps",
    speakerNote: "The Compose equivalent of docker ps, scoped to this project.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose ps" },
          { out: "NAME                 SERVICE   STATUS" },
          { out: "taskmanager-app-1    app       running" },
          { out: "taskmanager-db-1     db        running" },
        ],
      },
    ],
  },
  {
    id: 76,
    slideNumber: 76,
    chapter: CH.running,
    title: "View logs",
    subtitle: "All services, or just one.",
    badge: "logs",
    speakerNote: "They will live in this command during the hands-on project.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose logs" },
          { comment: "everything, interleaved" },
          { cmd: "docker compose logs app" },
          { comment: "just the app service" },
        ],
      },
    ],
  },
  {
    id: 77,
    slideNumber: 77,
    chapter: CH.running,
    title: "Stop everything",
    badge: "down",
    speakerNote: "Containers and network removed. Note what is not removed.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose down" },
          { out: " Container taskmanager-app-1  Removed" },
          { out: " Container taskmanager-db-1   Removed" },
          { out: " Network taskmanager_default  Removed" },
        ],
      },
    ],
  },
  {
    id: 78,
    slideNumber: 78,
    chapter: CH.running,
    title: "What happened to the volume?",
    subtitle: "It's still there — and that's deliberate.",
    badge: "IMPORTANT",
    speakerNote: "This is why their data survives a down/up cycle.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Removed",
          tone: "coral",
          lines: ["Containers", "Network"],
        },
        right: {
          title: "Kept",
          tone: "mint",
          lines: ["Named volumes", "Your database data"],
        },
      },
    ],
  },
  {
    id: 79,
    slideNumber: 79,
    chapter: CH.running,
    title: "Removing volumes too",
    subtitle: "Only when you mean it.",
    badge: "-v",
    speakerNote: "Warn them properly. This is the command that loses data.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose down -v" },
          { comment: "also deletes named volumes" },
        ],
      },
      {
        kind: "callout",
        text: "This deletes your database. Reach for it deliberately, never by habit.",
        tone: "coral",
        label: "Warning",
      },
    ],
  },
  {
    id: 80,
    slideNumber: 80,
    chapter: CH.running,
    title: "Rebuilding",
    subtitle: "When the Dockerfile or dependencies change.",
    badge: "build",
    speakerNote: "Sets up the next section: knowing when a rebuild is needed.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose build" },
          { comment: "or, in one step" },
          { cmd: "docker compose up --build" },
        ],
      },
    ],
  },

  /* ========== SECTION 11 — THE DEVELOPMENT WORKFLOW ========== */
  {
    id: 81,
    slideNumber: 81,
    chapter: CH.workflow,
    title: "Now we have something genuinely useful",
    subtitle: "No image rebuild for every Python change.",
    badge: "THE WIN",
    speakerNote: "Compare against slide 5 one final time.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Edit code",
          "Save",
          "Bind mount",
          "Container sees it",
          "Streamlit reloads",
        ],
        orientation: "horizontal",
        highlightLast: true,
        tone: "mint",
      },
    ],
  },
  {
    id: 82,
    slideNumber: 82,
    chapter: CH.workflow,
    title: "So when do we rebuild?",
    subtitle: "The question everyone asks next.",
    badge: "RULES",
    speakerNote:
      "Simple rule: code is mounted, so no rebuild. Anything baked into the image needs one.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "No rebuild",
          tone: "mint",
          mono: true,
          lines: ["app.py", "any mounted source file"],
          note: "It's mounted, not baked in",
        },
        right: {
          title: "Rebuild",
          tone: "coral",
          mono: true,
          lines: ["requirements.txt", "Dockerfile"],
          note: "These are baked into the image",
        },
      },
    ],
  },
  {
    id: 83,
    slideNumber: 83,
    chapter: CH.workflow,
    title: "The whole development loop",
    badge: "ARCHITECTURE",
    speakerNote: "Developer to volume, one path. This is the session in a line.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Developer edits",
          "Host directory",
          "Bind mount",
          "Streamlit container",
          "Docker network",
          "MySQL container",
          "Named volume",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 12 — DEBUGGING ========== */
  {
    id: 84,
    slideNumber: 84,
    chapter: CH.debug,
    title: "Something broke",
    subtitle: "Don't panic. Docker gives you tools.",
    badge: "DEBUGGING",
    speakerNote: "Set the tone: this is a process, not guesswork.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker compose ps" }, { comment: "always start here" }],
      },
    ],
  },
  {
    id: 85,
    slideNumber: 85,
    chapter: CH.debug,
    title: "Check the logs",
    subtitle: "Most answers are already printed somewhere.",
    badge: "logs",
    speakerNote: "Teach them to read logs before changing anything.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker compose logs" },
          { cmd: "docker compose logs app" },
          { cmd: "docker compose logs db" },
        ],
      },
    ],
  },
  {
    id: 86,
    slideNumber: 86,
    chapter: CH.debug,
    title: "Container not running?",
    subtitle: "A stopped container always has a reason.",
    badge: "ps -a",
    speakerNote: "ps shows running; ps -a shows the ones that died and why.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker ps" },
          { comment: "running only" },
          { cmd: "docker ps -a" },
          { out: "Exited (1) 4 seconds ago" },
        ],
      },
    ],
  },
  {
    id: 87,
    slideNumber: 87,
    chapter: CH.debug,
    title: "App can't reach MySQL?",
    subtitle: "Work through these in order.",
    badge: "CHECKLIST",
    speakerNote:
      "Genuinely walk it top to bottom. Most failures are number 3.",
    blocks: [
      {
        kind: "checklist",
        items: [
          "Is MySQL running?",
          "Are both services on the same network?",
          "Is DB_HOST correct?",
          "Is the port correct?",
          "Are the credentials correct?",
          "Is MySQL actually ready to accept connections?",
        ],
      },
    ],
  },
  {
    id: 88,
    slideNumber: 88,
    chapter: CH.debug,
    title: "localhost, one more time",
    subtitle: "If you see this error, you already know the answer.",
    badge: "THE USUAL SUSPECT",
    speakerNote: "Fourth mention. By now it should be reflex.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { out: "Can't connect to localhost:3306" },
          { comment: "is MySQL running inside this same container?" },
          { comment: "if not, localhost is the wrong host" },
        ],
      },
    ],
  },
  {
    id: 89,
    slideNumber: 89,
    chapter: CH.debug,
    title: "Debugging mental model",
    subtitle: "Narrow it down, one layer at a time.",
    badge: "PROCESS",
    speakerNote: "Outside in. Don't jump to the database first.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Container running?",
          "Check logs",
          "Check configuration",
          "Check network",
          "Check ports",
          "Check database",
        ],
        orientation: "horizontal",
      },
    ],
  },

  /* ========== SECTION 13 — HANDS-ON PROJECT ========== */
  {
    id: 90,
    slideNumber: 90,
    chapter: CH.handson,
    title: "Build it: Task Manager",
    subtitle: "Everything from today, in one project.",
    badge: "YOUR TURN",
    speakerNote: "Hand over. This is the main practical block of the session.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Streamlit", tone: "orange" },
          { title: "MySQL", tone: "sky" },
          { title: "Docker", tone: "ink" },
          { title: "Compose", tone: "mint" },
        ],
      },
    ],
  },
  {
    id: 91,
    slideNumber: 91,
    chapter: CH.handson,
    title: "What it has to do",
    badge: "REQUIREMENTS",
    speakerNote: "Application features on the left, infrastructure on the right.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Application",
          tone: "orange",
          lines: ["Add task", "List tasks", "Complete task", "Delete task"],
        },
        right: {
          title: "Infrastructure",
          tone: "sky",
          lines: [
            "App container",
            "MySQL container",
            "Bind mount",
            "Docker network",
            "Named volume",
            "Compose",
          ],
        },
      },
    ],
  },
  {
    id: 92,
    slideNumber: 92,
    chapter: CH.handson,
    title: "Final architecture",
    badge: "TARGET",
    speakerNote: "What their finished project should look like.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Browser :8501",
          "Streamlit container",
          "Docker network",
          "MySQL container",
          "mysql-data volume",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    id: 93,
    slideNumber: 93,
    chapter: CH.handson,
    title: "Start the project",
    badge: "STEP 1",
    speakerNote: "--build on the first run, since the image doesn't exist yet.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker compose up --build" }],
      },
    ],
  },
  {
    id: 94,
    slideNumber: 94,
    chapter: CH.handson,
    title: "Open the application",
    badge: "STEP 2",
    speakerNote: "Everyone should reach this before you continue.",
    blocks: [
      {
        kind: "mockup",
        title: "localhost:8501",
        fields: ["New task"],
        result: "Task Manager",
      },
    ],
  },
  {
    id: 95,
    slideNumber: 95,
    chapter: CH.handson,
    title: "Test: create a task",
    badge: "STEP 3",
    speakerNote: "Verify it appears in the list.",
    blocks: [
      {
        kind: "callout",
        text: "Create a task called \u201CLearn Docker Networking\u201D and check it shows up.",
        tone: "sky",
      },
    ],
  },
  {
    id: 96,
    slideNumber: 96,
    chapter: CH.handson,
    title: "Test: complete a task",
    badge: "STEP 4",
    speakerNote: "The update path — verify the database actually changed.",
    blocks: [
      {
        kind: "callout",
        text: "Mark it complete, then confirm the change persisted.",
        tone: "sky",
      },
    ],
  },
  {
    id: 97,
    slideNumber: 97,
    chapter: CH.handson,
    title: "Test: delete a task",
    badge: "STEP 5",
    speakerNote: "The delete path. All four operations now exercised.",
    blocks: [
      {
        kind: "callout",
        text: "Delete it and confirm it disappears.",
        tone: "sky",
      },
    ],
  },
  {
    id: 98,
    slideNumber: 98,
    chapter: CH.handson,
    title: "Test: restart the containers",
    badge: "STEP 6",
    speakerNote: "Down then up. This is the persistence test setup.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker compose down" }, { cmd: "docker compose up" }],
      },
    ],
  },
  {
    id: 99,
    slideNumber: 99,
    chapter: CH.handson,
    title: "The tasks are still there. Why?",
    subtitle: "The named volume.",
    badge: "PERSISTENCE",
    speakerNote:
      "Make them answer before you show it. This is the Session 2 lesson paying off.",
    blocks: [
      {
        kind: "flow",
        steps: ["Containers removed", "Volume kept", "Data survived"],
        orientation: "horizontal",
        highlightLast: true,
        tone: "mint",
      },
    ],
  },
  {
    id: 100,
    slideNumber: 100,
    chapter: CH.handson,
    title: "Test: change the code while it runs",
    badge: "STEP 7",
    speakerNote: "The bind mount lesson, proven in their own project.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: 'st.title("My Docker Task Manager")',
      },
      {
        kind: "callout",
        text: "Save the file. No rebuild, no restart — the container already sees it.",
        tone: "mint",
      },
    ],
  },

  /* ========== SECTION 14 — FINAL MENTAL MODEL ========== */
  {
    id: 101,
    slideNumber: 101,
    chapter: CH.model,
    title: "Three concepts people mix up",
    badge: "CLARITY",
    speakerNote: "Image, container, volume. Different things, different lifetimes.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Image", lines: ["application package"], tone: "sky" },
          { title: "Container", lines: ["running instance"], tone: "orange" },
          { title: "Volume", lines: ["persistent data"], tone: "mint" },
        ],
      },
    ],
  },
  {
    id: 102,
    slideNumber: 102,
    chapter: CH.model,
    title: "Bind mount vs named volume",
    subtitle: "Both mount storage. They're for different jobs.",
    badge: "COMPARE",
    speakerNote:
      "The distinction promised at the end of Session 2, now fully answered.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Bind mount",
          tone: "sky",
          lines: [
            "A host directory, mounted in",
            "You control the path",
            "Best for development and source code",
          ],
        },
        right: {
          title: "Named volume",
          tone: "mint",
          lines: [
            "Storage Docker manages",
            "You reference it by name",
            "Best for persistent application data",
          ],
        },
      },
    ],
  },
  {
    id: 103,
    slideNumber: 103,
    chapter: CH.model,
    title: "Networking, in one rule",
    subtitle: "Use the service name, not localhost.",
    badge: "REMEMBER",
    speakerNote: "If they remember one line from today, this is a good candidate.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Wrong",
          tone: "coral",
          mono: true,
          lines: ["localhost:3306"],
        },
        right: {
          title: "Right",
          tone: "mint",
          mono: true,
          lines: ["db:3306"],
        },
      },
    ],
  },
  {
    id: 104,
    slideNumber: 104,
    chapter: CH.model,
    title: "What Compose gives us",
    subtitle: "All of it, in one place.",
    badge: "SUMMARY",
    speakerNote: "Six things that used to be six separate commands.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Services",
          "Networks",
          "Volumes",
          "Environment",
          "Ports",
          "Build configuration",
        ],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    id: 105,
    slideNumber: 105,
    chapter: CH.model,
    title: "Before Compose",
    badge: "BEFORE",
    speakerNote: "Read them out. Then the next slide is one line.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker network create ..." },
          { cmd: "docker volume create ..." },
          { cmd: "docker run mysql ..." },
          { cmd: "docker run app ..." },
          { comment: "in the right order, every time" },
        ],
      },
    ],
  },
  {
    id: 106,
    slideNumber: 106,
    chapter: CH.model,
    title: "After Compose",
    subtitle: "That's the point.",
    badge: "AFTER",
    speakerNote: "Let the contrast do the work. Don't over-explain.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker compose up" }],
      },
    ],
  },
  {
    id: 107,
    slideNumber: 107,
    chapter: CH.model,
    title: "The complete development workflow",
    badge: "THE WHOLE THING",
    speakerNote: "Everything from today, in one chain.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Write code",
          "Bind mount",
          "Container",
          "Docker network",
          "Database",
          "Named volume",
          "Compose",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 15 — WHAT WE LEARNED ========== */
  {
    id: 108,
    slideNumber: 108,
    chapter: CH.learned,
    title: "Session 3 recap",
    badge: "RECAP",
    speakerNote: "A long list for one session. Point that out — they earned it.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Bind mounts",
          "Development workflow",
          "Docker networks",
          "Container-to-container communication",
          "Service names",
          "Environment variables",
          "Docker Compose",
          "Compose volumes",
          "Logs",
          "Debugging",
        ],
        columns: 2,
      },
    ],
  },
  {
    id: 109,
    slideNumber: 109,
    chapter: CH.learned,
    title: "The big difference",
    badge: "SESSION 2 → 3",
    speakerNote: "One container became an application.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Session 2",
          tone: "ink",
          lines: ["One container"],
        },
        right: {
          title: "Session 3",
          tone: "mint",
          lines: [
            "Multiple containers",
            "Development workflow",
            "Networking",
            "Persistence",
            "Compose",
          ],
        },
      },
    ],
  },
  {
    id: 110,
    slideNumber: 110,
    chapter: CH.learned,
    title: "Docker starts to look different now",
    badge: "PERSPECTIVE",
    speakerNote: "A nice reflective beat before the handoff to Session 4.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "docker run felt like",
          tone: "ink",
          lines: ["Run this thing."],
        },
        right: {
          title: "docker compose up feels like",
          tone: "orange",
          lines: ["Here is my entire application."],
        },
      },
    ],
  },
  {
    id: 111,
    slideNumber: 111,
    chapter: CH.learned,
    title: "The new mental model",
    badge: "REMEMBER THIS",
    speakerNote: "Compose sits above everything else we've built.",
    blocks: [
      {
        kind: "flow",
        steps: ["Docker Compose", "App + Database", "Network", "Volumes", "Application"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 16 — NEXT SESSION ========== */
  {
    id: 112,
    slideNumber: 112,
    chapter: CH.next,
    title: "We can run it — but is it production-ready?",
    badge: "THE QUESTION",
    speakerNote: "Everything works on their laptop. That's not the same as shipping it.",
    blocks: [
      {
        kind: "bullets",
        items: ["Build", "Run", "Connect", "Persist", "Develop", "Debug"],
        columns: 2,
        tone: "mint",
      },
    ],
  },
  {
    id: 113,
    slideNumber: 113,
    chapter: CH.next,
    title: "New problems worth solving",
    badge: "NOT YET",
    speakerNote: "Each of these becomes a section of Session 4.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Images could be smaller",
          "Containers could be more secure",
          "Configuration could be better",
          "The app needs health checks",
          "Someone has to deploy this",
        ],
        columns: 1,
        tone: "coral",
      },
    ],
  },
  {
    id: 114,
    slideNumber: 114,
    chapter: CH.next,
    title: "Session 4 — Docker for Production",
    badge: "NEXT SESSION",
    speakerNote: "Sell the next one, then close.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Multi-stage builds",
          "Image optimisation",
          "Non-root containers",
          "Security basics",
          "Health checks",
          "Resource limits",
          "Production configuration",
          "Deployment",
        ],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    id: 115,
    slideNumber: 115,
    chapter: CH.next,
    title: "From docker run to docker compose up",
    subtitle: "We now have a real multi-container application.",
    badge: "END OF SESSION 3",
    joke: "Congratulations.",
    speakerNote: "Thank them. Session 4 unlocks next class.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "From",
          tone: "ink",
          mono: true,
          lines: ["docker run"],
        },
        right: {
          title: "To",
          tone: "orange",
          mono: true,
          lines: ["docker compose up"],
        },
      },
    ],
  },
];
