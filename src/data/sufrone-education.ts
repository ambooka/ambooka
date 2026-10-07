import type { Project, CaseStudy } from "@/types/portfolio";
export const educationProject: Project = {
 slug: "sufrone-education", title: "Sufrone Education", oneLine: "Custom ERPNext/Frappe development connecting school operations with a website and parent/staff applications.", category: "enterprise", displayOrder: 0, status: "demo", completionPercent: null, featured: true, anchor: true,
 problem: "School teams and families need coherent access to academic records, fees, communication and daily operations across separate systems.",
 solution: "Developed custom Frappe apps and an authenticated integration bridge, connecting native ERPNext records with the school website and parent/staff experiences.",
 businessValue: "A working fictional-data demonstration of connected school workflows and access appropriate to each role.",
 stack: ["Python", "Frappe / ERPNext 15", "Education", "HRMS", "JavaScript", "TypeScript", "Next.js", "Docker"], coreSkills: ["Custom DocTypes", "Business logic", "Permissions", "Workflows", "REST APIs"],
 proof: {caseStudy: "/case-studies/sufrone-education", liveDemo: "https://education.sufrone.com", screenshots: ["/images/education/school-erp.png", "/images/education/parent-overview.png", "/images/education/staff-today.png"]},
 engineeringEvidence: {tests: true, ci: false, docker: true, databaseMigrations: true, monitoring: false, docs: true, deployed: true},
 recruiterSummary: "Developed bayinah_school and bayinah_bridge custom Frappe apps, extending ERPNext, Education and HRMS with school-specific workflows, permissions, reports and APIs. Source private; hosted demo available.",
};
export const educationCaseStudy: CaseStudy = {
 slug: educationProject.slug, projectSlug: educationProject.slug, title: "Sufrone Education — ERPNext/Frappe development", subtitle: "Bayinah Academy demonstration · Part-time independent work through Sufrone", summary: educationProject.recruiterSummary, problem: educationProject.problem,
 architecture: ["Native ERPNext, Education and HRMS records remain the operational foundation.", "bayinah_school packages DocTypes, custom fields, Python validation, JavaScript forms and permission rules.", "bayinah_bridge exposes authenticated APIs for school data and native finance document relationships.", "Website and parent/staff experiences connect through platform APIs and asynchronous outbox workers."],
 keyDecisions: ["Keep customisations in separate apps and additive install/migrate hooks without editing upstream core source.", "Enforce responsibilities on the server: scope teachers by teaching assignment and separate health/welfare authority.", "Use native Sales Invoice and Payment Entry relationships, guarded allocations and idempotency checks for financial integration.", "Publish reviewed academic reports only after checking source results, completeness and approval state."],
 implementation: ["Created school-specific DocTypes and fields, document event hooks, approval workflows and role-based Desk workspaces.", "Built JavaScript form behaviour and academic report generation/print output linked to native assessments.", "Implemented authenticated intake, student, attendance, results and fees APIs with company/student scope checks.", "Connected school portals and deployed a credential-free role-preview environment with fictional records."],
 quality: ["Permission and report acceptance checks cover important role boundaries and reviewed publication behaviour.", "Hosted checks exercised desktop/mobile previews, ERP role handoffs, HTTPS and database readiness.", "Separate applications preserve upstream core source; compatibility still requires testing when upgrading."],
 results: [educationProject.businessValue, "The public showcase includes a school website, parent/staff screen walkthroughs, browser portals and ERP role selection.", "The application source is private; the demonstration uses fictional records and is not a completed school production cutover."],
 futureImprovements: ["Moodle is planned and is not installed in the current demonstration.", "Google Workspace delivery, live GPS/traffic, push notifications and payment settlement require provider setup; the hosted school demo uses capture/demo providers.", "Client onboarding requires separate configuration, data reconciliation and school acceptance."],
};

export function withEducationResumeProjects<T extends {title: string}>(rows: T[]) {
 const entry = { id: educationProject.slug, title: educationProject.title, description: educationProject.recruiterSummary, stack: educationProject.stack, status: educationProject.status };
 return [entry, ...rows.filter(row => !row.title.toLowerCase().includes("sufrone education"))];
}
