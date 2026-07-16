"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const screens = [
  { n: "01", title: "Onboarding", desc: "Pick class P4–P7. One job, done.", href: "/onboarding/" },
  { n: "02", title: "Home", desc: "Continue where you left off, then subjects.", href: "/home/" },
  { n: "03", title: "Subjects", desc: "Mathematics & Social Studies with clear progress.", href: "/subjects/" },
  { n: "04", title: "Learning module", desc: "Readable lesson + short check question at the bottom.", href: "/module/" },
  { n: "05", title: "Practice", desc: "Quick drills with real input and feedback.", href: "/practice/" },
  { n: "06", title: "Parent dashboard", desc: "Track progress without noise.", href: "/parent/" },
];

export default function Launcher() {
  return (
    <main className="min-h-screen bg-background">
      <div className="launcher-hero">
        <p className="eyebrow">ELIMU · UGANDA PRIMARY</p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl mb-5"
        >
          Learn simply. Keep going.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lead text-lg"
        >
          Premium mobile-first product for P4–P7. Content-first, age-right, built for families who invest in learning.
        </motion.p>
      </div>

      <div className="screen-grid">
        {screens.map((screen, i) => (
          <motion.div
            key={screen.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          >
            <Link href={screen.href} className="screen-card">
              <span className="n">{screen.n}</span>
              <h3>{screen.title}</h3>
              <p>{screen.desc}</p>
              <span className="go">Open →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
