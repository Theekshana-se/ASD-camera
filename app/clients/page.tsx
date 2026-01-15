"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaUsers, FaGlobe, FaStar, FaHandshake, FaCheck } from "react-icons/fa";
import apiClient from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
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

type ClientLogo = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  href?: string | null;
  order: number;
  active: boolean;
};

export default function ClientsPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  const heroImage = "/pexels-format-1029757.jpg";
  const infoRef = useRef(null);
  const logosRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-100px" });
  const logosInView = useInView(logosRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await apiClient.get(`/api/client-logos?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        const activeLogos = (Array.isArray(data) ? data : [])
          .filter((logo: ClientLogo) => logo.active)
          .sort((a: ClientLogo, b: ClientLogo) => a.order - b.order);
        setLogos(activeLogos);
      } catch (error) {
        console.error("Failed to fetch client logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  const statsInfo = [
    {
      icon: FaUsers,
      title: "Trusted Clients",
      number: logos.length > 0 ? `${logos.length}+` : "50+",
      description: "Global Partners",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaGlobe,
      title: "Countries Served",
      number: "50+",
      description: "Worldwide Reach",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: FaStar,
      title: "Satisfaction Rate",
      number: "99%",
      description: "Client Happiness",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FaHandshake,
      title: "Years Experience",
      number: "10+",
      description: "Industry Expertise",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="Our Customers hero"
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
          className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/90"
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
          <div className="max-w-screen-2xl mx-auto h-full px-6 grid items-center justify-center text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-3 justify-center mb-2"
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-12 h-1 bg-red-500"
                />
                <span className="text-white/80 text-sm uppercase tracking-[0.2em] font-medium">Trusted Partners</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-12 h-1 bg-red-500"
                />
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
              >
                Our <span className="text-red-500">Customers</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-white/80 max-w-2xl text-lg leading-relaxed mx-auto"
              >
                We're proud to partner with leading brands and organizations worldwide.
                Our commitment to excellence has earned the trust of industry leaders.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section ref={infoRef} className="relative z-10 -mt-20 px-6 pb-24">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            {statsInfo.map((info, index) => (
              <motion.div
                key={info.title}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl ring-1 ring-black/5 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${info.gradient} opacity-10 rounded-bl-full transition-all duration-300 group-hover:scale-150`} />

                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} text-white flex items-center justify-center shadow-lg mb-6`}
                >
                  <info.icon className="text-2xl" />
                </motion.div>

                <h3 className="text-3xl font-bold text-gray-900 mb-1">{info.number}</h3>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{info.title}</p>
                <p className="text-xs text-gray-500 mt-1">{info.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Customer Logos Section */}
      <section ref={logosRef} className="bg-gray-50 py-24 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate={logosInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry <span className="text-red-500">Leaders</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust us for their equipment needs
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-2xl h-32 shadow-lg"
                />
              ))}
            </div>
          ) : logos.length === 0 ? (
            <motion.div
              initial="hidden"
              animate={logosInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="bg-white rounded-3xl p-16 shadow-xl ring-1 ring-black/5 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Building Partnerships
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're actively building partnerships with amazing brands. Check back soon to see our growing list of trusted clients!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate={logosInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 rounded-bl-full transition-all duration-300" />
                      <div className="relative w-full h-20 flex items-center justify-center">
                        <Image
                          src={getImageUrl(logo.imageUrl)}
                          alt={logo.alt || "Client logo"}
                          width={150}
                          height={80}
                          className="object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-black/5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 rounded-bl-full transition-all duration-300" />
                      <div className="relative w-full h-20 flex items-center justify-center">
                        <Image
                          src={getImageUrl(logo.imageUrl)}
                          alt={logo.alt || "Client logo"}
                          width={150}
                          height={80}
                          className="object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 pb-24 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden"
          >
            {/* Background effect */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Want to Join Our <span className="text-red-500">Partners</span>?
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We're always looking to collaborate with innovative brands and organizations.
                Let's create something amazing together and build a lasting partnership.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                >
                  <FaHandshake className="text-xl" />
                  Get In Touch
                </motion.a>

                <motion.a
                  href="/about"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-all border border-white/20"
                >
                  Learn More About Us
                </motion.a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold mb-6">Why Partner With Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    "Premium quality equipment and services",
                    "Dedicated account management",
                    "Flexible partnership terms",
                    "24/7 priority support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheck className="text-xs" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
