"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const team = [
  { name: "Dr. Ananya Patel", role: "CEO & Co-Founder", bio: "20+ years in textile engineering and AI research." },
  { name: "James Wilson", role: "CTO", bio: "Former ML lead at major tech companies, PhD in Computer Vision." },
  { name: "Maria Garcia", role: "Head of Product", bio: "Product leader with deep textile industry experience." },
  { name: "Raj Kumar", role: "Lead AI Engineer", bio: "Specialist in fabric pattern recognition and deep learning." },
];

const timeline = [
  { year: "2022", event: "ThreadCounty founded with a vision to democratize textile analysis" },
  { year: "2023", event: "Launched beta platform with 500+ early adopters" },
  { year: "2024", event: "Reached 2,500+ users across 30 countries" },
  { year: "2025", event: "Released AI v2.0 with 98% accuracy on standard fabrics" },
  { year: "2026", event: "Enterprise platform launch with custom AI models" },
];

const technologies = ["Computer Vision", "Deep Learning", "Next.js", "Python", "Supabase", "Cloud AI"];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">About ThreadCounty</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;re on a mission to revolutionize textile inspection through artificial intelligence,
              making professional-grade fabric analysis accessible to everyone.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                  To empower textile manufacturers, students, researchers, and quality control professionals
                  with AI-powered tools that simplify fabric structure analysis and improve quality standards worldwide.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground">
                  A world where every textile professional has instant access to accurate, AI-driven fabric analysis —
                  reducing waste, improving quality, and accelerating innovation in the textile industry.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center">Technology Stack</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">{tech}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center">Our Team</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold dark:bg-primary/20 dark:bg-primary/10">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <h3 className="mt-4 font-semibold">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center">Our Journey</h2>
            <div className="mt-12 max-w-2xl mx-auto">
              {timeline.map((item, i) => (
                <motion.div key={item.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">{item.year.slice(2)}</div>
                    {i < timeline.length - 1 && <div className="mt-2 h-full w-0.5 bg-primary/20" />}
                  </div>
                  <div className="pb-8">
                    <p className="font-bold text-primary">{item.year}</p>
                    <p className="mt-1 text-muted-foreground">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
