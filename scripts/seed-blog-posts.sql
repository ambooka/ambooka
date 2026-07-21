-- Professional portfolio blog seed posts
-- Replace the author_id UUID with your actual admin user from auth.users if required.

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, tags, is_published, published_at, author_id)
VALUES
(
    'Building a Production-Style Portfolio Platform',
    'building-a-production-portfolio-platform',
    'How I structured ambooka.dev as a full-stack portfolio with Supabase content, admin CMS, GitHub activity sync, and Playwright e2e tests.',
    '# Building a Production-Style Portfolio Platform\n\nThis article explains the architecture, content model, admin CMS, Supabase schema, GitHub activity sync, resume variants, Playwright tests, and deployment structure behind ambooka.dev.\n\nThe goal was not to create a decorative portfolio, but a proof system for real professional evidence: projects, experience, case studies, and technical writing.',
    'Software Engineering',
    ARRAY['Next.js', 'Supabase', 'Portfolio', 'Testing'],
    true,
    NOW() - INTERVAL '3 weeks',
    NULL
),
(
    'Building Reliable M-Pesa Daraja Integrations',
    'building-reliable-mpesa-integrations',
    'Notes on STK Push, B2C, C2B callbacks, retries, queues, webhook validation, and transaction audit logs.',
    '# Building Reliable M-Pesa Daraja Integrations\n\nPayment integrations need reliability because failures affect real money. This article explains the engineering patterns I use for Safaricom Daraja integrations: typed responses, asynchronous jobs, retry logic, webhook validation, and PostgreSQL transaction audit logs.',
    'Backend Engineering',
    ARRAY['M-Pesa', 'Node.js', 'TypeScript', 'Payments', 'Redis'],
    true,
    NOW() - INTERVAL '2 weeks',
    NULL
),
(
    'Lessons from Implementing ERPNext in a Real Company',
    'lessons-from-erpnext-implementation',
    'What I learned designing accounts, item catalogues, procurement workflows, and operational adoption for a trading company.',
    '# Lessons from Implementing ERPNext in a Real Company\n\nERP implementation is not just software setup. It is process mapping, data cleanup, user training, permission design, and operational discipline. This article summarizes the lessons from implementing ERPNext in a real trading-company environment.',
    'Business Systems',
    ARRAY['ERPNext', 'Business Systems', 'Inventory', 'Procurement'],
    true,
    NOW() - INTERVAL '1 week',
    NULL
),
(
    'Building a Computer Vision Surveillance System with YOLO and OpenCV',
    'computer-vision-final-year-project',
    'Technical lessons from my final-year computer vision research project using YOLO, OpenCV, Flask, and real-time video processing.',
    '# Building a Computer Vision Surveillance System with YOLO and OpenCV\n\nThis article covers problem framing, YOLO model selection, OpenCV stream processing, Flask inference APIs, alert generation, and accuracy-latency tradeoffs from my final-year research project.',
    'Computer Vision',
    ARRAY['YOLO', 'OpenCV', 'PyTorch', 'Flask', 'Computer Vision'],
    true,
    NOW() - INTERVAL '3 days',
    NULL
),
(
    'From Excel Invoicing to a Custom Business Dashboard',
    'sme-invoicing-reporting-dashboard',
    'How a React and FastAPI dashboard replaced manual Excel invoicing with PDF generation, WhatsApp notifications, and analytics.',
    '# From Excel Invoicing to a Custom Business Dashboard\n\nThis article explains how a manual invoicing workflow was replaced with a custom business dashboard, automated PDFs, WhatsApp notifications, and analytics, reducing manual processing effort by approximately 80%.',
    'Business Automation',
    ARRAY['React', 'FastAPI', 'PostgreSQL', 'PDF', 'Business Automation'],
    true,
    NOW(),
    NULL
);
