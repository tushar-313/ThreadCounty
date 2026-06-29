"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Loader2, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PRICING_PLANS } from "@/lib/constants";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function PayContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const plan = PRICING_PLANS.find(p => p.id === planId) || PRICING_PLANS[0];

  const getStorageLimit = (planId: string) => {
    switch (planId) {
      case "free": return 100;
      case "student": return 500;
      case "professional": return 5000;
      case "enterprise": return 999999;
      default: return 100;
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("You must be logged in to upgrade");
        router.push("/login");
        return;
      }

      // Update the user's plan via the API
      await api.updateProfile(session.access_token, {
        subscription_plan: plan.id,
        storage_limit_mb: getStorageLimit(plan.id),
      });

      toast.success(`Successfully upgraded to ${plan.name} plan!`);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upgrade plan.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/pricing"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing</Link>
        </Button>

        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="bg-primary/10 p-6 flex items-center justify-between border-b border-border/50">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">Checkout</p>
              <h2 className="text-2xl font-bold mt-1">Upgrade to {plan.name}</h2>
            </div>
            <div className="bg-primary text-white rounded-full p-3 shadow-lg">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            <Alert variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Mock Payment Environment</AlertTitle>
              <AlertDescription>
                Actual payment is not integrated. This is a demonstration page. Clicking "Pay Now" will simulate a successful transaction and instantly upgrade your account.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{plan.name} Plan ({plan.period})</span>
                <span className="font-medium">${plan.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="font-bold">Total Due Today</span>
                <span className="text-2xl font-bold text-primary">${plan.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">What you get:</h3>
              <ul className="space-y-2">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className="p-6 bg-muted/10 border-t border-border/50">
            <Button 
              className="w-full h-12 text-lg font-bold" 
              onClick={handlePay} 
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                `Pay $${plan.price.toFixed(2)} Now`
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <PayContent />
    </Suspense>
  );
}
