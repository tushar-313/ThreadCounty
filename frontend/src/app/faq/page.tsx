"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FAQ_ITEMS } from "@/lib/constants";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about ThreadCounty.
            </p>
          </motion.div>

          <div className="mt-16 space-y-8">
            {FAQ_ITEMS.map((category) => (
              <div key={category.category}>
                <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                <Accordion>
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${category.category}-${i}`}>
                      <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
