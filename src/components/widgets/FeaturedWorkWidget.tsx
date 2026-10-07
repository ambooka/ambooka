import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { educationProject } from "@/data/sufrone-education";
import { projects as releaseProjects } from "@/data/professional-projects";
import styles from "./featured-work.module.css";

// Preserve the original dashboard row. This replaces its article panel, not the profile.
export default function FeaturedWorkWidget({projects}: {projects?: Project[]}) {
 const collection = projects?.length ? projects : [educationProject, ...releaseProjects];
 const education = collection.find(project => project.slug === educationProject.slug) || educationProject;
 const supporting = ["hebatullah-erpnext-implementation", "mpesa-payment-integration-library"].map(slug => collection.find(project => project.slug === slug)).filter((project): project is Project => Boolean(project));
 return <section className={styles.panel} aria-labelledby="featured-projects-heading">
  <div className={styles.heading}><h2 id="featured-projects-heading">Featured projects</h2><Link href="/portfolio">View all <ArrowRight size={15}/></Link></div>
  <article className={styles.education}>
   <Link href={education.proof.caseStudy || "/portfolio"} className={styles.preview} aria-label="Explore Sufrone Education case study"><Image src="/images/education/school-erp.png" width={1440} height={1000} alt="Bayinah ERPNext demonstration showing a teacher’s school workspace" sizes="(max-width: 1024px) 92vw, 45vw" priority/></Link>
   <h3>{education.title}</h3><p className={styles.status}>ERPNext / Frappe development · Hosted demo</p>
   <p>{education.oneLine}</p><p className={styles.contribution}>My contribution: custom apps, Python business logic, DocTypes, permissions, workflows and APIs.</p>
   <div className={styles.actions}><Link href={education.proof.caseStudy || "/portfolio"} className={styles.primary}>Case study <ArrowRight size={15}/></Link><a href={education.proof.liveDemo} target="_blank" rel="noopener noreferrer">Try demo <ArrowUpRight size={15}/><span className={styles.sr}> (opens in a new tab)</span></a></div>
   <p className={styles.note}>Fictional records · Private source · Active development</p>
  </article>
  <div className={styles.supporting}>{supporting.map(project=><article key={project.slug}><div><h3><Link href={project.proof.caseStudy || "/portfolio"}>{project.title}</Link></h3><p>{project.slug.startsWith("hebatullah") ? "Accounting, item catalogue and procurement workflows for a trading company." : "Production Daraja API integration: STK Push, B2C, C2B and reliable callbacks."}</p></div><Link href={project.proof.caseStudy || "/portfolio"} aria-label={`Read ${project.title} case study`}><ArrowUpRight size={19}/></Link></article>)}</div>
 </section>;
}
