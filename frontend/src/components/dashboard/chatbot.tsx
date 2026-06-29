"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  greeting: "Hello! I am your ThreadCounty Textile Assistant. How can I help you with fabric analysis, thread counts, or weave patterns today?",
  density: "Thread density refers to the number of warp and weft threads per unit of measurement (typically threads per inch). ThreadCounty automates this count using computer vision.",
  warp: "Warp threads run vertically (lengthwise) in a woven fabric. They are stretched on the loom before weaving begins.",
  weft: "Weft threads run horizontally (widthwise) across the fabric. They are woven over and under the warp threads.",
  twill: "Twill weave is characterized by diagonal rib lines (like denim). It is highly durable and hides soil/stains well.",
  plain: "Plain weave is the simplest and most common weave pattern. Warp and weft threads cross over each other in a basic 1-up, 1-down alternating pattern (like cotton canvas).",
  satin: "Satin weave has long 'floats' of warp or weft threads, creating a very smooth, lustrous, and glossy surface. It is more prone to snagging than plain or twill.",
  denim: "Denim is a durable twill-weave cotton fabric. The weft passes under two or more warp threads, producing the classic diagonal ribbing.",
  accuracy: "ThreadCounty's AI models operate with an average confidence level of 85-98% depending on the lighting and sharpness of your uploaded fabric image.",
  contact: "You can send us a message through our Contact page or view admin messages in your dashboard if you're an administrator.",
  help: "I can answer questions about warp/weft thread counts, plain/twill/satin weave types, ThreadCounty confidence scores, and troubleshooting analysis uploads. Try asking 'What is twill?' or 'Explain warp'."
};

function getBotResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
    return KNOWLEDGE_BASE.greeting;
  }
  if (msg.includes("density") || msg.includes("thread count")) {
    return KNOWLEDGE_BASE.density;
  }
  if (msg.includes("warp")) {
    return KNOWLEDGE_BASE.warp;
  }
  if (msg.includes("weft")) {
    return KNOWLEDGE_BASE.weft;
  }
  if (msg.includes("twill") || msg.includes("diagonal")) {
    return KNOWLEDGE_BASE.twill;
  }
  if (msg.includes("plain") || msg.includes("canvas")) {
    return KNOWLEDGE_BASE.plain;
  }
  if (msg.includes("satin") || msg.includes("glossy")) {
    return KNOWLEDGE_BASE.satin;
  }
  if (msg.includes("denim")) {
    return KNOWLEDGE_BASE.denim;
  }
  if (msg.includes("accuracy") || msg.includes("confidence") || msg.includes("reliable")) {
    return KNOWLEDGE_BASE.accuracy;
  }
  if (msg.includes("contact") || msg.includes("support")) {
    return KNOWLEDGE_BASE.contact;
  }
  if (msg.includes("help") || msg.includes("what can you")) {
    return KNOWLEDGE_BASE.help;
  }
  
  return "That is an interesting question! For specific weave patterns or complex structural diagnostics, I recommend uploading a fabric sample image on our 'Upload Fabric' page to let our AI model perform a complete density scan.";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to ThreadCounty! Ask me any questions about thread counts, warp & weft, or fabric weaves.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl flex items-center justify-center cursor-pointer"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="w-[360px] sm:w-[380px]"
          >
            <Card className="shadow-2xl border border-primary/10 dark:border-primary/20 flex flex-col h-[480px] overflow-hidden">
              <CardHeader className="bg-primary dark:bg-primary/20 dark:bg-primary/10 text-white p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Textile AI Helper
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-primary/90/50 hover:text-white h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent 
                ref={scrollRef} 
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/20 scrollbar-thin scrollbar-thumb-muted"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === "user" 
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:bg-primary/10 dark:text-primary/70"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5 text-primary" />}
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-card border rounded-tl-none text-foreground"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <div className="h-7 w-7 rounded-full bg-muted-foreground/10 flex items-center justify-center shrink-0">
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    </div>
                    <div className="bg-card border rounded-2xl rounded-tl-none px-3 py-2 text-xs text-muted-foreground shadow-sm flex items-center gap-1.5 font-medium">
                      Assistant is typing...
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-3 border-t bg-card">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask about Twill, Warp, Weft..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend} 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
