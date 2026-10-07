export const PROFESSIONAL_TITLE = "Software Developer | ERPNext/Frappe & Systems Integration";
export const CURRENT_ROLE = "IT Administrator";
export const PROFESSIONAL_SUMMARY = "Software developer and Computer Science graduate building custom ERPNext/Frappe applications, backend APIs and connected web experiences. Started Sufrone as a part-time independent software and systems integration practice. Experience includes ERPNext implementation, production M-Pesa integration and operational IT support.";
export const PROFESSIONAL_SCOPE = "Custom business applications, ERPNext/Frappe development and APIs that connect day-to-day operations.";
export const SUFRONE_DESCRIPTION = "I started Sufrone as a part-time independent software and systems integration practice. Under the Sufrone name, I develop custom business applications, ERPNext/Frappe extensions and connected web experiences.";
export const CV_URL = "/documents/Abdulrahman_Ambooka_ERPNext_Developer_CV.pdf";
export const TARGET_ROLES = ["ERPNext / Frappe Developer", "Software Developer", "Backend Engineer", "Full-Stack Engineer", "Systems Integration Engineer"] as const;
export const SUFRONE_EXPERIENCE = {
 id: "sufrone-independent-development", company: "Sufrone", position: "Independent Software Developer (Part-time)", location: "Nairobi, Kenya",
 // Unknown start date is deliberate; date renderers show Ongoing without guessing.
 start_date: "", end_date: null, is_current: true, description: SUFRONE_DESCRIPTION,
 responsibilities: ["Develop custom business software, ERPNext/Frappe apps and connected websites and portals.", "Build API integrations, permission rules and approval workflows, and handle deployment and debugging."],
 achievements: ["Built Sufrone Education with Bayinah Academy as its fictional-data demonstration, available at education.sufrone.com."],
 technologies: ["Python", "Frappe", "ERPNext", "JavaScript", "TypeScript", "Next.js", "Docker"], display_order: 0, created_at: "", updated_at: "",
};
export function withSufroneExperience<T extends { company: string }>(rows: T[]) {
 return rows.some(row => row.company.trim().toLowerCase() === "sufrone") ? rows : [SUFRONE_EXPERIENCE, ...rows];
}
