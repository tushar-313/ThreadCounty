"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileBarChart } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Fabric Image",
    description: "Drag and drop your fabric image (JPG, PNG, JPEG) up to 10MB. Our system validates and processes it instantly.",
    step: "01",
  },
  {
    icon: Cpu,
    title: "AI Analysis Engine",
    description: "Our computer vision AI analyzes thread density, warp/weft counts, weave patterns, and fabric structure in seconds.",
    step: "02",
  },
  {
    icon: FileBarChart,
    title: "Get Detailed Report",
    description: "View comprehensive results with confidence scores, AI suggestions, and download shareable reports.",
    step: "03",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps from upload to actionable insights.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="absolute top-12 left-[60%] hidden h-0.5 w-[80%] bg-primary/30 md:block dark:bg-primary/50" />
              )}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 dark:shadow-primary/20">
                <step.icon className="h-10 w-10" />
              </div>
              <span className="mt-4 inline-block text-sm font-bold text-primary">STEP {step.step}</span>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
