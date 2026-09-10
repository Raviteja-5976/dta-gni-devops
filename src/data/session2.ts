import type { SlideData } from "./slides";

/* ===========================================================
   SESSION 2 — DOCKER FUNDAMENTALS
   From Code to Container. One concept per slide, three hands-on
   projects: Hello User, a SQLite blog, and MySQL with a volume.

   Bodies are composed from the typed primitives in
   components/slides/blocks/types.ts rather than bespoke markup,
   because the source material is highly regular: arrow chains,
   terminal sessions, annotated Dockerfiles, side-by-side compares.

   Recurring cast, carried over from Session 1: Lehar Loom (the
   company) and Sam (the senior developer).
   =========================================================== */

const CH = {
  recap: "01 / WHERE WE LEFT OFF",
  what: "02 / WHAT IS DOCKER?",
  arch: "03 / DOCKER ARCHITECTURE",
  install: "04 / INSTALL DOCKER",
  first: "05 / YOUR FIRST CONTAINER",
  commands: "06 / BASIC COMMANDS",
  app: "07 / PROJECT 1: HELLO USER",
  dockerfile: "08 / THE DOCKERFILE",
  build: "09 / BUILD THE IMAGE",
  run: "10 / RUN OUR APPLICATION",
  optimize: "11 / SHRINK SIZE AND BUILD TIME",
  tags: "12 / TAGS",
  data: "13 / PROJECT 2: SQLITE BLOG",
  volumes: "14 / PROJECT 3: MYSQL + VOLUME",
  hub: "15 / DOCKER HUB",
  cheat: "16 / CHEAT SHEET",
  big: "17 / THE BIG PICTURE",
  next: "18 / WHAT'S NEXT?",
} as const;

const RAW_SLIDES: Omit<SlideData, "id" | "slideNumber">[] = [
  /* ========== SECTION 1 — WHERE WE LEFT OFF ========== */
  {
    chapter: CH.recap,
    title: "Docker Fundamentals",
    subtitle: "Session 2 — let's make Docker do something useful.",
    badge: "SESSION 2",
    speakerNote:
      "Last session was the map. This session we walk one road: code becomes an image, an image becomes a container.",
    blocks: [
      {
        kind: "flow",
        steps: ["Code", "Image", "Container"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.recap,
    title: "Where we got to last time",
    subtitle: "Six ideas, one story: why any of this exists.",
    badge: "RECAP",
    speakerNote:
      "Quick recall. Don't re-teach these — just remind them the map exists.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "DevOps",
          "Containers",
          "Docker",
          "Kubernetes",
          "CI/CD",
          "Terraform",
        ],
        orientation: "horizontal",
      },
    ],
  },
  {
    chapter: CH.recap,
    title: "Today we zoom in on one of them",
    badge: "SCOPE",
    joke: "One technology at a time. Your laptop has suffered enough.",
    speakerNote:
      "Set expectations hard here. No Kubernetes today. No Terraform. No pipelines.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Kubernetes", lines: ["not today"], tone: "ink" },
          { title: "Docker", lines: ["all of today"], tone: "orange" },
          { title: "Terraform", lines: ["not today"], tone: "ink" },
        ],
      },
    ],
  },

  {
    chapter: CH.recap,
    title: "Three things we'll build today",
    badge: "TODAY'S PROJECTS",
    speakerNote:
      "Name all three up front. Each one answers a question the previous one raises.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Hello User", lines: ["Streamlit", "shrink the image"], tone: "orange" },
          { title: "SQLite Blog", lines: ["Flask", "watch data disappear"], tone: "coral" },
          { title: "MySQL + volume", lines: ["mysql shell", "keep the data"], tone: "mint" },
        ],
      },
    ],
  },

  /* ========== SECTION 2 — WHAT IS DOCKER? ========== */
  {
    chapter: CH.what,
    title: "What problem does Docker actually solve?",
    subtitle: "Sam writes an application. It works. Sam sends it on. It breaks.",
    badge: "THE PROBLEM",
    speakerNote:
      "This is the same pain from Session 1, restated as the thing Docker fixes.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Sam's machine",
          tone: "mint",
          lines: ["Runs the app", "No errors", "Ships it with confidence"],
          note: "It works!",
        },
        right: {
          title: "Any other machine",
          tone: "coral",
          lines: ["Missing runtime", "Wrong versions", "Nothing starts"],
          note: "Why doesn't it work?",
        },
      },
    ],
  },
  {
    chapter: CH.what,
    title: "An application is more than its source code",
    badge: "DEPENDENCIES",
    speakerNote:
      "The code is the small part. Everything around it is what breaks.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Runtime",
          "Libraries",
          "System packages",
          "Configuration",
          "Environment",
        ],
        columns: 2,
      },
    ],
  },
  {
    chapter: CH.what,
    title: "The same app, two different machines",
    badge: "EXAMPLE",
    speakerNote:
      "Point at the version numbers. That gap is the entire bug report.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "What Sam's app needs",
          tone: "sky",
          mono: true,
          lines: [
            "Python 3.12",
            "Streamlit",
            "Pandas",
            "Requests",
            "System libraries",
            "Environment variables",
          ],
        },
        right: {
          title: "What the other machine has",
          tone: "coral",
          mono: true,
          lines: [
            "Python 3.9",
            "Different packages",
            "Different system libs",
            "Different configuration",
            "",
            "Result: broken app",
          ],
        },
      },
    ],
  },
  {
    chapter: CH.what,
    title: "Package the application with everything it needs",
    badge: "DOCKER'S IDEA",
    speakerNote:
      "This single sentence is the whole of Docker. Everything else is mechanics.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Application",
          "+ Dependencies",
          "+ Runtime",
          "Docker Image",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.what,
    title: "The mental model to keep for the rest of today",
    subtitle: "A standardised way to package and run applications.",
    badge: "MENTAL MODEL",
    speakerNote:
      "Write this on the whiteboard. You'll point back at it a dozen times.",
    blocks: [
      {
        kind: "flow",
        steps: ["Docker Image", "Docker Container", "Running Application"],
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 3 — DOCKER ARCHITECTURE ========== */
  {
    chapter: CH.arch,
    title: "Image vs Container",
    subtitle: "The single most important distinction in this session.",
    badge: "CORE CONCEPT",
    speakerNote:
      "If they leave with only one idea, make it this one. Everything later depends on it.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Image",
          tone: "sky",
          lines: [
            "A packaged blueprint",
            "Built once, never runs by itself",
            "Read-only",
          ],
        },
        right: {
          title: "Container",
          tone: "orange",
          lines: [
            "A running instance of an image",
            "You can start many from one image",
            "Disposable",
          ],
        },
      },
    ],
  },
  {
    chapter: CH.arch,
    title: "Image is the recipe. Container is the meal.",
    badge: "ANALOGY",
    speakerNote:
      "One recipe, many meals. Nobody eats the recipe. That's the joke that makes it stick.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Recipe", lines: ["hello-user:1.0"], tone: "sky" },
          { title: "Meal", lines: ["container A"], tone: "orange" },
          { title: "Meal", lines: ["container B"], tone: "orange" },
        ],
      },
      {
        kind: "callout",
        text: "The same recipe can be cooked as many times as you like.",
        tone: "yellow",
      },
    ],
  },
  {
    chapter: CH.arch,
    title: "Said another way",
    badge: "ANALOGY",
    speakerNote: "Two sentences. Let them sit for a beat before moving on.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Image says",
          tone: "sky",
          lines: ["Here is exactly what should exist."],
        },
        right: {
          title: "Container says",
          tone: "orange",
          lines: ["Here is one running copy of it."],
        },
      },
    ],
  },
  {
    chapter: CH.arch,
    title: "Containers are not virtual machines",
    badge: "COMMON MIX-UP",
    speakerNote:
      "Count the layers out loud. The container stack is shorter, and that's the entire point.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Virtual Machine",
          tone: "coral",
          mono: true,
          lines: [
            "Application",
            "Libraries",
            "Guest OS",
            "Virtual Hardware",
            "Host OS",
          ],
        },
        right: {
          title: "Container",
          tone: "mint",
          mono: true,
          lines: ["Application", "Libraries", "Container", "Host OS Kernel"],
        },
      },
    ],
  },
  {
    chapter: CH.arch,
    title: "Why containers are lightweight",
    subtitle:
      "They share the host kernel instead of shipping a whole guest OS each.",
    badge: "WHY IT MATTERS",
    speakerNote:
      "Three apps, one kernel. With VMs that would be three guest operating systems.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "App A", lines: ["container"], tone: "orange" },
          { title: "App B", lines: ["container"], tone: "sky" },
          { title: "App C", lines: ["container"], tone: "yellow" },
        ],
      },
      {
        kind: "stack",
        layers: [{ label: "Shared Host Kernel", tone: "ink" }],
        caption: "one kernel, many containers",
      },
    ],
  },

  /* ========== SECTION 4 — INSTALL DOCKER ========== */
  {
    chapter: CH.install,
    title: "Install Docker Desktop",
    badge: "SETUP",
    speakerNote:
      "Give the room a few minutes here. Nothing after this works without it.",
    blocks: [
      {
        kind: "flow",
        steps: ["Install Docker Desktop", "Start Docker", "Verify it works"],
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.install,
    title: "Verify the installation",
    badge: "CHECK",
    speakerNote:
      "If this command fails, stop and fix it. Don't let anyone fall behind here.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker --version" },
          { out: "Docker version 27.3.1, build ce12230" },
        ],
      },
    ],
  },
  {
    chapter: CH.install,
    title: "When you forget a command",
    badge: "HELP",
    joke: "Documentation is just autocomplete's older sibling.",
    speakerNote:
      "Teach them to help themselves. They'll use this more than any command you show today.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker --help" },
          { comment: "every command Docker knows" },
          { cmd: "docker run --help" },
          { comment: "every flag for one command" },
        ],
      },
    ],
  },

  /* ========== SECTION 5 — YOUR FIRST CONTAINER ========== */
  {
    chapter: CH.first,
    title: "Your first container",
    subtitle: "One command. That's the whole exercise.",
    badge: "HANDS-ON",
    speakerNote: "Let them run it. The payoff moment matters more than the theory.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker run hello-world" },
          { out: "Hello from Docker!" },
          { out: "This message shows that your installation appears to be working." },
        ],
      },
    ],
  },
  {
    chapter: CH.first,
    title: "What just happened?",
    badge: "UNDER THE HOOD",
    speakerNote:
      "Six steps hid behind one command. Walk them slowly — this is the shape of every run.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "docker run",
          "Check for image locally",
          "Not found",
          "Download image",
          "Create container",
          "Container runs",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.first,
    title: "The container lifecycle",
    subtitle: "Every container you ever run moves through these states.",
    badge: "LIFECYCLE",
    speakerNote:
      "Point out that stop and remove are different steps. That trips people up later.",
    blocks: [
      {
        kind: "flow",
        steps: ["Image", "Create", "Start", "Running", "Stop", "Remove"],
        orientation: "horizontal",
      },
    ],
  },

  /* ========== SECTION 6 — BASIC DOCKER COMMANDS ========== */
  {
    chapter: CH.commands,
    title: "See what's running",
    badge: "docker ps",
    speakerNote: "The command they'll type most often for the rest of their career.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker ps" },
          { out: "CONTAINER ID   IMAGE            STATUS         NAMES" },
          { out: "3f2b9c1a7e40   hello-user:1.0   Up 2 minutes   hello-user" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "See everything, including what stopped",
    badge: "docker ps -a",
    joke: "Yes, Docker remembers your mistakes.",
    speakerNote:
      "Good moment to show how fast stopped containers pile up on a real machine.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker ps -a" },
          { out: "CONTAINER ID   IMAGE         STATUS                     NAMES" },
          { out: "3f2b9c1a7e40   hello-user    Up 2 minutes               hello-user" },
          { out: "9a1c4d8b2f11   hello-world   Exited (0) 6 minutes ago   nifty_bell" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "See the images you've collected",
    badge: "docker images",
    speakerNote: "Images and containers are different lists. Keep hammering that.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker images" },
          { out: "IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA" },
          { out: "hello-world:latest   96498ffd522e       25.9kB         9.49kB   U" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "Stop a container",
    badge: "docker stop",
    speakerNote: "Stopping is not deleting. Say it now, prove it on the next slide.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker stop <container>" },
          { comment: "for example" },
          { cmd: "docker stop hello-user" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "Start it back up",
    subtitle: "Stopped does not mean deleted.",
    badge: "docker start",
    speakerNote:
      "Run stop then start live. Seeing the same container come back makes the point.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker start hello-user" },
          { out: "hello-user" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "Remove a container",
    badge: "docker rm",
    speakerNote: "This is the one that actually deletes. It must be stopped first.",
    blocks: [
      {
        kind: "terminal",
        lines: [{ cmd: "docker rm hello-user" }, { out: "hello-user" }],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "Remove an image",
    badge: "docker rmi",
    speakerNote:
      "rm removes containers, rmi removes images. The extra i is for image.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker rmi hello-user:1.0" },
          { out: "Untagged: hello-user:1.0" },
        ],
      },
    ],
  },
  {
    chapter: CH.commands,
    title: "The commands that become muscle memory",
    subtitle: "Eventually.",
    badge: "SUMMARY",
    speakerNote:
      "Tell them not to memorise. Repetition over the next two sessions will do it for them.",
    blocks: [
      {
        kind: "cheatsheet",
        groups: [
          { title: "Look around", commands: ["docker ps", "docker images"] },
          {
            title: "Run and control",
            commands: ["docker run", "docker start", "docker stop"],
          },
          { title: "Clean up", commands: ["docker rm", "docker rmi"] },
        ],
      },
    ],
  },

  /* ========== SECTION 7 — PROJECT 1: HELLO USER ========== */
  {
    chapter: CH.app,
    title: "Project 1: Hello User",
    subtitle: "Lehar Loom wants a tiny internal app: type a name, click Submit, get a greeting.",
    badge: "THE BRIEF",
    speakerNote:
      "Deliberately trivial. The app is not the lesson — packaging it, then shrinking it, is.",
    blocks: [
      {
        kind: "mockup",
        title: "Hello User",
        fields: ["Enter your name"],
        button: "Submit",
        result: "Hello, Raviteja!",
      },
    ],
  },
  {
    chapter: CH.app,
    title: "Two files. That's the whole application.",
    badge: "PROJECT",
    speakerNote: "The Dockerfile comes later. Right now it's just an app.",
    blocks: [
      {
        kind: "code",
        filename: "hello-user/",
        language: "text",
        code: "hello-user/\n├── app.py\n└── requirements.txt",
      },
    ],
  },
  {
    chapter: CH.app,
    title: "app.py",
    subtitle: "A text box, a Submit button, and a greeting.",
    badge: "CODE",
    speakerNote:
      "st.button returns True only on the rerun triggered by the click — that's why the greeting waits for Submit.",
    blocks: [
      {
        kind: "code",
        filename: "app.py",
        language: "python",
        code: `import streamlit as st

st.title("Hello User")

name = st.text_input("Enter your name")

if st.button("Submit"):
    st.write(f"Hello, {name}!")`,
      },
    ],
  },
  {
    chapter: CH.app,
    title: "requirements.txt",
    subtitle: "One line. That's all the application needs — for now.",
    badge: "CODE",
    speakerNote:
      "Flag 'for now'. Dependency lists are exactly what grows and breaks.",
    blocks: [
      {
        kind: "code",
        filename: "requirements.txt",
        language: "text",
        code: "streamlit",
      },
    ],
  },
  {
    chapter: CH.app,
    title: "Run it the normal way first",
    subtitle: "No Docker yet. This works on Sam's machine.",
    badge: "WITHOUT DOCKER",
    speakerNote:
      "Establish the baseline so the contrast lands on the next slide.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "pip install -r requirements.txt" },
          { cmd: "streamlit run app.py" },
          { out: "You can now view your Streamlit app in your browser." },
        ],
      },
    ],
  },
  {
    chapter: CH.app,
    title: '"It works on my machine."',
    subtitle: "Anyone else needs all of this set up first.",
    badge: "AND WE'RE BACK",
    speakerNote:
      "Callback to Session 1's title. This is the emotional hinge of the session.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Python installed",
          "pip installed",
          "Streamlit installed",
          "Correct versions",
          "Correct system environment",
        ],
        columns: 2,
        tone: "coral",
      },
    ],
  },

  /* ========== SECTION 8 — INTRODUCING THE DOCKERFILE ========== */
  {
    chapter: CH.dockerfile,
    title: "Meet the Dockerfile",
    subtitle: "A text file of instructions for building an image.",
    badge: "NEW CONCEPT",
    speakerNote:
      'Frame it as a message to Docker: "here is how to build my environment."',
    blocks: [
      {
        kind: "callout",
        text: "Docker, here is how to build my application environment.",
        tone: "sky",
        label: "Think",
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "Our first Dockerfile",
    subtitle: "Start from a general-purpose OS and install everything by hand.",
    badge: "hello-user:1.0",
    speakerNote:
      "Show the whole thing once, then take it apart line by line. It lives in docker-files/Dockerfile.ubuntu.",
    blocks: [
      {
        kind: "code",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: `FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3 python3-pip

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY app.py .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]`,
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "FROM — where the image starts",
    badge: "INSTRUCTION",
    speakerNote:
      "Stress this: Ubuntu here is a filesystem to build on, NOT a virtual machine.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: "FROM ubuntu:22.04",
        notes: [
          {
            label: "FROM",
            text: "Defines the starting point for our image — the base we build on top of.",
          },
          {
            label: "Careful",
            text: "Ubuntu here is a base image and filesystem, not a virtual machine.",
          },
          {
            label: "Why 22.04?",
            text: "Pinned on purpose. The next slide shows what happens without it.",
          },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "Why not just FROM ubuntu?",
    subtitle: "Because the newest Ubuntu refuses this Dockerfile.",
    badge: "REAL-WORLD LESSON",
    speakerNote:
      "Current Ubuntu blocks system-wide pip installs (PEP 668). An unpinned base changed underneath the Dockerfile — exactly the drift Docker should protect you from.",
    blocks: [
      {
        kind: "terminal",
        title: "FROM ubuntu (latest)",
        lines: [
          { cmd: "docker build -t hello-user:1.0 ." },
          { out: "error: externally-managed-environment" },
          { out: "hint: See PEP 668 for the detailed specification." },
        ],
      },
      {
        kind: "split",
        left: {
          title: "Fix 1: pin the base",
          tone: "mint",
          mono: true,
          lines: ["FROM ubuntu:22.04"],
          note: "Dockerfile.ubuntu — the better fix",
        },
        right: {
          title: "Fix 2: override pip",
          tone: "yellow",
          mono: true,
          lines: ["RUN pip3 install \\", "  --break-system-packages \\", "  -r requirements.txt"],
          note: "Dockerfile.ubuntu-latest",
        },
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "RUN — do something while building",
    badge: "INSTRUCTION",
    speakerNote:
      "RUN happens at build time, not when the container starts. That distinction matters.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: `RUN apt-get update
RUN apt-get install -y python3 python3-pip`,
        notes: [
          {
            label: "RUN",
            text: "Executes a command while the image is being built, and keeps the result.",
          },
          { label: "When", text: "Build time — not when the container starts." },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "WORKDIR — pick a directory to work in",
    badge: "INSTRUCTION",
    speakerNote: "Without it everything lands in / and the image gets messy fast.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: "WORKDIR /app",
        notes: [
          {
            label: "WORKDIR",
            text: "Sets the working directory inside the image and container.",
          },
          {
            label: "Effect",
            text: "Instead of working from /, everything after this happens in /app.",
          },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "COPY — bring your files in",
    badge: "INSTRUCTION",
    speakerNote:
      "Ask why requirements.txt is copied before app.py. We prove the answer with a stopwatch in section 11.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: `COPY requirements.txt .

COPY app.py .`,
        notes: [
          { label: "COPY", text: "Copies files from your project folder into the image." },
          {
            label: "Order",
            text: "Requirements come first so the slow install can be reused when only app.py changes.",
          },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "EXPOSE — document the port",
    badge: "INSTRUCTION",
    speakerNote:
      "A frequent misunderstanding: EXPOSE alone does not make the app reachable.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: "EXPOSE 8501",
        notes: [
          { label: "EXPOSE", text: "Records which port the app listens on — documentation for humans and tools." },
          { label: "It doesn't publish", text: "You still need -p 8501:8501 when you run the container." },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "CMD — what to do on startup",
    badge: "INSTRUCTION",
    speakerNote:
      '"Container, when you wake up, do this." That line does a lot of teaching.',
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile.ubuntu",
        language: "dockerfile",
        code: 'CMD ["streamlit", "run", "app.py",\n     "--server.address=0.0.0.0"]',
        notes: [
          { label: "CMD", text: "The default command run when a container starts from this image." },
          { label: "0.0.0.0", text: "Listen on every interface, or the browser outside the container can't reach it." },
        ],
      },
    ],
  },
  {
    chapter: CH.dockerfile,
    title: "The shape every Dockerfile follows",
    badge: "MENTAL MODEL",
    speakerNote:
      "Once they see the shape, unfamiliar Dockerfiles stop being intimidating.",
    blocks: [
      {
        kind: "flow",
        steps: ["FROM", "Install", "Configure", "Copy files", "Install deps", "Start app"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 9 — BUILD THE IMAGE ========== */
  {
    chapter: CH.build,
    title: "Build the image",
    badge: "HANDS-ON",
    speakerNote:
      "Run from inside hello-user/. The Ubuntu Dockerfile lives next door in docker-files/, hence -f. Budget a couple of minutes — this build is slow, and that becomes a point later.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker build -f ../docker-files/Dockerfile.ubuntu -t hello-user:1.0 ." },
          { comment: "took 142 s in our test run — remember that" },
        ],
      },
    ],
  },
  {
    chapter: CH.build,
    title: "Breaking that command apart",
    badge: "ANATOMY",
    speakerNote:
      "The trailing dot confuses everyone the first time. Spend a moment on it.",
    blocks: [
      {
        kind: "annotated",
        language: "bash",
        code: "docker build \\\n  -f ../docker-files/Dockerfile.ubuntu \\\n  -t hello-user:1.0 .",
        notes: [
          { label: "-f", text: "Which Dockerfile to use. Without it, Docker looks for ./Dockerfile." },
          { label: "-t hello-user:1.0", text: "Give the image a name and a tag." },
          {
            label: "the dot",
            text: "The build context — the files Docker is allowed to copy.",
          },
        ],
      },
    ],
  },
  {
    chapter: CH.build,
    title: "What build actually does",
    badge: "PROCESS",
    speakerNote: "Dockerfile plus your files goes in. An image comes out.",
    blocks: [
      {
        kind: "flow",
        steps: ["Dockerfile + app files", "docker build", "Docker Image"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 10 — RUN OUR APPLICATION ========== */
  {
    chapter: CH.run,
    title: "Run the container",
    badge: "HANDS-ON",
    speakerNote: "This is the moment their own app runs in a container. Let it land.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker run -p 8501:8501 hello-user:1.0" },
          { out: "You can now view your Streamlit app in your browser." },
          { out: "URL: http://0.0.0.0:8501" },
        ],
      },
    ],
  },
  {
    chapter: CH.run,
    title: "What does -p mean?",
    badge: "PORTS",
    speakerNote:
      "Left of the colon is your machine. Right is inside the container. Always.",
    blocks: [
      {
        kind: "annotated",
        language: "bash",
        code: "-p 8501:8501",
        notes: [
          { label: "left side", text: "The port on your machine — localhost:8501." },
          { label: "right side", text: "The port inside the container (the one EXPOSE documented)." },
          { label: "Result", text: "Traffic to localhost:8501 is forwarded into the container." },
        ],
      },
    ],
  },
  {
    chapter: CH.run,
    title: "Port mapping, drawn out",
    badge: "DIAGRAM",
    speakerNote:
      "Without the mapping the app runs but nothing can reach it. Common first bug.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Your browser", lines: ["localhost:8501"], tone: "sky" },
          { title: "Docker container", lines: ["Streamlit", "port 8501"], tone: "orange" },
        ],
        connector: "-p 8501:8501",
      },
    ],
  },
  {
    chapter: CH.run,
    title: "It's running",
    subtitle: "Open http://localhost:8501, type a name, click Submit.",
    badge: "PAYOFF",
    speakerNote:
      "Everyone should see this on their own screen before you move on.",
    blocks: [
      {
        kind: "mockup",
        title: "localhost:8501",
        fields: ["Enter your name"],
        button: "Submit",
        result: "Hello, Raviteja!",
      },
    ],
  },
  {
    chapter: CH.run,
    title: "What we just accomplished",
    subtitle: "This is the fundamental Docker workflow, start to finish.",
    badge: "MILESTONE",
    speakerNote:
      "Halfway point. Take a breath here and let them feel the progress.",
    blocks: [
      {
        kind: "flow",
        steps: ["app.py", "Dockerfile", "Image", "Container", "Running app"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 11 — SHRINK SIZE AND BUILD TIME ========== */
  {
    chapter: CH.optimize,
    title: "But there is a problem",
    subtitle: "A seven-line app, and look what it cost.",
    badge: "PROBLEM",
    speakerNote:
      "Both numbers matter: the size ships to every machine, and the build time is paid on every change.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "hello-user:1.0", lines: ["1.59 GB on disk", "142 s to build"], tone: "coral" },
        ],
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Do we actually need Ubuntu?",
    subtitle: "What does this application really require?",
    badge: "QUESTION",
    speakerNote:
      "Let them answer. They'll usually get there themselves: just Python.",
    blocks: [
      {
        kind: "bullets",
        items: ["Python", "pip", "Python packages", "Our application"],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Start from a better base image",
    subtitle: "Images can be built from other images — Python publishes official ones.",
    badge: "SOLUTION",
    speakerNote: "Someone already did the work of putting Python in an image.",
    blocks: [
      {
        kind: "code",
        filename: "Dockerfile",
        language: "dockerfile",
        code: "FROM python:3.12-slim",
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "The optimised Dockerfile",
    badge: "hello-user:2.0",
    speakerNote:
      "Same application. No apt-get, no manual Python install, and one new flag on pip.",
    blocks: [
      {
        kind: "code",
        filename: "Dockerfile",
        language: "dockerfile",
        code: `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]`,
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Two changes did the work",
    badge: "TECHNIQUES",
    speakerNote:
      "Name each technique separately — the next slide measures them one at a time.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "A smaller base image",
          tone: "sky",
          lines: [
            "ubuntu:22.04 → python:3.12-slim",
            "Python is already installed",
            "No apt-get steps at all",
          ],
        },
        right: {
          title: "pip install --no-cache-dir",
          tone: "mint",
          lines: [
            "pip normally keeps a download cache",
            "Inside an image it's dead weight",
            "Skip it and the layer shrinks",
          ],
        },
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Measure it",
    badge: "PROOF",
    speakerNote:
      "Run this live with both images built. The number does the convincing.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker images hello-user" },
          { out: "IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA" },
          { out: "hello-user:1.0   e164ae3b4352       1.59GB          461MB" },
          { out: "hello-user:2.0   61b6ac39ed37        791MB          182MB" },
          { comment: "disk usage = unpacked on your machine; content size = what gets downloaded" },
        ],
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Each change, measured",
    subtitle: "Size and build time, one technique at a time.",
    badge: "MEASURED",
    speakerNote:
      "Numbers from one machine. Yours will differ — the ratios won't. Half the size, and a build almost three times faster.",
    blocks: [
      {
        kind: "table",
        columns: ["Dockerfile", "Disk usage", "Download size", "Build time"],
        columnTones: ["ink", "sky", "yellow", "mint"],
        rows: [
          ["ubuntu:22.04 base", "1.59 GB", "461 MB", "142 s"],
          ["python:3.12-slim base", "1.02 GB", "296 MB", "59 s"],
          ["+ pip --no-cache-dir", "791 MB", "182 MB", "51 s"],
        ],
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Why smaller images are worth chasing",
    badge: "TRADE-OFFS",
    speakerNote:
      "Then immediately temper it — smaller is not automatically better.",
    blocks: [
      {
        kind: "bullets",
        items: ["Less storage", "Faster transfers", "Faster pulls", "Faster deployments"],
        columns: 2,
        tone: "mint",
      },
      {
        kind: "callout",
        text: "Smaller is not automatically better. You still need the dependencies your app actually requires.",
        tone: "yellow",
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Build time: the cost you pay on every change",
    subtitle: "Layer order decides whether a rebuild takes seconds or minutes.",
    badge: "RUNTIME",
    speakerNote:
      "Docker caches each instruction. Change a file, and every layer from its COPY onwards rebuilds. Put the slow, rarely-changing step first.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Good order — Dockerfile",
          tone: "mint",
          mono: true,
          lines: ["COPY requirements.txt .", "RUN pip install ...", "COPY app.py ."],
          note: "Edit app.py → the install is reused",
        },
        right: {
          title: "Bad order — Dockerfile.cache-demo",
          tone: "coral",
          mono: true,
          lines: ["COPY . .", "RUN pip install ..."],
          note: "Edit app.py → the install runs again",
        },
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Change one line of app.py, then rebuild",
    badge: "MEASURED",
    speakerNote:
      "Do this live: edit app.py, rebuild both. The difference is the whole argument for layer order.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker build -t hello-user:2.0 ." },
          { out: "=> CACHED [4/5] RUN pip install --no-cache-dir -r requirements.txt" },
          { comment: "rebuilt in 1.5 s" },
          { cmd: "docker build -f ../docker-files/Dockerfile.cache-demo -t hello-user:cache-demo ." },
          { out: "=> [4/4] RUN pip install --no-cache-dir -r requirements.txt" },
          { comment: "installs everything again — rebuilt in 55 s" },
        ],
      },
    ],
  },
  {
    chapter: CH.optimize,
    title: "Measure. Don't assume.",
    subtitle: "A rule that outlives this session.",
    badge: "DEVELOPER RULE",
    speakerNote:
      "This is the transferable lesson of the whole section. Say it plainly.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Don't say",
          tone: "coral",
          lines: ["This image must be smaller.", "This build must be faster."],
        },
        right: {
          title: "Do this",
          tone: "mint",
          mono: true,
          lines: ["docker images", "time the build", "", "then find out."],
        },
      },
    ],
  },

  /* ========== SECTION 12 — TAGS ========== */
  {
    chapter: CH.tags,
    title: "What's this bit?",
    subtitle: "We've been writing it since the first build.",
    badge: "TAGS",
    speakerNote: "The 1.0 has been there all along. Now name it.",
    blocks: [
      {
        kind: "annotated",
        language: "bash",
        code: "hello-user:1.0",
        notes: [
          { label: "hello-user", text: "The repository — the image's name." },
          { label: "1.0", text: "The tag — which version of that image." },
        ],
      },
    ],
  },
  {
    chapter: CH.tags,
    title: "How image names are shaped",
    badge: "NAMING",
    speakerNote: "repository:tag. Every image reference follows this shape.",
    blocks: [
      {
        kind: "flow",
        steps: ["repository", ":", "tag"],
        orientation: "horizontal",
      },
      {
        kind: "callout",
        text: "hello-user:1.0    hello-user:2.0    python:3.12-slim",
        tone: "sky",
        label: "Examples",
      },
    ],
  },
  {
    chapter: CH.tags,
    title: "Why tags matter",
    subtitle: "With versions, you always know what's actually running.",
    badge: "VERSIONING",
    speakerNote:
      "Ask what happens in production when nobody knows which build is live.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "hello-user:1.0", lines: ["Ubuntu build"], tone: "ink" },
          { title: "hello-user:2.0", lines: ["slim rebuild"], tone: "orange" },
          { title: "hello-user:cache-demo", lines: ["experiment"], tone: "sky" },
        ],
      },
    ],
  },
  {
    chapter: CH.tags,
    title: "latest does not mean newest",
    badge: "THE TRAP",
    joke: "'latest' is not a versioning strategy.",
    speakerNote:
      "This bites everyone eventually. It's just a default tag name, nothing more.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "What people assume",
          tone: "coral",
          lines: ["latest = the newest build", "always up to date"],
        },
        right: {
          title: "What it actually is",
          tone: "mint",
          lines: [
            "A tag named 'latest'",
            "Points wherever it was last pointed",
            "Nothing updates it for you",
          ],
        },
      },
    ],
  },
  {
    chapter: CH.tags,
    title: "Adding another tag",
    subtitle: "One image can answer to several names.",
    badge: "docker tag",
    speakerNote: "No rebuild, no copy. It's a second label on the same image.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker tag hello-user:2.0 hello-user:stable" },
          { comment: "same image, two names" },
        ],
      },
    ],
  },

  /* ========== SECTION 13 — PROJECT 2: SQLITE BLOG ========== */
  {
    chapter: CH.data,
    title: "Containers have a problem",
    subtitle: "They're designed to be replaceable. Data usually isn't.",
    badge: "PROBLEM",
    speakerNote:
      "Ask the room what happens to a database when its container is deleted. Then prove it.",
    blocks: [
      {
        kind: "bullets",
        items: ["Database", "User uploads", "Application data", "Logs"],
        columns: 2,
        tone: "coral",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Project 2: a tiny blog",
    subtitle: "Flask for the pages, SQLite for the posts. One container, no volume.",
    badge: "THE BRIEF",
    speakerNote:
      "Deliberately no volume. This project exists to lose its data on camera.",
    blocks: [
      {
        kind: "mockup",
        title: "Docker Blog — localhost:5000",
        fields: ["Title", "Author", "Content"],
        button: "Publish",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Where the posts are stored",
    subtitle: "Every post is a row in one SQLite file: /app/data/blog.db",
    badge: "SQLITE",
    speakerNote:
      "SQLite is a whole database in a single file. Python's built-in sqlite3 module reads and writes it — no database server.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Flask app", lines: ["gunicorn :5000"], tone: "orange" },
          { title: "data/blog.db", lines: ["SQLite file", "inside the container"], tone: "coral" },
        ],
        connector: "writes to",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "The blog's Dockerfile",
    badge: "CODE",
    speakerNote:
      "Mostly familiar from Project 1. The next slide zooms in on the part that matters today.",
    blocks: [
      {
        kind: "code",
        filename: "Dockerfile",
        language: "dockerfile",
        code: `FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home appuser \\
    && mkdir -p /app/data \\
    && chown -R appuser:appuser /app/data
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", \\
     "--limit-request-field_size", "32768", "app:app"]`,
      },
    ],
  },
  {
    chapter: CH.data,
    title: "What's deliberately missing",
    badge: "BY DESIGN",
    speakerNote:
      "No VOLUME and no -v. The database is written into the container's own writable layer.",
    blocks: [
      {
        kind: "annotated",
        filename: "Dockerfile",
        language: "dockerfile",
        code: `RUN useradd --create-home appuser \\
    && mkdir -p /app/data \\
    && chown -R appuser:appuser /app/data
USER appuser`,
        notes: [
          { label: "/app/data", text: "Where blog.db is created — inside the container." },
          { label: "No VOLUME", text: "On purpose. Nothing here survives docker rm." },
          { label: ".dockerignore", text: "Excludes data/ and *.db, so a local database never sneaks into the image." },
          { label: "USER appuser", text: "Runs as a non-root user. More on that in Session 4." },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Build it, run it, write some posts",
    badge: "HANDS-ON",
    speakerNote:
      "Publish two posts in the browser before moving on. You'll need them in a minute.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker build -t docker-blog ." },
          { cmd: "docker run -d --name blog -p 5000:5000 docker-blog" },
          { comment: "open http://localhost:5000 and publish two posts" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Find the database inside the container",
    badge: "docker exec",
    speakerNote:
      "docker exec runs a command inside a running container. Here: list the data folder.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker exec blog ls -l /app/data" },
          { out: "total 12" },
          { out: "-rw-r--r-- 1 appuser appuser 12288 Sep 10 17:53 blog.db" },
        ],
      },
      {
        kind: "callout",
        text: "Git Bash rewrites paths like /app/data. Use PowerShell, or prefix the command with MSYS_NO_PATHCONV=1.",
        tone: "yellow",
        label: "Windows",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Query it",
    subtitle: "Python 3.12+ ships a SQLite shell: python -m sqlite3",
    badge: "docker exec",
    speakerNote: "Proof the posts really are rows in that file.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: `docker exec blog python -m sqlite3 /app/data/blog.db "SELECT id, title, author FROM posts"` },
          { out: "(1, 'Hello Docker', 'Raviteja')" },
          { out: "(2, 'Where does my data live?', 'Raviteja')" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "What changed inside the container?",
    subtitle: "docker diff compares the container with its image.",
    badge: "docker diff",
    speakerNote:
      "A = added, C = changed. This list is the container's writable layer. It belongs to this container only.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker diff blog" },
          { out: "C /app" },
          { out: "C /app/data" },
          { out: "A /app/data/blog.db" },
          { comment: "A = added   C = changed" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Stop and start: the posts survive",
    subtitle: "Stopping doesn't delete the writable layer.",
    badge: "NOT YET",
    speakerNote:
      "Important nuance — students often think stop loses data. It doesn't. Removing does.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker stop blog" },
          { cmd: "docker start blog" },
          { cmd: `docker exec blog python -m sqlite3 /app/data/blog.db "SELECT COUNT(*) FROM posts"` },
          { out: "(2,)" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Now remove the container",
    subtitle: "Same image. Brand-new container.",
    badge: "THE TEST",
    speakerNote: "Do this live, then refresh the browser.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker rm -f blog" },
          { out: "blog" },
          { cmd: "docker run -d --name blog -p 5000:5000 docker-blog" },
          { cmd: `docker exec blog python -m sqlite3 /app/data/blog.db "SELECT COUNT(*) FROM posts"` },
          { out: "(0,)" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "The posts are gone",
    badge: "DATA LOSS",
    joke: "Your posts had a great life. It lasted exactly one container.",
    speakerNote:
      "Let the room see the empty blog. blog.db was deleted along with the container's writable layer.",
    blocks: [
      {
        kind: "statement",
        text: "No posts yet.",
        sub: "blog.db lived in the container's writable layer — and was deleted with it.",
        tone: "coral",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "What happens to the posts?",
    badge: "SUMMARY",
    speakerNote: "The whole lesson of Project 2 in four rows.",
    blocks: [
      {
        kind: "table",
        columns: ["Action", "The posts"],
        columnTones: ["ink", "orange"],
        rows: [
          ["docker stop / docker start", "Kept — same container, same file"],
          ["docker restart", "Kept"],
          ["docker rm", "Gone forever"],
          ["docker run (a new container)", "Starts empty"],
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "A container carries its own filesystem",
    subtitle: "Remove the container and anything stored only there goes with it.",
    badge: "WHY",
    speakerNote: "This is the moment volumes start to feel necessary.",
    blocks: [
      {
        kind: "stack",
        layers: [
          { label: "Application", tone: "sky" },
          { label: "Libraries", tone: "ink" },
          { label: "Files", tone: "ink" },
          { label: "blog.db", tone: "coral" },
        ],
        caption: "delete the container, delete the lot",
      },
    ],
  },
  {
    chapter: CH.data,
    title: "Two containers, two separate blogs",
    subtitle: "Each container gets its own writable layer.",
    badge: "BONUS",
    speakerNote:
      "The footer of each page shows the container ID that served it. Write a post on one — it never appears on the other.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker run -d --name blog1 -p 5001:5000 docker-blog" },
          { cmd: "docker run -d --name blog2 -p 5002:5000 docker-blog" },
          { comment: "a post on :5001 never appears on :5002" },
        ],
      },
    ],
  },
  {
    chapter: CH.data,
    title: "We need storage that outlives the container",
    subtitle: "Volumes store data outside the container's writable layer.",
    badge: "SOLUTION",
    speakerNote: "The container becomes disposable again — which is the point. Project 3 proves it.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Container", lines: ["disposable"], tone: "orange" },
          { title: "Volume", lines: ["persistent data"], tone: "mint" },
        ],
        connector: "writes to",
      },
    ],
  },

  /* ========== SECTION 14 — PROJECT 3: MYSQL + VOLUME ========== */
  {
    chapter: CH.volumes,
    title: "Project 3: a database that keeps its data",
    badge: "THE BRIEF",
    speakerNote: "Same problem as the blog — this time with a volume from the start.",
    blocks: [
      {
        kind: "statement",
        text: "MySQL",
        sub: "Running in a container, storing its data in a named volume.",
        tone: "sky",
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Create a volume",
    badge: "HANDS-ON",
    speakerNote: "Volumes are their own objects, separate from containers and images.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker volume create blog-mysql-data" },
          { out: "blog-mysql-data" },
          { cmd: "docker volume ls" },
          { out: "DRIVER    VOLUME NAME" },
          { out: "local     blog-mysql-data" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Start MySQL with the volume attached",
    badge: "HANDS-ON",
    speakerNote:
      "Long command. Walk the flags on the next slide rather than here.",
    blocks: [
      {
        kind: "code",
        filename: "terminal",
        language: "bash",
        code: `docker run -d \\
  --name blog-mysql \\
  -e MYSQL_ROOT_PASSWORD=rootpass \\
  -e MYSQL_DATABASE=blogdb \\
  -e MYSQL_USER=bloguser \\
  -e MYSQL_PASSWORD=blogpass \\
  -v blog-mysql-data:/var/lib/mysql \\
  mysql:8.0`,
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "What's happening there?",
    badge: "ANATOMY",
    speakerNote: "-v is the one that matters today. The -e values only apply the first time.",
    blocks: [
      {
        kind: "annotated",
        language: "bash",
        code: `-d
--name blog-mysql
-e MYSQL_DATABASE=blogdb
-e MYSQL_USER=bloguser
-v blog-mysql-data:/var/lib/mysql`,
        notes: [
          { label: "-d", text: "Run in the background." },
          { label: "--name", text: "A name you can type instead of a container ID." },
          { label: "-e", text: "Settings MySQL reads on its first start: passwords, a database, a user." },
          { label: "-v", text: "Mount the volume at MySQL's data directory." },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "The important part",
    badge: "-v",
    speakerNote:
      "Same shape as -p: name on the left, path inside the container on the right.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "blog-mysql-data", lines: ["the volume"], tone: "mint" },
          { title: "/var/lib/mysql", lines: ["path in container"], tone: "orange" },
        ],
        connector: "mounted at",
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Wait until MySQL is ready",
    subtitle: "The first start initialises the empty volume.",
    badge: "docker logs",
    speakerNote:
      "Around 20 seconds the first time. Connecting before this line appears is the most common failure.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker logs -f blog-mysql" },
          { out: "… /usr/sbin/mysqld: ready for connections. Version: '8.0.46' … port: 3306" },
          { comment: "about 18 s on the first start in our test" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Open a MySQL shell",
    subtitle: "docker exec -it gives you an interactive session inside the container.",
    badge: "docker exec -it",
    speakerNote:
      "The password warning is expected — typing a password on the command line is fine for a workshop.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker exec -it blog-mysql mysql -u bloguser -pblogpass blogdb" },
          { out: "mysql: [Warning] Using a password on the command line interface can be insecure." },
          { comment: "…welcome banner…" },
          { out: "mysql>" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Store some data",
    subtitle: "Typed at the mysql> prompt.",
    badge: "SQL",
    speakerNote: "The same posts table the blog would use. Two rows is plenty.",
    blocks: [
      {
        kind: "code",
        filename: "mysql>",
        language: "sql",
        code: `CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, author, content) VALUES
  ('Hello Docker', 'Raviteja', 'My first post'),
  ('Volumes are magic', 'Raviteja', 'This row should survive');`,
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Check it",
    badge: "SQL",
    speakerNote: "Remember these two rows. We're about to delete the container they live in.",
    blocks: [
      {
        kind: "terminal",
        title: "mysql",
        lines: [
          { out: "mysql> SELECT id, title, author FROM posts;" },
          { out: "+----+-------------------+----------+" },
          { out: "| id | title             | author   |" },
          { out: "+----+-------------------+----------+" },
          { out: "|  1 | Hello Docker      | Raviteja |" },
          { out: "|  2 | Volumes are magic | Raviteja |" },
          { out: "+----+-------------------+----------+" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Now delete the container",
    subtitle: "The container is gone. The volume is not.",
    badge: "THE TEST",
    speakerNote: "Type exit to leave the shell first. Then do this live — the demo is the whole argument.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker rm -f blog-mysql" },
          { out: "blog-mysql" },
          { cmd: "docker volume ls" },
          { out: "local     blog-mysql-data" },
          { comment: "still there" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Start MySQL again with the same volume",
    subtitle: "New container. Same volume. Exactly the same command.",
    badge: "THE PAYOFF",
    speakerNote: "This time it's ready in a few seconds — there's nothing to initialise.",
    blocks: [
      {
        kind: "code",
        filename: "terminal",
        language: "bash",
        code: `docker run -d \\
  --name blog-mysql \\
  -e MYSQL_ROOT_PASSWORD=rootpass \\
  -e MYSQL_DATABASE=blogdb \\
  -e MYSQL_USER=bloguser \\
  -e MYSQL_PASSWORD=blogpass \\
  -v blog-mysql-data:/var/lib/mysql \\
  mysql:8.0`,
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "The data is still there",
    badge: "PROOF",
    speakerNote:
      "Seeing the rows survive is the moment. Compare with the blog's empty page.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker exec -it blog-mysql mysql -u bloguser -pblogpass blogdb" },
          { out: "mysql> SELECT id, title, author FROM posts;" },
          { out: "+----+-------------------+----------+" },
          { out: "| id | title             | author   |" },
          { out: "+----+-------------------+----------+" },
          { out: "|  1 | Hello Docker      | Raviteja |" },
          { out: "|  2 | Volumes are magic | Raviteja |" },
          { out: "+----+-------------------+----------+" },
        ],
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Project 2 vs Project 3",
    subtitle: "The difference is one flag.",
    badge: "COMPARE",
    speakerNote:
      "Tie the two projects together. Same idea — a database file — different fate.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "SQLite blog — no volume",
          tone: "coral",
          mono: true,
          lines: ["docker run ... \\", "  docker-blog   (no -v)", "", "docker rm → posts gone"],
        },
        right: {
          title: "MySQL — with a volume",
          tone: "mint",
          mono: true,
          lines: ["docker run ... \\", "  -v blog-mysql-data:/var/lib/mysql", "", "docker rm → rows kept"],
        },
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Container vs Volume",
    badge: "COMPARE",
    speakerNote: "Two different lifetimes. That's the concept to leave them with.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Container",
          tone: "orange",
          lines: ["Replaceable", "Disposable", "Temporary runtime"],
        },
        right: {
          title: "Volume",
          tone: "mint",
          lines: ["Persistent", "Independent", "Stores what matters"],
        },
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "The named volume model",
    badge: "MENTAL MODEL",
    speakerNote: "Container writes to a path; the path is backed by a named volume.",
    blocks: [
      {
        kind: "flow",
        steps: ["Container", "/var/lib/mysql", "Volume: blog-mysql-data"],
        highlightLast: true,
        tone: "mint",
      },
    ],
  },
  {
    chapter: CH.volumes,
    title: "Named volumes vs bind mounts",
    subtitle: "Today is named volumes. Bind mounts arrive in Session 3.",
    badge: "DISTINCTION",
    speakerNote:
      "Name the difference now so it isn't a surprise next session, then move on.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Named volume",
          tone: "mint",
          lines: ["Managed by Docker", "Database data", "Persistent application data"],
          note: "What we're using today",
        },
        right: {
          title: "Bind mount",
          tone: "sky",
          lines: ["A host directory mounted in", "Development", "Source-code sync"],
          note: "Session 3",
        },
      },
    ],
  },

  /* ========== SECTION 16 — DOCKER HUB ========== */
  {
    chapter: CH.hub,
    title: "We built an image. It's on one laptop.",
    subtitle: "So how does anybody else get it?",
    badge: "THE GAP",
    speakerNote: "Set up the need before naming the solution.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          {
            title: "Sam's laptop",
            lines: ["hello-user:2.0"],
            tone: "orange",
          },
          { title: "Everyone else", lines: ["nothing"], tone: "ink" },
        ],
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "Docker Hub",
    subtitle: "A public registry for images — GitHub, but for containers.",
    badge: "REGISTRY",
    speakerNote: "The GitHub comparison does most of the explaining for you.",
    blocks: [
      {
        kind: "statement",
        text: "GitHub for container images",
        tone: "sky",
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "How images travel",
    badge: "DISTRIBUTION",
    speakerNote: "Push up, pull down. Two verbs, one registry in the middle.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Sam's machine",
          "docker push",
          "Docker Hub",
          "docker pull",
          "Another developer",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "Log in",
    badge: "HANDS-ON",
    speakerNote: "They'll need a free Docker Hub account. Flag it before the session.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker login" },
          { out: "Username: raviteja" },
          { out: "Login Succeeded" },
        ],
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "Tag it for Docker Hub",
    subtitle: "The image name has to start with your username.",
    badge: "HANDS-ON",
    speakerNote:
      "This is where most first pushes fail. The username prefix is required.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker tag hello-user:2.0 raviteja/hello-user:2.0" },
          { comment: "username/repository:tag" },
        ],
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "Push",
    badge: "HANDS-ON",
    speakerNote: "Watch the layers upload. Good moment to mention layer reuse.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker push raviteja/hello-user:2.0" },
          { out: "The push refers to repository [docker.io/raviteja/hello-user]" },
          { out: "2.0: digest: sha256:9f2c... size: 1783" },
        ],
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "Anyone can now pull and run it",
    subtitle: "No Python. No pip. No setup instructions.",
    badge: "THE POINT",
    speakerNote:
      "This is the promise from slide 4 delivered. Connect it back explicitly.",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { cmd: "docker pull raviteja/hello-user:2.0" },
          { cmd: "docker run -p 8501:8501 raviteja/hello-user:2.0" },
          { out: "You can now view your Streamlit app in your browser." },
        ],
      },
    ],
  },
  {
    chapter: CH.hub,
    title: "The full lifecycle, end to end",
    badge: "THE WHOLE PICTURE",
    speakerNote:
      "Everything today, in one line. Point at each step and name where you taught it.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Code",
          "Dockerfile",
          "Image",
          "Container",
          "Tag",
          "Docker Hub",
          "Pull",
          "Run anywhere",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 17 — CHEAT SHEET ========== */
  {
    chapter: CH.cheat,
    title: "Images",
    badge: "CHEAT SHEET",
    speakerNote: "Tell them to photograph these four slides.",
    blocks: [
      {
        kind: "cheatsheet",
        groups: [
          {
            title: "Working with images",
            commands: [
              "docker images",
              "docker build -t name:tag .",
              "docker tag source target",
              "docker rmi image",
            ],
          },
        ],
      },
    ],
  },
  {
    chapter: CH.cheat,
    title: "Containers",
    badge: "CHEAT SHEET",
    speakerNote: "The daily drivers.",
    blocks: [
      {
        kind: "cheatsheet",
        groups: [
          {
            title: "Run and inspect",
            commands: [
              "docker run image",
              "docker ps -a",
              "docker logs container",
              "docker exec -it container sh",
              "docker diff container",
            ],
          },
          {
            title: "Control",
            commands: [
              "docker stop container",
              "docker start container",
              "docker rm container",
            ],
          },
        ],
      },
    ],
  },
  {
    chapter: CH.cheat,
    title: "Volumes",
    badge: "CHEAT SHEET",
    speakerNote: "inspect is the one they'll forget exists.",
    blocks: [
      {
        kind: "cheatsheet",
        groups: [
          {
            title: "Managing volumes",
            commands: [
              "docker volume create name",
              "docker volume ls",
              "docker volume inspect name",
              "docker volume rm name",
            ],
          },
        ],
      },
    ],
  },
  {
    chapter: CH.cheat,
    title: "Registry",
    badge: "CHEAT SHEET",
    speakerNote: "Login, tag, push, pull. In that order, every time.",
    blocks: [
      {
        kind: "cheatsheet",
        groups: [
          {
            title: "Docker Hub",
            commands: [
              "docker login",
              "docker tag image username/image:tag",
              "docker push username/image:tag",
              "docker pull username/image:tag",
            ],
          },
        ],
      },
    ],
  },

  /* ========== SECTION 18 — THE BIG PICTURE ========== */
  {
    chapter: CH.big,
    title: "What we learned",
    badge: "RECAP",
    speakerNote: "Read them out. It's a longer list than it felt like.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Images",
          "Containers",
          "Dockerfiles",
          "Building images",
          "Running containers",
          "Port mapping",
          "Shrinking images and builds",
          "Tags",
          "Why container data disappears",
          "Volumes",
          "Docker Hub",
        ],
        columns: 2,
      },
    ],
  },
  {
    chapter: CH.big,
    title: "The core mental model",
    subtitle: "If you remember nothing else, remember these two chains.",
    badge: "REMEMBER THIS",
    speakerNote: "Have them say it back to you before you move on.",
    blocks: [
      {
        kind: "flow",
        steps: ["Dockerfile", "Image", "Container", "Running app"],
        orientation: "horizontal",
        highlightLast: true,
      },
      {
        kind: "flow",
        steps: ["Image", "Tag", "Registry", "Push / Pull"],
        orientation: "horizontal",
        tone: "sky",
      },
    ],
  },
  {
    chapter: CH.big,
    title: "What Docker actually buys us",
    badge: "THE VALUE",
    speakerNote: "The left column is a support ticket. The right one is a command.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Instead of saying",
          tone: "coral",
          lines: [
            "Install Python 3.12",
            "Install these 17 packages",
            "Install this system dependency",
            "Hope nothing breaks",
          ],
        },
        right: {
          title: "We say",
          tone: "mint",
          mono: true,
          lines: ["docker run", "  raviteja/hello-user:2.0"],
        },
      },
    ],
  },
  {
    chapter: CH.big,
    title: "The Lehar Loom story so far",
    badge: "TWO SESSIONS IN",
    speakerNote:
      "Session 1 and 2 as one arc. Nice place to acknowledge how far they've come.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "One application",
          "Dependency conflicts",
          "Virtual machines",
          "It works on my machine",
          "Containers",
          "Docker",
          "Images",
          "Volumes",
          "Docker Hub",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },

  /* ========== SECTION 19 — WHAT'S NEXT? ========== */
  {
    chapter: CH.next,
    title: "But something is missing",
    subtitle: "We have two containers. They have no way to talk.",
    badge: "THE GAP",
    speakerNote: "Let the awkwardness sit. It sets up Session 3.",
    blocks: [
      {
        kind: "boxes",
        boxes: [
          { title: "Streamlit", lines: ["container"], tone: "orange" },
          { title: "MySQL", lines: ["container"], tone: "sky" },
        ],
      },
      {
        kind: "callout",
        text: "How do they reach each other?",
        tone: "coral",
      },
    ],
  },
  {
    chapter: CH.next,
    title: "Two islands",
    subtitle: "Separate containers, no route between them.",
    badge: "THE PROBLEM",
    speakerNote: "A container is isolated by default. That's a feature until it isn't.",
    blocks: [
      {
        kind: "split",
        left: {
          title: "Streamlit container",
          tone: "orange",
          lines: ["Runs the app", "Knows nothing about MySQL"],
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
    chapter: CH.next,
    title: "Session 3 — Docker Development Workflow",
    badge: "NEXT SESSION",
    speakerNote: "Sell it. This is the session where it all starts to feel real.",
    blocks: [
      {
        kind: "bullets",
        items: [
          "Bind mounts",
          "Developing with Docker",
          "Docker networking",
          "Container-to-container communication",
          "Docker Compose",
          "Streamlit + MySQL together",
        ],
        columns: 2,
        tone: "sky",
      },
    ],
  },
  {
    chapter: CH.next,
    title: "Where we'll end up",
    badge: "SESSION 3 ARCHITECTURE",
    speakerNote: "The whole stack, defined in one file and started with one command.",
    blocks: [
      {
        kind: "flow",
        steps: [
          "Docker Compose",
          "Streamlit Container",
          "Docker Network",
          "MySQL Container",
          "Volume",
        ],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
  {
    chapter: CH.next,
    title: "Meanwhile, Sam changes one line of Python",
    badge: "THE SETUP",
    speakerNote: "Pause here. Genuinely let them work out the problem themselves.",
    blocks: [
      {
        kind: "flow",
        steps: ["Edit app.py", "docker build", "docker run", "See the change"],
        orientation: "horizontal",
        tone: "coral",
      },
    ],
  },
  {
    chapter: CH.next,
    title: "If I rebuild the image every time I change one line…",
    subtitle: "…how am I supposed to develop?",
    badge: "THE HOOK",
    speakerNote:
      "End the teaching here. Leave the question open — Session 3 answers it.",
    blocks: [
      {
        kind: "callout",
        text: "That question is the entire reason Session 3 exists.",
        tone: "yellow",
        label: "Next",
      },
    ],
  },
  {
    chapter: CH.next,
    title: "Docker Fundamentals — done",
    subtitle: "Next: development, networking and Compose.",
    badge: "END OF SESSION 2",
    joke: "We haven't even made the containers talk to each other yet.",
    speakerNote: "Thank them, remind them Session 3 unlocks next class.",
    blocks: [
      {
        kind: "flow",
        steps: ["Code", "Dockerfile", "Image", "Container", "Tag", "Push"],
        orientation: "horizontal",
        highlightLast: true,
      },
    ],
  },
];

/* Numbered from array position, so slides can be added or removed
   without renumbering everything that follows. */
export const SESSION2_SLIDES: SlideData[] = RAW_SLIDES.map((slide, i) => ({
  ...slide,
  id: i + 1,
  slideNumber: i + 1,
}));
