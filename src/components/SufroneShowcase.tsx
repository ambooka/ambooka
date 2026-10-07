import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SUFRONE_DESCRIPTION } from "@/data/professional-profile";
import styles from "./sufrone-showcase.module.css";

// THESIS: Lead with inspectable work and the developer's contribution.
// OWN-WORLD: Preserve the portfolio's cream, olive, bronze and Geist identity.
// STORY: Understand the independent role, inspect school engineering, try the demo.
// FIRST VIEWPORT: A compact personal introduction leads into actual ERP/app imagery.
// FORM: Approved extension of the incumbent portfolio; no replacement visual world.
export default function SufroneShowcase({ detail = false }: { detail?: boolean }) {
 return <section className={styles.showcase} aria-labelledby="education-heading" data-design-contract="portfolio-proof-first: existing cream/olive identity; actual school screens; part-time independent contribution">
  <div className={styles.copy}>
   <h2 id="education-heading">{detail ? "ERPNext/Frappe school platform" : "Sufrone Education"}</h2>
   <div className={styles.status}>Part-time independent work <span>Hosted demo</span></div>
   <p className={styles.lead}>School operations, connected.<br/>Built on ERPNext and Frappe.</p>
   <p>I developed custom Frappe apps that connect academic records, fees and school workflows with a website and parent/staff experiences. Bayinah Academy is the demonstration use case.</p>
   <dl className={styles.facts}><div><dt>My work</dt><dd>Python business logic, DocTypes, permissions, workflows, reports and APIs.</dd></div><div><dt>Core approach</dt><dd>Separate custom apps and additive migrations; upstream source stays unchanged.</dd></div></dl>
   <div className={styles.actions}>{!detail && <Link className={styles.primary} href="/case-studies/sufrone-education">Explore the case study <ArrowRight size={17}/></Link>}<a className={styles.secondary} href="https://education.sufrone.com" target="_blank" rel="noopener noreferrer">Try the school demo <ArrowUpRight size={17}/><span className={styles.sr}> (opens in a new tab)</span></a></div>
   <p className={styles.note}>Fictional records · Source private · Active development</p>
  </div>
  <figure className={styles.visual}>
   <div className={styles.erp}><Image src="/images/education/school-erp.png" width={1440} height={1000} alt="Bayinah ERPNext teaching workspace showing role-specific school tools" sizes="(max-width: 800px) 90vw, 55vw" priority/></div>
   <div className={styles.phones}><Image src="/images/education/parent-overview.png" width={1080} height={1920} alt="Parent app family overview with sibling selection and school-day updates" sizes="(max-width: 800px) 28vw, 130px"/><Image src="/images/education/staff-today.png" width={1080} height={1920} alt="Staff app daily overview with teaching actions and school inbox" sizes="(max-width: 800px) 28vw, 130px"/></div>
   <figcaption>Actual demonstration screens: school ERP, parent app and staff app.</figcaption>
  </figure>
 </section>;
}
export function SufronePractice() {
 return <section className={styles.practice} aria-labelledby="sufrone-practice-heading"><div><h2 id="sufrone-practice-heading">Independent Software Developer</h2><p className={styles.role}>Sufrone · Part-time independent practice</p></div><div><p>{SUFRONE_DESCRIPTION}</p><p>My current flagship project is Sufrone Education. This work sits alongside my employed IT roles and builds on experience in ERPNext implementation, APIs and operational support.</p><a href="https://sufrone.com" target="_blank" rel="noopener noreferrer" className={styles.secondary}>About Sufrone <ArrowUpRight size={16}/></a></div></section>;
}
