"use client";
import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FaAward, FaClock, FaUsers, FaShieldAlt, FaCamera, FaVideo, FaUserTie } from "react-icons/fa";
import { useSettings } from "@/Providers";
import { useRef } from "react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Animated counter component
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function AboutPage() {
  const settings = useSettings() || {};
  const heroTitle = settings?.heroTitle || "ASD Camera Rent";
  const heroSubtitle = settings?.heroSubtitle || "Empowering creativity through professional camera equipment and expert services";
  const heroImage = settings?.heroImageUrl || "/pexels-format-1029757.jpg";

  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const storyRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="About hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        
        {/* Animated gradient overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" 
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0">
          <div className="max-w-screen-2xl mx-auto h-full px-10 grid items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-3"
              >
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-12 h-1 bg-red-500 origin-left"
                />
                <span className="text-white/80 text-sm uppercase tracking-[0.2em] font-medium">Since 2010</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="text-6xl font-extrabold text-white max-md:text-4xl leading-tight"
              >
                {heroTitle.split(" ").slice(0, 1).join(" ")}{" "}
                <motion.span 
                  className="text-red-500 inline-block"
                  animate={{ 
                    textShadow: ["0 0 20px rgba(255,31,31,0)", "0 0 40px rgba(255,31,31,0.5)", "0 0 20px rgba(255,31,31,0)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {heroTitle.split(" ").slice(1).join(" ")}
                </motion.span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="text-white/90 max-w-2xl text-lg leading-relaxed"
              >
                {heroSubtitle} since 2010
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex gap-4 pt-4"
              >
                <motion.a
                  href="/shop"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,31,31,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Explore Equipment
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
                >
                  Contact Us
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/80 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats row */}
      <section ref={statsRef} className="bg-white relative">
        <div className="max-w-screen-2xl mx-auto px-6 -mt-16 relative z-10">
          <motion.div 
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-4 gap-6 max-lg:grid-cols-2"
          >
            {[
              { icon: FaAward, value: 15, suffix: "+", label: "Years of Excellence", color: "from-red-500 to-orange-500" },
              { icon: FaClock, value: 24, suffix: "/7", label: "Service Available", color: "from-blue-500 to-cyan-500" },
              { icon: FaUsers, value: 1000, suffix: "+", label: "Happy Clients", color: "from-green-500 to-emerald-500" },
              { icon: FaShieldAlt, value: 100, suffix: "%", label: "Reliable Service", color: "from-purple-500 to-pink-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                className="relative group rounded-2xl bg-white shadow-lg ring-1 ring-black/5 p-6 flex items-center gap-4 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <div className="relative">
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Services */}
      <section ref={servicesRef} className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              What We Offer
            </motion.span>
            <h2 className="text-4xl font-bold text-gray-900">
              Our <span className="text-red-600">Services</span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Professional equipment and expert services for all your creative needs
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            {[
              { 
                icon: FaCamera, 
                title: "Camera Equipment Rental", 
                desc: "Professional cameras and videography equipment for all your creative needs.",
                gradient: "from-red-500 to-orange-500"
              },
              { 
                icon: FaUserTie, 
                title: "Photographer Supply", 
                desc: "Skilled photographers ready to capture your perfect moments.",
                gradient: "from-blue-500 to-purple-500"
              },
              { 
                icon: FaVideo, 
                title: "Videographer Services", 
                desc: "Expert videographers for films, TV, advertising, and events.",
                gradient: "from-green-500 to-teal-500"
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -12 }}
                className="relative group rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-8 transition-all duration-500 overflow-hidden"
              >
                {/* Animated gradient border on hover */}
                <motion.div 
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{ padding: "2px" }}
                >
                  <div className="absolute inset-[2px] bg-white rounded-3xl" />
                </motion.div>
                
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center mb-6 shadow-xl`}
                  >
                    <service.icon className="w-8 h-8" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-6 flex items-center gap-2 text-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span>Learn More</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Our Story */}
      <section ref={storyRef} className="bg-white py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Journey
            </motion.span>
            <h2 className="text-4xl font-bold text-gray-900">
              About <span className="text-red-600">Our Story</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-8 max-lg:grid-cols-1"
          >
            {[
              { 
                title: "Since 2010", 
                desc: "ASD Camera Rent is a premier company providing camera & videography equipment and photographer & videographer supply services in Sri Lanka since 2010.",
                dark: true,
                delay: 0
              },
              { 
                title: "24/7 Availability", 
                desc: "Our operations and services are available 24 hours a day & 7 days every week, delivering instant solutions to your continuing needs.",
                dark: false,
                delay: 0.1
              },
              { 
                title: "Trusted Partnership", 
                desc: "Operating as an affiliate under Vimukthi Holdings, we maintain strong partnerships to ensure quality and reliability.",
                dark: true,
                delay: 0.2
              },
              { 
                title: "Our Commitment", 
                desc: "Our goal is to provide services in a consistent, reliable, and timely manner, supporting your creative journey end‑to‑end.",
                dark: false,
                delay: 0.3
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative rounded-3xl p-8 transition-all duration-500 overflow-hidden ${
                  item.dark 
                    ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white" 
                    : "bg-white ring-1 ring-black/5 shadow-lg"
                }`}
              >
                {/* Decorative element */}
                <motion.div 
                  className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
                    item.dark ? "bg-red-500/20" : "bg-red-500/10"
                  }`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative">
                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <span className={`w-2 h-8 rounded-full ${item.dark ? "bg-red-500" : "bg-gradient-to-b from-red-500 to-orange-500"}`} />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </motion.div>
                  <p className={item.dark ? "text-white/80 leading-relaxed" : "text-gray-600 leading-relaxed"}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800">
          <motion.div
            className="absolute w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl -left-64 top-0"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -right-32 bottom-0"
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="relative max-w-screen-2xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Ready to Create{" "}
              <motion.span 
                className="text-red-500"
                animate={{ 
                  textShadow: ["0 0 20px rgba(255,31,31,0.3)", "0 0 40px rgba(255,31,31,0.6)", "0 0 20px rgba(255,31,31,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Something Amazing?
              </motion.span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-white/80 mt-6 text-lg max-w-2xl mx-auto"
            >
              Let us help you bring your vision to life with our professional equipment and expert services.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex gap-4 justify-center flex-wrap"
            >
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,31,31,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
              >
                Get Started Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="/shop"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold border border-white/20 hover:bg-white/20 transition-colors"
              >
                Browse Equipment
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
