"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheck } from "react-icons/fa";
import { useSettings } from "@/Providers";

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

const contactInfo = [
  {
    icon: FaPhone,
    title: "Call Us",
    details: ["+94 70 162 260", "+94 76 771 1111"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: FaEnvelope,
    title: "Email Us",
    details: ["admin@singitronic.com", "support@singitronic.com"],
    gradient: "from-red-500 to-orange-500"
  },
  {
    icon: FaMapMarkerAlt,
    title: "Visit Us",
    details: ["123 Camera Lane, Colombo", "Sri Lanka"],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: FaClock,
    title: "Working Hours",
    details: ["Mon - Sun: 24 Hours", "Always Available"],
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function ContactPage() {
  const settings = useSettings();
  const heroImage = "/pexels-format-1029757.jpg"; // Reusing the high-quality image or use a specific one if available

  const infoRef = useRef(null);
  const formRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSuccess(false), 5000);
  };

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
            alt="Contact hero"
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
                <span className="text-white/80 text-sm uppercase tracking-[0.2em] font-medium">Get In Touch</span>
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
                Contact <span className="text-red-500">Us</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-white/80 max-w-2xl text-lg leading-relaxed mx-auto"
              >
                We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section ref={infoRef} className="relative z-10 -mt-20 px-6 pb-24">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div 
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            {contactInfo.map((info, index) => (
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
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 font-medium">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section ref={formRef} className="bg-gray-50 py-24 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl ring-1 ring-black/5"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Message</h2>
              <p className="text-gray-500 mb-8">Feel free to ask anything. We usually reply within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Your Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                    placeholder="How can we help?"
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium resize-none"
                    placeholder="Write your message here..."
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all ${
                      isSuccess ? "bg-green-500" : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    }`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : isSuccess ? (
                      <>
                        <FaCheck /> Message Sent!
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-3 shadow-xl ring-1 ring-black/5 h-[400px] relative overflow-hidden group">
                {/* Map Placeholder */}
                <div className="w-full h-full rounded-2xl bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200" 
                    style={{
                      backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 group-hover:bg-transparent transition-colors">
                    <motion.div 
                      whileHover={{ scale: 1.1, y: -10 }}
                      className="bg-red-600 text-white p-4 rounded-full shadow-2xl z-10 relative"
                    >
                      <FaMapMarkerAlt className="text-3xl" />
                      <div className="absolute w-full h-full bg-red-600 rounded-full animate-ping opacity-75 inset-0 -z-10" />
                    </motion.div>
                  </div>
                  {/* Google Maps Embed could go here */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                    ASD Camera Rent, Colombo
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Why Visit Us?</h3>
                  <ul className="space-y-4">
                    {[
                      "Experience equipment hands-on before renting",
                      "Expert consultation for your specific needs",
                      "Instant verification and quick pickup",
                      "Coffee and creative community space"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaCheck className="text-xs" />
                        </div>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Background effect */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
