"use client";

import { useState, useSyncExternalStore } from "react";
import Preloader from "@/components/ui/Preloader";

type FramesWindow = Window & { __24FRAMES_INITIAL_LOAD_DONE__?: boolean };

const noop = () => () => {};
/** Show the preloader on a fresh visit, not on ?direct links or in-app navigation. */
const wantsPreloader = () => {
  const w = window as FramesWindow;
  return !(w.location.search.includes("direct") || w.__24FRAMES_INITIAL_LOAD_DONE__);
};

export default function HomePreloader() {
  // The server always renders the preloader (so the first paint is the
  // curtain, never a flash of content); the browser then decides. Using an
  // external store keeps server and client markup identical while hydrating.
  const wanted = useSyncExternalStore(noop, wantsPreloader, () => true);
  const [done, setDone] = useState(false);

  const handlePreloaderComplete = () => {
    (window as FramesWindow).__24FRAMES_INITIAL_LOAD_DONE__ = true;
    setDone(true);
  };

  if (!wanted || done) return null;
  return <Preloader onComplete={handlePreloaderComplete} />;
}
