"use client";

import { useState } from "react";
import Preloader from "@/components/ui/Preloader";

export default function HomePreloader() {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === "undefined") return false;
    const isDirect = window.location.search.includes("direct");
    const isInternalNav = (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean })
      .__24FRAMES_INITIAL_LOAD_DONE__;
    return !(isDirect || isInternalNav);
  });

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean }).__24FRAMES_INITIAL_LOAD_DONE__ = true;
    }
    setShowPreloader(false);
  };

  if (!showPreloader) return null;

  return <Preloader onComplete={handlePreloaderComplete} />;
}

