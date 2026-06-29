import type { PricingPlan } from "@/types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with fabric analysis",
    features: [
      "5 uploads per month",
      "Basic AI analysis",
      "Thread density report",
      "100 MB storage",
      "Email support",
    ],
    cta: "Get Started Free",
  },
  {
    id: "student",
    name: "Student",
    price: 9,
    period: "month",
    description: "Ideal for textile students and researchers",
    features: [
      "25 uploads per month",
      "Advanced AI analysis",
      "Downloadable reports",
      "500 MB storage",
      "Weave pattern detection",
      "Priority email support",
    ],
    cta: "Start Student Plan",
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    period: "month",
    description: "For quality control professionals and manufacturers",
    features: [
      "Unlimited uploads",
      "Full AI analysis suite",
      "PDF report export",
      "5 GB storage",
      "Fabric comparison tool",
      "API access",
      "Priority support",
    ],
    popular: true,
    cta: "Go Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "Custom solutions for large textile operations",
    features: [
      "Everything in Professional",
      "Unlimited storage",
      "Custom AI models",
      "Team management",
      "SSO integration",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
  },
];

export const FAQ_ITEMS = [
  {
    category: "Platform",
    questions: [
      {
        q: "What is ThreadCounty?",
        a: "ThreadCounty is an AI-powered textile technology platform that helps manufacturers, students, and quality control professionals analyze fabric structures using computer vision and machine learning.",
      },
      {
        q: "How does the platform work?",
        a: "Simply upload a fabric image (JPG, PNG, or JPEG), and our AI engine analyzes thread density, warp/weft counts, weave patterns, and provides actionable insights within seconds.",
      },
      {
        q: "Is ThreadCounty available on mobile?",
        a: "Yes! ThreadCounty is fully responsive and works seamlessly on desktop, tablet, and mobile devices.",
      },
    ],
  },
  {
    category: "AI Analysis",
    questions: [
      {
        q: "How accurate is the AI analysis?",
        a: "Our AI models achieve 85-98% confidence scores on standard fabric samples. Results include a confidence score so you can assess reliability.",
      },
      {
        q: "What fabric types are supported?",
        a: "We support plain weave, twill, satin, denim, linen, jacquard, knit jersey, oxford weave, and many more fabric structures.",
      },
      {
        q: "Can I download analysis reports?",
        a: "Yes, all paid plans include downloadable reports. Professional and Enterprise plans also support PDF export.",
      },
    ],
  },
  {
    category: "Pricing",
    questions: [
      {
        q: "Is there a free plan?",
        a: "Yes! Our free plan includes 5 uploads per month with basic AI analysis and 100 MB storage — no credit card required.",
      },
      {
        q: "Can I upgrade or downgrade my plan?",
        a: "Absolutely. You can change your subscription plan at any time from your profile settings.",
      },
      {
        q: "Do you offer student discounts?",
        a: "Yes, our Student plan at $9/month is specifically designed for textile students and researchers with verified .edu emails.",
      },
    ],
  },
  {
    category: "Upload Limits",
    questions: [
      {
        q: "What file formats are supported?",
        a: "We accept JPG, JPEG, and PNG image formats up to 10 MB per file.",
      },
      {
        q: "What are the upload limits per plan?",
        a: "Free: 5/month, Student: 25/month, Professional: Unlimited, Enterprise: Unlimited with custom limits.",
      },
      {
        q: "Can I delete uploaded images?",
        a: "Yes, you can delete any uploaded image and its associated report from your history page.",
      },
    ],
  },
  {
    category: "Account",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' on the homepage, enter your email and password, and verify your email address to get started.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and follow the email instructions to reset your password.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can permanently delete your account and all associated data from your profile settings.",
      },
    ],
  },
];

export const FEATURES = [
  {
    title: "AI-Powered Analysis",
    description: "Advanced computer vision algorithms analyze fabric structure with industry-leading accuracy.",
    icon: "Brain",
  },
  {
    title: "Thread Density Detection",
    description: "Automatically measure warp and weft thread counts and calculate thread density.",
    icon: "Grid3x3",
  },
  {
    title: "Weave Pattern Recognition",
    description: "Identify plain, twill, satin, jacquard, and other weave patterns instantly.",
    icon: "Layers",
  },
  {
    title: "Instant Reports",
    description: "Generate comprehensive analysis reports in seconds, ready to download and share.",
    icon: "FileText",
  },
  {
    title: "Upload History",
    description: "Access all your previous analyses with search, filter, and comparison tools.",
    icon: "History",
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security with encrypted storage and role-based access control.",
    icon: "Shield",
  },
];

export const TESTIMONIALS = [
  {
    name: "Dr. Priya Sharma",
    role: "Textile Researcher, IIT Delhi",
    content: "ThreadCounty has revolutionized how we analyze fabric samples in our lab. What used to take hours now takes seconds.",
    avatar: "PS",
  },
  {
    name: "Michael Chen",
    role: "QC Manager, Global Textiles Inc.",
    content: "The accuracy of thread density analysis is impressive. It's become an essential tool in our quality control workflow.",
    avatar: "MC",
  },
  {
    name: "Sarah Johnson",
    role: "Textile Design Student, FIT",
    content: "As a student, the affordable plan gives me access to professional-grade analysis tools. Absolutely love it!",
    avatar: "SJ",
  },
];

export const STATS = [
  { value: "50K+", label: "Fabrics Analyzed" },
  { value: "2,500+", label: "Active Users" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "30+", label: "Countries Served" },
];
