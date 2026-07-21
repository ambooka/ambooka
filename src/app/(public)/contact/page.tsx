import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Abdulrahman Ambooka Msah about software, backend, payment-integration, ERP, or IT-infrastructure opportunities.",
};

export default function ContactPage() {
  return <Contact isActive={true} />;
}
