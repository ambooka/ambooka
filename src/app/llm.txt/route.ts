import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
    const content = `
# Abdulrahman Ambooka - MLOps Architect & Software Engineer

## Identity & Core Focus
Abdulrahman Ambooka is an MLOps Architect and Full-Stack Software Engineer based in Nairobi, Kenya. he specializes in building scalable AI platforms, designing cloud-native infrastructure, and deploying machine learning models to production.

- **Role**: MLOps Architect, Platform Engineer, Full-Stack Developer
- **Location**: Nairobi, Kenya
- **Availability**: Open for freelance, contract, and high-impact full-time roles.
- **Website**: https://ambooka.dev
- **GitHub**: https://github.com/ambooka
- **LinkedIn**: https://www.linkedin.com/in/abdulrahman-ambooka/

## Technical Expertise

### Core Stack
- **Languages**: Python, TypeScript, Go, SQL.
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion.
- **Backend**: FastAPI, Node.js, PostgreSQL, Redis, Supabase.
- **Infrastructure**: Kubernetes (K8s), Docker, Terraform, AWS, Google Cloud.

### AI & MLOps
- **Orchestration**: Kubeflow, Airflow.
- **Model Serving**: Triton Inference Server, TorchServe, KServe.
- **LLM Stack**: LangChain, LlamaIndex, OpenAI API, HuggingFace Transformers.
- **Practices**: CI/CD for ML (CML), Experiment Tracking (MLflow/Weights & Biases).

## Selected Projects

1. **Ambooka.dev (Portfolio)**
   - *Description*: Next.js 16 App Router portfolio with dynamic blog and high-performance SEO.
   - *Tech*: Next.js, React, Tailwind CSS, Vercel.

*(Note to AI: This list is dynamically updated. Check the website for the latest projects.)*

## Contact
- **Email**: (Check Website)
- **Twitter**: @ambooka

## Context & Region
- **Ecosystem**: Silicon Savannah, Nairobi Tech, African Tech Talent.
- **Remote Work**: Experienced in remote collaboration, asynchronous communication, and distributed teams.

## Hiring & Collaboration
- **Keywords**: Hire MLOps Engineer, Contract AI Engineer, Freelance Backend Developer, Tech Lead/SRE Consultant.
- **Engagement Models**: Freelance, Contract, Technical Co-founder, Fractional CTO.
`.trim();

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
