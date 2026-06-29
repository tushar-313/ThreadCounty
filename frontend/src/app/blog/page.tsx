"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of AI in Textile Manufacturing",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we analyze fabric structures and improve quality control in modern mills.",
    category: "Technology",
    author: "Dr. Sarah Chen",
    date: "Jun 15, 2026",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Understanding Weave Patterns with Computer Vision",
    excerpt: "A deep dive into how computer vision algorithms can automatically classify plain, twill, and satin weaves from high-resolution images.",
    category: "Computer Vision",
    author: "James Wilson",
    date: "Jun 02, 2026",
    image: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Calculating Thread Density: Manual vs Automated",
    excerpt: "We compare traditional pick glass methods against our modern AI automated approach. See the accuracy and speed differences.",
    category: "Quality Control",
    author: "Elena Rodriguez",
    date: "May 28, 2026",
    image: "https://images.unsplash.com/photo-1584441405886-bc91ea615844?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Sustainable Textiles and AI Verification",
    excerpt: "How brands are using AI structure verification to ensure the authenticity of recycled and sustainable textile fibers in their supply chain.",
    category: "Sustainability",
    author: "Michael Chang",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-muted/30 py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              ThreadCounty Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              Insights, tutorials, and updates from the forefront of AI-powered textile technology.
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col"
                >
                  <Card className="flex flex-1 flex-col overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-2">
                        <Badge className="bg-primary/90 hover:bg-primary">{post.category}</Badge>
                      </div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
