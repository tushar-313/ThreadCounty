"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1.5 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Parse value (e.g., "50K+" -> numeric: 50, prefix/suffix: "K+")
    // Match numbers including decimals
    const match = value.match(/([\d,.]+)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numStr = match[0];
    const cleanNumStr = numStr.replace(/,/g, "");
    const target = parseFloat(cleanNumStr);
    
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const prefix = value.substring(0, match.index);
    const suffix = value.substring((match.index || 0) + numStr.length);

    let start = 0;
    const end = target;
    const startTime = performance.now();

    const isDecimal = numStr.includes(".");
    const hasCommas = numStr.includes(",");

    const updateNumber = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad function for smooth deceleration
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;

      let formattedNum = "";
      if (isDecimal) {
        // Match decimal places of original target
        const decimals = numStr.split(".")[1]?.length || 1;
        formattedNum = current.toFixed(decimals);
      } else {
        formattedNum = Math.floor(current).toString();
      }

      if (hasCommas) {
        formattedNum = formattedNum.replace(/\B(?=(\d{3})+(?!\n))/g, ",");
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(value); // Ensure precise target value is shown at the end
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue}</span>;
}
