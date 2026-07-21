import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Msah Ambooka for software engineering, business systems, payment integration, IT infrastructure, or platform/MLOps collaborations.",
};

export default function ContactPage() {
  return <Contact isActive={true} />;
}
