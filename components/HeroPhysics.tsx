"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSettings } from "@/Providers";

// Default camera product images (can be replaced via admin)
const DEFAULT_PRODUCT_IMAGES = [
  "/camera1.png",
  "/camera2.png",
  "/lens1.png",
  "/camera3.png",
  "/tripod.png",
  "/mic.png",
];

export default function AntigravityHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  const settingsData = useSettings() || {};
  const title = settingsData?.heroTitle || "Premium Camera Equipment Rental";
  const subtitle = settingsData?.heroSubtitle || "Professional gear for photographers, videographers, and content creators";

  useEffect(() => {
    // Fetch product images from API or use defaults
    const loadImages = async () => {
      try {
        // You can fetch from your products API here
        // For now, using default images
        setProductImages(DEFAULT_PRODUCT_IMAGES);
      } catch {
        setProductImages(DEFAULT_PRODUCT_IMAGES);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!sceneRef.current || productImages.length === 0) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Create engine with zero gravity initially
    const engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 },
    });
    engineRef.current = engine;

    // Create renderer (hidden canvas for physics)
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    const wallThickness = 50;
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create boundaries
    const walls = [
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
      Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      }),
    ];

    Composite.add(engine.world, walls);

    // Create floating image bodies
    const blocks: Matter.Body[] = [];
    const imageSize = 120; // Size of floating images

    productImages.slice(0, 8).forEach((img, index) => {
      const x = Math.random() * (width - 300) + 150;
      const y = Math.random() * 200 + 50;

      const block = Bodies.rectangle(x, y, imageSize, imageSize, {
        restitution: 0.7,
        friction: 0.02,
        density: 0.001,
        render: {
          sprite: {
            texture: img,
            xScale: 1,
            yScale: 1,
          },
        },
        label: `product-${index}`,
      });

      // Add gentle floating motion
      Matter.Body.setVelocity(block, {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
      });

      blocks.push(block);
    });

    Composite.add(engine.world, blocks);

    // Mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // Repulsion effect
    Events.on(mouseConstraint, "mousemove", (event) => {
      const mousePosition = event.mouse.position;
      blocks.forEach((block) => {
        const dx = block.position.x - mousePosition.x;
        const dy = block.position.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 150;

        if (distance < repulsionRadius) {
          const force = ((repulsionRadius - distance) / repulsionRadius) * 0.01;
          Matter.Body.applyForce(block, block.position, {
            x: (dx / distance) * force,
            y: (dy / distance) * force,
          });
        }
      });
    });

    // Run engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Scroll detection for gravity
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
        engine.gravity.y = 1;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Resize handler
    const handleResize = () => {
      if (sceneRef.current && renderRef.current) {
        render.canvas.width = sceneRef.current.clientWidth;
        render.canvas.height = sceneRef.current.clientHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [hasScrolled, productImages]);

  return (
    <section className="relative w-full h-[700px] overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient-shift" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed" />

      {/* Physics canvas (hidden, just for calculations) */}
      <div
        ref={sceneRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ overflow: "hidden" }}
      />

      {/* Content overlay */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent leading-tight"
          >
            {title}
          </motion.h1>

          {/* Animated subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10">Explore Equipment</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200">
              Contact Us
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16"
          >
            <p className="text-sm text-gray-500 mb-2">Scroll to activate physics</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating product images overlay (synced with physics) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* These will be positioned based on Matter.js physics */}
        {productImages.slice(0, 8).map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute"
            style={{
              left: `${10 + (index % 4) * 25}%`,
              top: `${10 + Math.floor(index / 4) * 40}%`,
            }}
          >
            <div className="relative w-32 h-32 drop-shadow-2xl hover:scale-110 transition-transform duration-300">
              <Image
                src={img}
                alt={`Product ${index + 1}`}
                fill
                className="object-contain filter drop-shadow-lg"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
