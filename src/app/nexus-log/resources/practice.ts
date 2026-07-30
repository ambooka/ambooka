export type NexusPracticeResource = {
  title: string;
  source: string;
  url: string;
  description: string;
  drill: string;
};

type PracticeRule = {
  test: RegExp;
  resources: readonly NexusPracticeResource[];
};

const practice = (
  title: string,
  source: string,
  url: string,
  description: string,
  drill: string,
): NexusPracticeResource => ({ title, source, url, description, drill });

export const NEXUS_PRACTICE_RESOURCES = {
  python_exercism: practice(
    "Python Track exercises",
    "Exercism",
    "https://exercism.org/tracks/python",
    "Progressive Python exercises with automated tests, mentoring-oriented solutions, and idiomatic refactoring practice.",
    "Complete one exercise without looking at a solution, then add typing and pytest coverage locally.",
  ),
  sql_pgexercises: practice(
    "PostgreSQL Exercises",
    "PGExercises",
    "https://pgexercises.com/",
    "Hands-on PostgreSQL problems covering joins, aggregates, subqueries, window functions, recursive queries, and data modification.",
    "Solve the matching query class, then run EXPLAIN ANALYZE and record one optimisation.",
  ),
  dsa_leetcode75: practice(
    "LeetCode 75 study plan",
    "LeetCode",
    "https://leetcode.com/studyplan/leetcode-75/",
    "A compact problem set for arrays, hash maps, trees, graphs, heaps, dynamic programming, and interview reasoning.",
    "Solve one problem from memory, state the time and space complexity, and benchmark your implementation.",
  ),
  linux_bandit: practice(
    "Bandit command-line wargame",
    "OverTheWire",
    "https://overthewire.org/wargames/bandit/",
    "A legal Linux and SSH challenge environment for shell navigation, permissions, processes, networking, text tools, and keys.",
    "Complete at least two levels and write the commands and security lesson in your engineering log.",
  ),
  docker_workshop: practice(
    "Docker hands-on workshop",
    "Docker",
    "https://docs.docker.com/get-started/workshop/",
    "Official step-by-step workshop for images, containers, volumes, networks, Compose, and multi-container applications.",
    "Rebuild the workshop using your Nexus service instead of the sample application.",
  ),
  github_skills: practice(
    "GitHub Skills interactive courses",
    "GitHub",
    "https://skills.github.com/",
    "Repository-based exercises for Actions, pull requests, releases, code security, and collaborative workflows.",
    "Complete the closest GitHub Actions or security course and reproduce the workflow in the Nexus repository.",
  ),
  fastapi_buildalong: practice(
    "FastAPI tutorial build-along",
    "FastAPI",
    "https://fastapi.tiangolo.com/tutorial/",
    "The official implementation path for routes, validation, dependencies, authentication, databases, testing, and deployment.",
    "Implement the relevant chapter in a disposable branch, then reproduce it without copying in the Nexus API.",
  ),
  portswigger_auth: practice(
    "Authentication vulnerability labs",
    "PortSwigger Web Security Academy",
    "https://portswigger.net/web-security/authentication",
    "Free legal labs covering password, session, MFA, reset, enumeration, and authentication logic weaknesses.",
    "Complete one lab, then add a regression test that prevents the same weakness in Nexus.",
  ),
  portswigger_access: practice(
    "Access-control vulnerability labs",
    "PortSwigger Web Security Academy",
    "https://portswigger.net/web-security/access-control",
    "Interactive labs for vertical and horizontal privilege escalation, IDOR, workflow controls, and authorization failures.",
    "Complete one access-control lab and turn the failure into an RBAC or ABAC test case.",
  ),
  next_dashboard: practice(
    "Next.js dashboard course project",
    "Next.js",
    "https://nextjs.org/learn/dashboard-app",
    "An official full-stack dashboard build with routing, data fetching, forms, validation, accessibility, authentication, and errors.",
    "Complete the chapter closest to today’s task, then implement the equivalent behavior in the Nexus dashboard.",
  ),
  technical_writing_exercises: practice(
    "Technical Writing One exercises",
    "Google for Developers",
    "https://developers.google.com/tech-writing/onel",
    "Exercises for audience, clarity, active voice, structure, lists, paragraphs, and concise technical explanation.",
    "Apply one exercise to today’s README or case-study section and compare the before-and-after text.",
  ),
  data_engineering_homework: practice(
    "Data Engineering Zoomcamp homework",
    "DataTalksClub",
    "https://github.com/DataTalksClub/data-engineering-zoomcamp",
    "Hands-on modules, homework, workshops, and a final project for ingestion, orchestration, warehouses, analytics engineering, and pipelines.",
    "Complete the homework section matching today’s pipeline and adapt the solution to Nexus data.",
  ),
  airflow_tutorial: practice(
    "Airflow fundamentals tutorial",
    "Apache Airflow",
    "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html",
    "Official DAG authoring practice for tasks, dependencies, templating, testing, scheduling, retries, and backfills.",
    "Build the tutorial DAG, force one failure, then prove retry and backfill behavior from the logs.",
  ),
  aws_well_architected_labs: practice(
    "AWS Well-Architected Labs",
    "Amazon Web Services",
    "https://www.wellarchitectedlabs.com/",
    "Hands-on workshops and labs organised around security, reliability, operations, performance, cost, and sustainability.",
    "Complete one lab that matches the current AWS component and record the architecture decision and cost impact.",
  ),
  terraform_aws_lab: practice(
    "Terraform Get Started on AWS",
    "HashiCorp",
    "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
    "Interactive command-line tutorials for creating, changing, modularising, collaborating on, and destroying AWS infrastructure.",
    "Complete the relevant lab, then rebuild it as a reusable Nexus module and destroy the temporary resources.",
  ),
  kubernetes_tutorials: practice(
    "Kubernetes official tutorials",
    "Kubernetes",
    "https://kubernetes.io/docs/tutorials/",
    "Hands-on tutorials for workloads, configuration, services, scaling, updates, debugging, security, and local clusters.",
    "Run the closest tutorial in kind or minikube, then apply the same control to the Nexus manifests.",
  ),
  juice_shop: practice(
    "OWASP Juice Shop",
    "OWASP",
    "https://owasp.org/www-project-juice-shop/",
    "A deliberately insecure application for legal practice with authentication, access control, injection, misconfiguration, and security tooling.",
    "Exploit one relevant challenge safely, then document and test the corresponding defensive control in Nexus.",
  ),
  web_security_academy: practice(
    "Web Security Academy learning paths",
    "PortSwigger",
    "https://portswigger.net/web-security",
    "Free interactive web-security labs with guided learning paths, realistic targets, progress tracking, and legal practice environments.",
    "Complete one lab from the current risk category and translate the lesson into a security acceptance test.",
  ),
  sklearn_exercises: practice(
    "scikit-learn MOOC exercises",
    "Inria and scikit-learn",
    "https://inria.github.io/scikit-learn-mooc/",
    "Executable notebooks, exercises, quizzes, solutions, and model-evaluation practice maintained with the scikit-learn ecosystem.",
    "Complete one exercise without opening the solution, then repeat it on the Nexus dataset with a baseline comparison.",
  ),
  mlflow_quickstart: practice(
    "MLflow tracking quickstart",
    "MLflow",
    "https://mlflow.org/docs/latest/ml/getting-started/quickstart/",
    "A hands-on workflow for logging parameters, metrics, artifacts and models, exploring runs, and loading a model for inference.",
    "Run the quickstart, then log two competing Nexus experiments and explain which run should be promoted.",
  ),
  evidently_examples: practice(
    "Evidently tutorials and examples",
    "Evidently AI",
    "https://docs.evidentlyai.com/examples/introduction",
    "End-to-end examples for data quality, drift, testing, monitoring, dashboards, and integrations.",
    "Generate a drift report with a controlled distribution change and define the alert threshold before automating retraining.",
  ),
  llm_zoomcamp: practice(
    "LLM Zoomcamp projects and homework",
    "DataTalksClub",
    "https://github.com/DataTalksClub/llm-zoomcamp",
    "A practical course repository for retrieval, evaluation, monitoring, deployment, and production-oriented LLM applications.",
    "Complete the closest homework or workshop and compare its design decisions with the Nexus RAG service.",
  ),
  ragas_quickstart: practice(
    "Ragas RAG-evaluation quickstart",
    "Ragas",
    "https://docs.ragas.io/en/stable/getstarted/quickstart/",
    "A runnable evaluation project with datasets, custom metrics, experiments, CSV results, and failure analysis.",
    "Evaluate a small golden set, inspect the worst failures, and make one measured retrieval or prompt improvement.",
  ),
  pyrit_practice: practice(
    "PyRIT red-team exercises",
    "Microsoft",
    "https://azure.github.io/PyRIT/",
    "Practical generative-AI attack orchestration, scoring, converters, targets, datasets, and reporting workflows.",
    "Run a safe local attack set, classify failures by severity, and verify that a mitigation blocks the same cases.",
  ),
  rustlings: practice(
    "Rustlings exercises",
    "Rust Project",
    "https://github.com/rust-lang/rustlings",
    "Small compiler-driven Rust exercises recommended alongside the official Rust book.",
    "Complete the ownership, error-handling and collections exercises before implementing the security CLI module.",
  ),
  spring_guides: practice(
    "Spring Getting Started guides",
    "Spring",
    "https://spring.io/guides/gs/",
    "Short hands-on guides for REST, data access, testing, security, messaging, uploads, batch processing, and operations.",
    "Complete the REST, JPA or testing guide that matches the service task, then reproduce it in the Nexus workflow service.",
  ),
  exercism_java: practice(
    "Java Track exercises",
    "Exercism",
    "https://exercism.org/tracks/java",
    "Test-driven Java exercises for collections, classes, exceptions, streams, concurrency, and idiomatic design.",
    "Complete one exercise using tests first, then apply the same language feature to the Spring service.",
  ),
  exercism_c: practice(
    "C Track exercises",
    "Exercism",
    "https://exercism.org/tracks/c",
    "C exercises with automated tests for pointers, arrays, strings, structs, memory, files, and low-level reasoning.",
    "Complete one memory or data-structure exercise with strict compiler warnings and sanitizers enabled.",
  ),
  exercism_cpp: practice(
    "C++ Track exercises",
    "Exercism",
    "https://exercism.org/tracks/cpp",
    "Modern C++ exercises for RAII, classes, STL, templates, error handling, algorithms, and testing.",
    "Complete one exercise using RAII and tests, then use the same pattern in the machine simulator.",
  ),
  kotlin_koans: practice(
    "Kotlin Koans",
    "Kotlin",
    "https://kotlinlang.org/docs/koans.html",
    "Interactive failing-test exercises for Kotlin syntax, collections, lambdas, classes, builders, and idioms.",
    "Make the relevant Koans tests pass, then reproduce the pattern in the offline field application.",
  ),
  csharp_interactive: practice(
    "Interactive C# tutorials",
    "Microsoft Learn",
    "https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/tutorials/",
    "Runnable C# lessons in GitHub Codespaces for types, collections, patterns, object-oriented design, and application structure.",
    "Complete the closest tutorial, then implement an Excel-validation rule with a test and a useful error message.",
  ),
  laravel_bootcamp: practice(
    "Laravel Bootcamp project",
    "Laravel",
    "https://bootcamp.laravel.com/",
    "An official guided application build covering routing, validation, authentication, persistence, authorization, and frontend integration.",
    "Build the relevant workflow in the Bootcamp app, then implement the supplier-portal equivalent with feature tests.",
  ),
  langgraph_quickstart: practice(
    "LangGraph quickstart",
    "LangChain",
    "https://docs.langchain.com/oss/python/langgraph/quickstart",
    "A runnable state-graph build covering nodes, edges, tools, routing, durable execution, and agent control flow.",
    "Build the quickstart graph, add one interrupt or approval gate, and inspect the trace before adapting it to Nexus.",
  ),
  aws_exam_practice: practice(
    "AWS certification official practice questions",
    "Amazon Web Services",
    "https://aws.amazon.com/certification/certification-prep/",
    "Official exam-preparation plans, sample questions, practice question sets, courses, labs, and readiness guidance.",
    "Take a timed question set, explain every wrong answer, and map the weak domain to a Nexus architecture lab.",
  ),
  security_plus_practice: practice(
    "CertMaster Practice for Security+",
    "CompTIA",
    "https://www.comptia.org/training/certmaster-practice",
    "Official adaptive practice, remediation, performance-based questions, and readiness checks for CompTIA exams.",
    "Complete a timed domain set and turn each missed objective into a short scenario or lab in your notes.",
  ),
  informational_interview: practice(
    "Informational interview guide",
    "UC Berkeley Career Engagement",
    "https://career.berkeley.edu/start-exploring/informational-interviews/",
    "A practical guide to identifying contacts, preparing questions, conducting focused conversations, and following up professionally.",
    "Prepare five role-specific questions, conduct one conversation, and record three decisions that affect your roadmap.",
  ),
  system_design_drills: practice(
    "System Design Primer exercises",
    "Donne Martin and contributors",
    "https://github.com/donnemartin/system-design-primer",
    "Architecture walkthroughs, trade-off discussions, interview prompts, scalability patterns, and design exercises.",
    "Time-box a 30-minute design, draw the architecture, state trade-offs, and give a five-minute verbal walkthrough.",
  ),
  recovery_check: practice(
    "Recovery and sleep check",
    "CDC",
    "https://www.cdc.gov/sleep/about/index.html",
    "Evidence-based sleep basics and practical factors that support recovery, attention, and sustainable performance.",
    "Protect the recovery block, record sleep and energy, and remove work that would violate the deload rather than carrying it forward silently.",
  ),
} as const;

const R = NEXUS_PRACTICE_RESOURCES;

const PRACTICE_RULES: readonly PracticeRule[] = [
  { test: /pyproject|ruff|mypy|pytest|coverage|typing|python toolkit|python template|pip install|cli|json|csv|hash checker|bulk rename|file search|log cleaner/i, resources: [R.python_exercism] },
  { test: /hashmap|hash map|heap|graph|bfs|dfs|dijkstra|algorithm|complexity|benchmark/i, resources: [R.dsa_leetcode75] },
  { test: /postgres|sql|schema|query|index|explain|database|warehouse|materialised|fact|dimension/i, resources: [R.sql_pgexercises] },
  { test: /ssh|ufw|fail2ban|vps|linux|server lockdown|bastion|deploy user|network diagnostics/i, resources: [R.linux_bandit] },
  { test: /docker|compose|container|dockerfile|image/i, resources: [R.docker_workshop] },
  { test: /github actions|ci\/cd|ci skeleton|ci gate|ci runs|deploy on merge|release artifact|workflow/i, resources: [R.github_skills] },
  { test: /fastapi|openapi|crud|api|route|endpoint|pagination|validation|requisition|seed script|integration test/i, resources: [R.fastapi_buildalong] },
  { test: /authentication|login|logout|password|jwt|session|mfa|secure cookie/i, resources: [R.portswigger_auth] },
  { test: /authorization|rbac|abac|permission|branch scoping|protected route|access control|idor/i, resources: [R.portswigger_access] },
  { test: /next\.js|nextjs|typescript|react|frontend|dashboard|ui|sidebar|layout|form|table|responsive|loading state|error boundar|approval queue/i, resources: [R.next_dashboard] },
  { test: /readme|case study|architecture note|diagram|resume|portfolio|demo video|documentation|technical write-up|adr|showcase/i, resources: [R.technical_writing_exercises] },
  { test: /etl|messy|csv|excel|cleaner|transform|normalis|data quality|bad-record|quarantine|load summary|analytics warehouse|duplicate load|data pipeline/i, resources: [R.data_engineering_homework] },
  { test: /airflow|dag|backfill|scheduled|schedule|retry|alert hook|orchestrat/i, resources: [R.airflow_tutorial] },
  { test: /aws|iam|ec2|rds|s3|cloudwatch|cloudtrail|guardduty|security hub|alb|billing|budget|mfa|vpc|subnet|nacl/i, resources: [R.aws_well_architected_labs] },
  { test: /terraform|iac|remote state|dynamodb lock|provider config|module|terraform apply|state in git/i, resources: [R.terraform_aws_lab] },
  { test: /kubernetes|k8s|serviceaccount|rolebinding|networkpolic|pod security|sealed-secret|eso|ingress|prometheus|grafana|loki/i, resources: [R.kubernetes_tutorials] },
  { test: /threat|stride|dfd|trust boundar|owasp top 10|risk rating|secure sdlc|security architecture|security review/i, resources: [R.juice_shop, R.web_security_academy] },
  { test: /semgrep|bandit|pip-audit|npm audit|trivy|gitleaks|sbom|syft|sarif|sca|sast|secret scan|security scan|critical findings|pre-commit security|devsecops/i, resources: [R.github_skills, R.juice_shop] },
  { test: /machine learning|\bml\b|model|prediction|predictive maintenance|dataset|shap|feature|training|inference|baseline|leakage|forecast|anomaly detection/i, resources: [R.sklearn_exercises] },
  { test: /mlflow|registry|experiment|model version|promotion|rollback|lineage|production alias|active model|artifact metadata/i, resources: [R.mlflow_quickstart] },
  { test: /drift|retrain|evaluation gate|reference\/current window|candidate model|model decay/i, resources: [R.evidently_examples] },
  { test: /rag|embedding|pgvector|retrieval|citation|chunk|streaming|semantic search|chat history|grounded answer|mcp server/i, resources: [R.llm_zoomcamp] },
  { test: /golden set|llm-as-judge|prompt a\/b|rag evaluation|hallucination|structured extraction|multimodal|correction endpoint|typed json/i, resources: [R.ragas_quickstart] },
  { test: /prompt injection|pii|guardrail|red-team|red team|grounding verification|ai safety|safety gateway|redaction|weakly-grounded/i, resources: [R.pyrit_practice, R.web_security_academy] },
  { test: /rust|clap|secret scanner|entropy|secscan|integrity-agent|artifact integrity/i, resources: [R.rustlings] },
  { test: /java|spring|ledger posting|workflow entities/i, resources: [R.spring_guides, R.exercism_java] },
  { test: /c\+\+|c firmware|cmake|uart|sensor loop|machine simulator|fault injection|strict flags/i, resources: [R.exercism_c, R.exercism_cpp] },
  { test: /kotlin|android|offline field app|sync queue/i, resources: [R.kotlin_koans] },
  { test: /c#|dotnet|\.net|excel import validator|excel validator/i, resources: [R.csharp_interactive] },
  { test: /php|laravel|supplier portal/i, resources: [R.laravel_bootcamp] },
  { test: /langgraph|agent|supervisor|human approval|tool executor|langsmith|langfuse|side-effect tool|multi-tool/i, resources: [R.langgraph_quickstart, R.pyrit_practice] },
  { test: /security\+|saa-c03|certification|exam|cert push|cert study/i, resources: [R.aws_exam_practice, R.security_plus_practice] },
  { test: /informational interview|meetup|networking|linkedin|outreach|applications|target list|role-specific resume/i, resources: [R.informational_interview] },
  { test: /system design|architecture interview|scalability|trade-off/i, resources: [R.system_design_drills] },
  { test: /physical recovery|sleep|exercise|reconnecting|protected rest/i, resources: [R.recovery_check] },
];

const ENTRY_DEFAULTS: Record<string, NexusPracticeResource> = {
  S01: R.python_exercism,
  S02: R.docker_workshop,
  S03: R.fastapi_buildalong,
  S04: R.portswigger_access,
  S05: R.next_dashboard,
  S06: R.technical_writing_exercises,
  D1: R.aws_exam_practice,
  S07: R.data_engineering_homework,
  S08: R.airflow_tutorial,
  S09: R.aws_well_architected_labs,
  S10: R.terraform_aws_lab,
  S11: R.kubernetes_tutorials,
  S12: R.web_security_academy,
  S13: R.juice_shop,
  D2: R.aws_exam_practice,
  S14: R.sklearn_exercises,
  S15: R.mlflow_quickstart,
  S16: R.evidently_examples,
  S17: R.llm_zoomcamp,
  S18: R.ragas_quickstart,
  S19: R.pyrit_practice,
  D3: R.security_plus_practice,
  S20: R.rustlings,
  S21: R.spring_guides,
  S22: R.kotlin_koans,
  S23: R.langgraph_quickstart,
  S24: R.system_design_drills,
};

function unique(resources: readonly NexusPracticeResource[]) {
  const seen = new Set<string>();
  return resources.filter((resource) => {
    if (seen.has(resource.url)) return false;
    seen.add(resource.url);
    return true;
  });
}

export function getNexusPracticeResources(
  taskText: string,
  entryId: string,
): NexusPracticeResource[] {
  const matched = PRACTICE_RULES.filter((rule) => rule.test.test(taskText)).flatMap(
    (rule) => rule.resources,
  );
  const fallback = ENTRY_DEFAULTS[entryId];
  return unique(fallback ? [...matched, fallback] : matched).slice(0, 2);
}

export function hasCompleteNexusPracticeCoverage(entryIds: string[]): boolean {
  return entryIds.every((entryId) => Boolean(ENTRY_DEFAULTS[entryId]));
}
