import type { SlideBlock } from "@/components/slides/blocks/types";

export interface SlideData {
  id: number;
  slideNumber: number;
  chapter: string;
  title: string;
  subtitle?: string;
  badge?: string;
  speakerNote: string;
  joke?: string;
  /** Session 1 only: a bespoke hand-built visual per slide. */
  interactiveType?:
    | "title_hero"
    | "ecommerce_preview"
    | "character_sam"
    | "single_server"
    | "sam_multirole"
    | "success_orders"
    | "growth_stairs"
    | "split_brands"
    | "two_apps_one_server"
    | "dependency_warning"
    | "tug_of_war"
    | "terminal_nervous"
    | "hypervisor_vms"
    | "isolated_envs"
    | "os_overhead_comparison"
    | "vm_explosion"
    | "team_growth"
    | "priya_clone"
    | "priya_error_bang"
    | "works_on_my_machine"
    | "anatomy_of_app"
    | "package_idea"
    | "container_architecture"
    | "docker_intro"
    | "docker_image_box"
    | "docker_container_instances"
    | "hundred_containers"
    | "sam_regret_chaos"
    | "kubernetes_intro"
    | "k8s_self_healing_sim"
    | "daily_release_pressure"
    | "manual_deploy_pain"
    | "cicd_pipeline_sim"
    | "ci_flow"
    | "cd_flow"
    | "github_actions_engine"
    | "cloud_infra_sprawl"
    | "clickops_nightmare"
    | "terraform_iac"
    | "clickops_vs_code"
    | "devops_ecosystem_map"
    | "full_journey_cinematic"
    | "devops_infinity_loop"
    | "four_pillar_cards"
    | "github_actions_role"
    | "devops_not_docker"
    | "zoom_in_docker"
    | "docker_radar_topics"
    | "docker_run_terminal"
    | "welcome_build_start";
  /** Session 2+: composed from typed layout primitives instead. */
  blocks?: SlideBlock[];
}

export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    slideNumber: 1,
    chapter: "01 / PROLOGUE",
    title: 'From "It Works on My Machine" to Docker',
    subtitle: "DevOps & Docker Workshop — Session 1",
    badge: "WORKSHOP INTRO",
    speakerNote: "Today we're going to find out why this sentence has caused so many problems in software engineering.",
    interactiveType: "title_hero",
  },
  {
    id: 2,
    slideNumber: 2,
    chapter: "02 / THE STORY BEGINS",
    title: "Meet Lehar Loom.",
    subtitle: "A fast-growing Indian ethnic-wear brand that just wants a website that works.",
    badge: "THE COMPANY",
    speakerNote: "Lehar Loom sells ethnic wear online. And like every company, they just want one simple thing: a website that works.",
    interactiveType: "ecommerce_preview",
  },
  {
    id: 3,
    slideNumber: 3,
    chapter: "02 / THE STORY BEGINS",
    title: "Meet Sam.",
    subtitle: "Senior Developer. Coffee enthusiast. Believed by everyone to possess infinite computing knowledge.",
    badge: "THE PROTAGONIST",
    speakerNote: "Sam is the senior developer. Which means, naturally, everyone thinks he knows everything.",
    interactiveType: "character_sam",
  },
  {
    id: 4,
    slideNumber: 4,
    chapter: "02 / THE STORY BEGINS",
    title: "One application. One server.",
    subtitle: "Physical hardware humming under the office desk. Pure architectural simplicity.",
    badge: "THE ARCHITECTURE",
    speakerNote: "Life is simple. One application. One server. One developer responsible for everything.",
    interactiveType: "single_server",
  },
  {
    id: 5,
    slideNumber: 5,
    chapter: "02 / THE STORY BEGINS",
    title: "Sam builds it. Sam deploys it. Sam fixes it.",
    subtitle: "When you are the developer, the sysadmin, and the midnight customer hotline.",
    badge: "ONE-MAN ARMY",
    joke: "Congratulations. You are now the entire IT department.",
    speakerNote: "Sam wears every hat. When something breaks at 2 AM, Sam doesn't call support. Sam is support.",
    interactiveType: "sam_multirole",
  },
  {
    id: 6,
    slideNumber: 6,
    chapter: "02 / THE STORY BEGINS",
    title: "And it works! 🎉",
    subtitle: "Orders are flowing, customers are shopping, and CPU temperature is holding at 42°C.",
    badge: "SUCCESS",
    speakerNote: "For a while, everything is perfect.",
    interactiveType: "success_orders",
  },
  {
    id: 7,
    slideNumber: 7,
    chapter: "03 / AMBITION & EXPANSION",
    title: "Then Lehar Loom gets ambitious.",
    subtitle: "Success breeds roadmaps. Roadmaps breed unexpected horizontal expansion.",
    badge: "SCALE UP",
    speakerNote: "When a business makes money, it doesn't stay still. It expands. First clothes, then candles, then furniture...",
    interactiveType: "growth_stairs",
  },
  {
    id: 8,
    slideNumber: 8,
    chapter: "03 / AMBITION & EXPANSION",
    title: "Welcome, Lehar Candles.",
    subtitle: "Two distinct e-commerce brands under one corporate roof.",
    badge: "NEW BRAND",
    speakerNote: "Lehar Candles launches with its own website, its own team, and its own tech stack requirements.",
    interactiveType: "split_brands",
  },
  {
    id: 9,
    slideNumber: 9,
    chapter: "03 / AMBITION & EXPANSION",
    title: "Sam builds another website.",
    subtitle: "Both Lehar Loom and Lehar Candles deployed onto the same physical office server.",
    badge: "CO-LOCATION",
    speakerNote: "Why buy a second server when the first one has 60% idle memory? What could possibly go wrong?",
    interactiveType: "two_apps_one_server",
  },
  {
    id: 10,
    slideNumber: 10,
    chapter: "04 / DEPENDENCY HELL",
    title: "They need different dependencies.",
    subtitle: "Loom needs Node 20 with Package X v2. Candles requires Node 18 with Package X v1.",
    badge: "THE CONFLICT",
    speakerNote: "And here is where the honeymoon ends. Two apps with fundamentally incompatible requirements living on one OS.",
    interactiveType: "dependency_warning",
  },
  {
    id: 11,
    slideNumber: 11,
    chapter: "04 / DEPENDENCY HELL",
    title: "And now... things get interesting.",
    subtitle: "Two applications pulling the same global library in opposite directions.",
    badge: "TUG OF WAR",
    speakerNote: "You cannot install two conflicting versions of a global runtime or package in the same operating system path without tears.",
    interactiveType: "tug_of_war",
  },
  {
    id: 12,
    slideNumber: 12,
    chapter: "04 / DEPENDENCY HELL",
    title: '"If I upgrade this... what breaks?"',
    subtitle: "The existential dread of running npm update in production.",
    badge: "THE DREAD",
    speakerNote: "Sam hovers his finger over the enter key. If he fixes Candles, Loom dies. If he upgrades Loom, Candles crashes.",
    interactiveType: "terminal_nervous",
  },
  {
    id: 13,
    slideNumber: 13,
    chapter: "05 / VIRTUAL MACHINES",
    title: "So Sam isolates the applications.",
    subtitle: "Enter the Hypervisor: carving one physical box into discrete virtual machines.",
    badge: "HARDWARE VIRTUALIZATION",
    speakerNote: "Hypervisors allowed engineers to simulate distinct hardware, giving Loom and Candles separated sandboxes.",
    interactiveType: "hypervisor_vms",
  },
  {
    id: 14,
    slideNumber: 14,
    chapter: "05 / VIRTUAL MACHINES",
    title: "Now each application gets its own environment.",
    subtitle: "VM 1 runs Linux + Node 20. VM 2 runs Linux + Node 18. Zero interference.",
    badge: "ISOLATION ACHIEVED",
    speakerNote: "Dependency conflict solved! Both websites can update independently without breaking each other.",
    interactiveType: "isolated_envs",
  },
  {
    id: 15,
    slideNumber: 15,
    chapter: "05 / VIRTUAL MACHINES",
    title: "But there is a catch.",
    subtitle: "Every single VM demands its own full Guest Operating System kernel, drivers, and gigabytes of memory.",
    badge: "THE CATCH",
    speakerNote: "You aren't just running your 20MB JavaScript app. You are running 4GB of duplicated Linux OS kernel underneath it.",
    interactiveType: "os_overhead_comparison",
  },
  {
    id: 16,
    slideNumber: 16,
    chapter: "05 / VIRTUAL MACHINES",
    title: "Then Lehar launches 10 more applications.",
    subtitle: "10 applications = 10 full guest operating systems chewing through RAM.",
    badge: "RESOURCE EXHAUSTION",
    joke: "At this point, the server has more roommates than Sam.",
    speakerNote: "When you have 10 apps, 80% of your server's RAM is spent running duplicate copies of Ubuntu kernel, not your business logic.",
    interactiveType: "vm_explosion",
  },
  {
    id: 17,
    slideNumber: 17,
    chapter: "06 / TEAM COLLABORATION",
    title: "Sam hires more developers.",
    subtitle: "Priya, Rahul, Anita join the engineering ranks to accelerate feature delivery.",
    badge: "TEAM EXPANSION",
    speakerNote: "Sam can no longer write every line of code alone. Welcome Priya, Rahul, and Anita.",
    interactiveType: "team_growth",
  },
  {
    id: 18,
    slideNumber: 18,
    chapter: "06 / TEAM COLLABORATION",
    title: "Priya runs the application.",
    subtitle: "Fresh git clone, clean terminal, standard npm install.",
    badge: "ONBOARDING",
    speakerNote: "Priya pulls the repository on day one, ready to make an immediate impact.",
    interactiveType: "priya_clone",
  },
  {
    id: 19,
    slideNumber: 19,
    chapter: "06 / TEAM COLLABORATION",
    title: "💥 It doesn't work.",
    subtitle: "Missing native C++ bindings, mismatched Node version, corrupted global lockfile.",
    badge: "FATAL ERROR",
    speakerNote: "Day one, hour one: a terminal full of bright red stack traces and cryptic ELIFECYCLE errors.",
    interactiveType: "priya_error_bang",
  },
  {
    id: 20,
    slideNumber: 20,
    chapter: "06 / TEAM COLLABORATION",
    title: '"It works on my machine."',
    subtitle: "The most notorious five-word sentence in the history of software development.",
    badge: "THE INFAMOUS LINE",
    joke: 'Developer translation: "Your problem is now a feature."',
    speakerNote: 'Sam leans over and says the magic words. But the company cannot ship Sam\'s physical laptop to the customers.',
    interactiveType: "works_on_my_machine",
  },
  {
    id: 21,
    slideNumber: 21,
    chapter: "07 / THE REAL PROBLEM",
    title: "The application isn't just the source code.",
    subtitle: "Software is an iceberg: Code + Runtime + System Libs + Env Variables + OS Config.",
    badge: "ROOT CAUSE",
    speakerNote: "A git repository only tracks the top 10% of what makes software run. The rest lives invisibly in your host operating system.",
    interactiveType: "anatomy_of_app",
  },
  {
    id: 22,
    slideNumber: 22,
    chapter: "07 / THE REAL PROBLEM",
    title: '"What if we package all of this together?"',
    subtitle: "Bundle the code, the runtime, the libraries, and the exact dependencies into a sealed unit.",
    badge: "THE BIG IDEA",
    speakerNote: "Instead of distributing code and hoping the other computer has matching tools, what if we distribute the entire execution envelope?",
    interactiveType: "package_idea",
  },
  {
    id: 23,
    slideNumber: 23,
    chapter: "08 / ENTER CONTAINERS & DOCKER",
    title: "Containers.",
    subtitle: "Isolated process user-spaces sharing a single host operating system kernel.",
    badge: "THE PARADIGM",
    speakerNote: "Containers give you the isolation of virtual machines without the crushing overhead of duplicate guest operating systems.",
    interactiveType: "container_architecture",
  },
  {
    id: 24,
    slideNumber: 24,
    chapter: "08 / ENTER CONTAINERS & DOCKER",
    title: "Docker.",
    subtitle: "Build once. Ship anywhere. Run consistently.",
    badge: "THE PLATFORM",
    speakerNote: "Docker standardized container packaging, turning complex Linux kernel cgroups and namespaces into a simple developer command.",
    interactiveType: "docker_intro",
  },
  {
    id: 25,
    slideNumber: 25,
    chapter: "08 / ENTER CONTAINERS & DOCKER",
    title: "An image is the package.",
    subtitle: "An immutable blueprint containing application code, runtime, libraries, and files.",
    badge: "DOCKER IMAGE",
    speakerNote: "Think of an image as a sealed shipping box stored in a warehouse. It contains everything needed, exactly as built.",
    interactiveType: "docker_image_box",
  },
  {
    id: 26,
    slideNumber: 26,
    chapter: "08 / ENTER CONTAINERS & DOCKER",
    title: "A container is a running instance of that image.",
    subtitle: "Spin up one, two, or twenty identical running processes from a single immutable image.",
    badge: "DOCKER CONTAINER",
    speakerNote: "If the image is a blueprint or a cookie cutter, the container is the actual running cake.",
    interactiveType: "docker_container_instances",
  },
  {
    id: 27,
    slideNumber: 27,
    chapter: "09 / CONTAINER SCALING",
    title: "Now imagine 100 containers.",
    subtitle: "Microservices boom: Frontend, Backend, Redis, Postgres, Auth, Payment Workers...",
    badge: "SCALE EXPLOSION",
    speakerNote: "Containers are so lightweight that companies break monolithic applications into dozens or hundreds of microservices.",
    interactiveType: "hundred_containers",
  },
  {
    id: 28,
    slideNumber: 28,
    chapter: "09 / CONTAINER SCALING",
    title: '"Who is going to manage all of these?"',
    subtitle: "Tracking container health, port mappings, failover, and IP addresses by hand.",
    badge: "ORCHESTRATION CRISIS",
    joke: "I regret everything.",
    speakerNote: "When container #47 crashes at 3:15 AM on a Saturday, who detects it and spins up a replacement?",
    interactiveType: "sam_regret_chaos",
  },
  {
    id: 29,
    slideNumber: 29,
    chapter: "10 / KUBERNETES",
    title: "Kubernetes.",
    subtitle: "Docker helps run containers. Kubernetes helps manage them at scale.",
    badge: "THE ORCHESTRATOR",
    speakerNote: "Kubernetes coordinates a fleet of servers and makes sure your desired number of containers are always healthy.",
    interactiveType: "kubernetes_intro",
  },
  {
    id: 30,
    slideNumber: 30,
    chapter: "10 / KUBERNETES",
    title: '"Keep my containers running."',
    subtitle: "Declarative desired state + automatic self-healing restart loops.",
    badge: "SELF-HEALING",
    joke: "We'll learn Kubernetes later. Your laptop has suffered enough.",
    speakerNote: "That's enough Kubernetes for today. We are not opening the Kubernetes rabbit hole yet.",
    interactiveType: "k8s_self_healing_sim",
  },
  {
    id: 31,
    slideNumber: 31,
    chapter: "11 / DEPLOYMENT VELOCITY",
    title: "The company is releasing code every day.",
    subtitle: "Feature Monday, hotfix Tuesday, promo Wednesday, rollback Thursday, bugfix Friday.",
    badge: "DAILY RELEASES",
    speakerNote: "Modern software companies don't deploy once every 6 months. They ship multiple times a day.",
    interactiveType: "daily_release_pressure",
  },
  {
    id: 32,
    slideNumber: 32,
    chapter: "11 / DEPLOYMENT VELOCITY",
    title: "Someone has to build, test, and deploy all of this.",
    subtitle: "Manual testing, manual ssh into servers, manual Docker build commands.",
    badge: "MANUAL TOIL",
    joke: "Automation sounds expensive... until you calculate the cost of doing it manually forever.",
    speakerNote: "Humans get tired, make typos in terminal commands, and forget to run test suites under deadline pressure.",
    interactiveType: "manual_deploy_pain",
  },
  {
    id: 33,
    slideNumber: 33,
    chapter: "12 / CI/CD AUTOMATION",
    title: "CI/CD.",
    subtitle: "Automate the journey from git push to live production.",
    badge: "THE PIPELINE",
    speakerNote: "Continuous Integration and Continuous Delivery turn the release cycle into an automated, repeatable pipeline.",
    interactiveType: "cicd_pipeline_sim",
  },
  {
    id: 34,
    slideNumber: 34,
    chapter: "12 / CI/CD AUTOMATION",
    title: "CI = Automatically build and test changes.",
    subtitle: "Every pull request triggers an automated test runner. Catch bugs before humans ever merge.",
    badge: "CONTINUOUS INTEGRATION",
    speakerNote: "Continuous Integration means never breaking main. If a test fails, the robot rejects the code immediately.",
    interactiveType: "ci_flow",
  },
  {
    id: 35,
    slideNumber: 35,
    chapter: "12 / CI/CD AUTOMATION",
    title: "CD = Automatically deliver changes.",
    subtitle: "Approved commits build into Docker images and deploy to staging and production without manual SSH.",
    badge: "CONTINUOUS DELIVERY",
    speakerNote: "Continuous Delivery ensures your latest tested container image is ready to go live with zero downtime.",
    interactiveType: "cd_flow",
  },
  {
    id: 36,
    slideNumber: 36,
    chapter: "12 / CI/CD AUTOMATION",
    title: "GitHub Actions.",
    subtitle: "One powerful way to implement CI/CD directly within your code repository.",
    badge: "AUTOMATION ENGINE",
    speakerNote: "GitHub Actions runs your workflows in response to repository events like push, pull request, or release tags.",
    interactiveType: "github_actions_engine",
  },
  {
    id: 37,
    slideNumber: 37,
    chapter: "13 / CLOUD INFRASTRUCTURE",
    title: "Now the infrastructure is getting complicated.",
    subtitle: "VPCs, Subnets, EC2, Load Balancers, RDS Databases, S3 Buckets, Security Groups.",
    badge: "INFRASTRUCTURE SPRAWL",
    speakerNote: "Applications don't float in thin air. They require an entire galaxy of cloud networking and storage services.",
    interactiveType: "cloud_infra_sprawl",
  },
  {
    id: 38,
    slideNumber: 38,
    chapter: "13 / CLOUD INFRASTRUCTURE",
    title: '"Sam, recreate production."',
    subtitle: "Clicking through hundreds of wizard dropdowns in the AWS/GCP web console.",
    badge: "CLICKOPS NIGHTMARE",
    joke: "ClickOps: because apparently infrastructure deserves a memory test.",
    speakerNote: "If someone asks you to replicate your cloud environment in another region, can you remember all 142 checkboxes?",
    interactiveType: "clickops_nightmare",
  },
  {
    id: 39,
    slideNumber: 39,
    chapter: "14 / TERRAFORM & IAAC",
    title: "Terraform.",
    subtitle: "Infrastructure as Code (IaC).",
    badge: "DECLARATIVE CLOUD",
    speakerNote: "Instead of clicking buttons in a web console, define your entire cloud architecture in version-controlled files.",
    interactiveType: "terraform_iac",
  },
  {
    id: 40,
    slideNumber: 40,
    chapter: "14 / TERRAFORM & IAAC",
    title: "Instead of clicking infrastructure into existence...",
    subtitle: "Write declarative configuration files and let Terraform provision the cloud automatically.",
    badge: "CLICKOPS VS CODE",
    speakerNote: "Left: 50 frantic mouse clicks. Right: infrastructure.tf versioned in git and reproducible anywhere in 60 seconds.",
    interactiveType: "clickops_vs_code",
  },
  {
    id: 41,
    slideNumber: 41,
    chapter: "15 / THE BIG PICTURE",
    title: "Now connect the pieces.",
    subtitle: "The unified DevOps Architecture: Containers, Automation, and Infrastructure as Code.",
    badge: "THE DEVOPS MAP",
    speakerNote: "Look at how every problem we encountered generated an elegant tool: Docker for packaging, K8s for scale, CI/CD for delivery, Terraform for infrastructure.",
    interactiveType: "devops_ecosystem_map",
  },
  {
    id: 42,
    slideNumber: 42,
    chapter: "15 / THE BIG PICTURE",
    title: "Code → Container → Deployment → Infrastructure",
    subtitle: "The complete journey of modern software from developer keystroke to global cloud.",
    badge: "THE CINEMATIC FLOW",
    speakerNote: "Developer writes code → pushes to GitHub → GitHub Actions triggers → Docker builds image → Kubernetes deploys pods → Terraform powers the cloud underneath.",
    interactiveType: "full_journey_cinematic",
  },
  {
    id: 43,
    slideNumber: 43,
    chapter: "15 / THE BIG PICTURE",
    title: "DevOps is the bigger picture.",
    subtitle: "A continuous feedback loop: Plan, Code, Build, Test, Release, Deploy, Operate, Monitor.",
    badge: "THE INFINITY LOOP",
    speakerNote: "DevOps is not a single tool or job title. It is the continuous operational cycle of software delivery.",
    interactiveType: "devops_infinity_loop",
  },
  {
    id: 44,
    slideNumber: 44,
    chapter: "15 / THE BIG PICTURE",
    title: "One-Line Definitions.",
    subtitle: "Clear mental models for the four pillars of modern cloud architecture.",
    badge: "QUICK REFERENCE",
    speakerNote: "Memorize these four clean definitions to never confuse their responsibilities again.",
    interactiveType: "four_pillar_cards",
  },
  {
    id: 45,
    slideNumber: 45,
    chapter: "15 / THE BIG PICTURE",
    title: "GitHub Actions is the automation engine.",
    subtitle: "The glue connecting code changes directly to container builds and cluster deployments.",
    badge: "PIPELINE ENGINE",
    speakerNote: "GitHub Actions triggers Docker builds when code pushes, and deploys to Kubernetes when tests pass.",
    interactiveType: "github_actions_role",
  },
  {
    id: 46,
    slideNumber: 46,
    chapter: "16 / ZOOMING INTO DOCKER",
    title: "DevOps ≠ Docker",
    subtitle: "Docker is one vital foundational piece of the larger DevOps ecosystem.",
    badge: "CLARITY CHECK",
    speakerNote: "Many beginners think Docker and DevOps are the same thing. DevOps is the entire factory; Docker is the standardized shipping container.",
    interactiveType: "devops_not_docker",
  },
  {
    id: 47,
    slideNumber: 47,
    chapter: "16 / ZOOMING INTO DOCKER",
    title: "We Zoom In.",
    subtitle: "From the high-altitude cloud map down to the core engine of containerization.",
    badge: "FOCUS SHIFT",
    speakerNote: "Now that you see the full galaxy, we are zooming all the way in to Docker.",
    interactiveType: "zoom_in_docker",
  },
  {
    id: 48,
    slideNumber: 48,
    chapter: "16 / ZOOMING INTO DOCKER",
    title: "Today's Focus: DOCKER",
    subtitle: "Images, Containers, Dockerfiles, Networking, Volumes, and Docker Compose.",
    badge: "WORKSHOP ROADMAP",
    speakerNote: "These six concepts are what we are mastering throughout this workshop series.",
    interactiveType: "docker_radar_topics",
  },
  {
    id: 49,
    slideNumber: 49,
    chapter: "16 / ZOOMING INTO DOCKER",
    title: "What exactly happens when I run:",
    subtitle: "docker run -d -p 80:80 nginx",
    badge: "THE BIG QUESTION",
    speakerNote: "What does the Docker daemon actually do when you type this? Where does the image come from? How does isolation work?",
    interactiveType: "docker_run_terminal",
  },
  {
    id: 50,
    slideNumber: 50,
    chapter: "16 / ZOOMING INTO DOCKER",
    title: "Welcome to Docker. Let's build something.",
    subtitle: "No more 'works on my machine'. Time to get hands-on in the terminal.",
    badge: "SESSION 1 READY",
    speakerNote: "We started with one server, saw dependency hell, virtual machines, containerization, and the DevOps map. Now let's open our terminals and build with Docker!",
    interactiveType: "welcome_build_start",
  },
];
