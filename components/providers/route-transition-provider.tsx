"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface RouteTransitionContextValue {
  beginTransition: () => void;
  isTransitioning: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const completedPathRef = useRef(pathname);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (completedPathRef.current === pathname) {
      return;
    }

    completedPathRef.current = pathname;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      timeoutRef.current = null;
    }, 220);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function beginTransition() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsTransitioning(true);
  }

  return (
    <RouteTransitionContext.Provider value={{ beginTransition, isTransitioning }}>
      {children}
      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            key="route-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[1200]"
          >
            <div className="relative h-1.5 w-full overflow-hidden bg-bark/8">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/3 rounded-r-full bg-gradient-to-r from-moss via-sage to-moss-light"
                initial={{ x: "-120%" }}
                animate={{ x: ["-120%", "360%"] }}
                transition={{ duration: 1.05, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-white/50 bg-cream/92 px-4 py-2 shadow-soft backdrop-blur-md"
            >
              <Image src="/icons/logo-mark.svg" alt="CampusShare" width={36} height={36} className="h-9 w-9" />
              <div className="text-sm text-bark-light">Loading next page</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error("useRouteTransition must be used within RouteTransitionProvider");
  }

  return context;
}
