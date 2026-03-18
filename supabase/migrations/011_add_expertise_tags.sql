-- Migration: 011_add_expertise_tags.sql
-- Description: Add tags to expertise JSONB for technology logos

UPDATE public.personal_info
SET expertise = '[
    {"section_key": "expertise_swe", "title": "Software Engineering", "content": "Production-grade applications with clean code, proper testing, and CI/CD. Python, TypeScript, FastAPI, pytest. The foundation everything builds upon.", "icon": "Code", "badge": "Mastered", "tags": ["Python", "TypeScript", "FastAPI", "pytest", "Git"], "display_order": 1},
    {"section_key": "expertise_fullstack", "title": "Full-Stack Development", "content": "End-to-end web development: React, Next.js 14+, TypeScript, FastAPI. Complete products from pixel to database.", "icon": "Layers", "badge": "Mastered", "tags": ["React", "Next.js", "TypeScript", "PostgreSQL", "Supabase"], "display_order": 2},
    {"section_key": "expertise_mobile", "title": "Mobile Development", "content": "Cross-platform apps with Flutter and Dart. Riverpod state management, offline-first SQLite, push notifications.", "icon": "Cpu", "badge": "Current", "tags": ["Flutter", "Dart", "SQLite", "GitHub Actions"], "display_order": 3},
    {"section_key": "expertise_cloud", "title": "Cloud & DevOps", "content": "AWS, Docker, Prometheus, Grafana. HashiCorp Vault for secrets. Linux administration.", "icon": "Cloud", "badge": "Phase 3", "tags": ["AWS", "Docker", "Linux", "Prometheus", "Grafana"], "display_order": 4},
    {"section_key": "expertise_data", "title": "Data Engineering", "content": "Apache Airflow orchestration. Great Expectations for data quality. The backbone that feeds ML systems.", "icon": "Database", "badge": "Phase 4", "tags": ["Airflow", "Python", "PostgreSQL", "pandas"], "display_order": 5},
    {"section_key": "expertise_k8s", "title": "Platform Engineering", "content": "Kubernetes, Helm, Terraform, ArgoCD, GitOps. Operating distributed systems at scale.", "icon": "Box", "badge": "Phase 5", "tags": ["Kubernetes", "Helm", "Terraform", "ArgoCD"], "display_order": 6},
    {"section_key": "expertise_ml", "title": "Machine Learning", "content": "scikit-learn, PyTorch, Hugging Face Transformers. MLflow experiment tracking.", "icon": "BrainCircuit", "badge": "Phase 6", "tags": ["PyTorch", "scikit-learn", "Jupyter", "Python"], "display_order": 7},
    {"section_key": "expertise_llmops", "title": "LLMOps & GenAI", "content": "vLLM, Ollama serving. LangChain, LlamaIndex. Vector DBs. RAG pipelines.", "icon": "Brain", "badge": "Phase 7", "tags": ["Python", "Docker", "PostgreSQL"], "display_order": 8},
    {"section_key": "expertise_mlops", "title": "MLOps Architecture", "content": "Kubeflow Pipelines, KServe model serving. Feast feature store. Evidently drift detection.", "icon": "Workflow", "badge": "Phase 8", "tags": ["Kubernetes", "Docker", "Python", "Prometheus"], "display_order": 9}
]'::jsonb
WHERE id = (SELECT id FROM public.personal_info LIMIT 1);
