"use client";

import HeroPhysics from "@/components/HeroPhysics";
import MagneticLink from "@/components/MagneticLink";
import { FloatingSkeletonGrid } from "@/components/FloatingSkeleton";
import OrbitalLoader from "@/components/OrbitalLoader";
import { motion } from "framer-motion";

export default function AntigravityDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section with Physics */}
      <section className="relative">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 font-mono">
              ZERO GRAVITY
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-mono">
              Scroll to activate physics
            </p>
          </motion.div>
        </div>
        <HeroPhysics />
      </section>

      {/* Magnetic Navigation Demo */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 font-mono">MAGNETIC NAVIGATION</h2>
          <div className="flex flex-wrap gap-8">
            <MagneticLink
              href="#"
              className="text-2xl font-mono border border-white/20 px-8 py-4 hover:bg-white/5 transition-colors"
            >
              Home
            </MagneticLink>
            <MagneticLink
              href="#"
              className="text-2xl font-mono border border-white/20 px-8 py-4 hover:bg-white/5 transition-colors"
            >
              About
            </MagneticLink>
            <MagneticLink
              href="#"
              className="text-2xl font-mono border border-white/20 px-8 py-4 hover:bg-white/5 transition-colors"
            >
              Work
            </MagneticLink>
            <MagneticLink
              href="#"
              className="text-2xl font-mono border border-white/20 px-8 py-4 hover:bg-white/5 transition-colors"
            >
              Contact
            </MagneticLink>
          </div>
          <p className="mt-8 text-white/60 font-mono">
            Hover over the links to feel the magnetic attraction
          </p>
        </div>
      </section>

      {/* Floating Skeletons Demo */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 font-mono">FLOATING SKELETONS</h2>
          <FloatingSkeletonGrid count={3} />
          <p className="mt-8 text-white/60 font-mono">
            Loading states that drift in zero gravity
          </p>
        </div>
      </section>

      {/* Orbital Loader Demo */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 font-mono">ORBITAL LOADER</h2>
          <div className="flex justify-center">
            <OrbitalLoader />
          </div>
          <p className="mt-8 text-center text-white/60 font-mono">
            Orbital mechanics in motion
          </p>
        </div>
      </section>

      {/* Smooth Scroll Info */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 font-mono">LIQUID SCROLL</h2>
          <p className="text-xl text-white/60 font-mono max-w-2xl mx-auto">
            Notice how the scrolling feels smooth and heavy, like moving through water.
            This is powered by Lenis smooth scroll with custom lerp and duration settings.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 font-mono">TECH STACK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Matter.js", desc: "2D Physics Engine" },
              { name: "Lenis", desc: "Smooth Scroll" },
              { name: "Framer Motion", desc: "Spring Physics" },
              { name: "Next.js", desc: "React Framework" },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-white/20 hover:bg-white/5 transition-colors"
              >
                <h3 className="text-2xl font-bold mb-2 font-mono">{tech.name}</h3>
                <p className="text-white/60 font-mono">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/10 text-center">
        <p className="text-white/40 font-mono">
          Zero-Gravity UX System © 2026
        </p>
      </footer>
    </div>
  );
}
