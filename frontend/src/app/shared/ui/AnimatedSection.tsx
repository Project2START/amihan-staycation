// components/AnimatedSection.js
"use client"; // important in Next.js 13+ app directory for client-side behavior
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function AnimatedSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 }); // triggers when 20% of element is visible

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
