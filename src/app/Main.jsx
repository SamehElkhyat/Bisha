import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { FaRegFolderOpen } from "react-icons/fa";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export default function Main() {
  // Parallax effect for background
  const mainRef = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    // Initial animation sequence with staggered timing
    const sequence = async () => {
      // First animate the background and overlay
      await controls.start("backgroundVisible");
      
      // Then animate the logo and hero content
      await controls.start("contentVisible");
      
      // Finally animate the buttons and cards
      await controls.start("elementsVisible");
    };
    
    sequence();
    
    // Parallax effect
    const handleParallax = () => {
      if (!mainRef.current) return;
      const scrollPosition = window.scrollY;
      const opacity = Math.max(0.7 - scrollPosition * 0.001, 0.4);
      mainRef.current.style.setProperty('--overlay-opacity', opacity);
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, [controls]);

  // Animation variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    backgroundVisible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    contentVisible: {
      opacity: 1,
      transition: {
        duration: 0
      }
    },
    elementsVisible: {
      opacity: 1,
      transition: {
        duration: 0
      }
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    backgroundVisible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };
  
  const particlesVariants = {
    hidden: { opacity: 0 },
    backgroundVisible: {
      opacity: 0.5,
      transition: {
        duration: 2,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20, rotateY: 90 },
    contentVisible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const heroTitleVariants = {
    hidden: { opacity: 0, y: 50 },
    contentVisible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.8
      }
    }
  };

  const heroSubtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    contentVisible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 1.1
      }
    }
  };

  const buttonsContainerVariants = {
    hidden: { opacity: 0 },
    elementsVisible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.5
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    elementsVisible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    elementsVisible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.9
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    elementsVisible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  // Glow effect animation
  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: [0, 0.5, 0.3],
      transition: { 
        duration: 2, 
        times: [0, 0.5, 1],
        repeat: Infinity, 
        repeatType: "reverse" 
      }
    }
  };

  // Mouse parallax effect for cards
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.main 
      className={styles.main} 
      ref={mainRef}
      initial="hidden"
      animate={controls}
      variants={backgroundVariants}
    >
      <motion.div 
        className={styles.mainOverlay}
        variants={overlayVariants}
      ></motion.div>
      <motion.div 
        className={styles.particlesOverlay}
        variants={particlesVariants}
      ></motion.div>
      
      <div className={styles.mainContent}>
        {/* Top Section with Logo and Hero Content */}
        <div className={styles.topSection}>
          {/* Logo Container - Now on the left as a button */}
          <motion.button 
            className={styles.logoContainer}
            variants={logoVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}
          >
            <motion.div 
              className={styles.logoGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <Image
              src="/bisha-chamber-logo.png"
              alt="Bisha Chamber Logo"
              className={styles.logo}
              width={320}
              height={320}
              priority
            />
          </motion.button>

          {/* Hero Section with Title and Subtitle */}
          <div className={styles.heroContent}>
            <motion.h1 
              className={styles.heroTitle}
              variants={heroTitleVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <span className={styles.heroTitleGlow} data-text="غرفة بيشة">غرفة بيشة</span>
            </motion.h1>
            <motion.p 
              className={styles.heroSubtitle}
              variants={heroSubtitleVariants}
            >
              أن تكون غرفة بيشة النموذج الناجح والصوت الموثوق لقطاع الأعمال المؤثر في بيشة
            </motion.p>
          </div>
        </div>

        {/* First Row - Main Services */}
        <motion.div 
          className={styles.mainServicesRow}
          variants={buttonsContainerVariants}
        >
          <motion.button
            onClick={() =>
              window.open("https://eservices.bishacci.org.sa/#/Login", "_blank")
            }
            className={styles.primaryButton}
            variants={buttonVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 15px 30px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`
            }}
          >
            <motion.div 
              className={styles.buttonGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            التصديق الإلكتروني
          </motion.button>
          <motion.button 
            className={styles.primaryButton}
            variants={buttonVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 15px 30px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`
            }}
          >
            <motion.div 
              className={styles.buttonGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 13v6M8 13v6M12 17v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            طباعة شهادة العضوية
          </motion.button>
          <motion.button 
            className={styles.primaryButton}
            variants={buttonVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 15px 30px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`
            }}
          >
            <motion.div 
              className={styles.buttonGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            تحديث البيانات
          </motion.button>
          <motion.button 
            className={styles.primaryButton}
            variants={buttonVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 15px 30px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`
            }}
          >
            <motion.div 
              className={styles.buttonGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6l-10 7L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            تجديد الاشتراك
          </motion.button>
        </motion.div>

        {/* Second Row - Service Categories */}
        <motion.div 
          className={styles.servicesCategoriesRow}
          variants={cardsContainerVariants}
        >
          <motion.div 
            className={styles.serviceCard}
            variants={cardVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${-mousePosition.x * 8}deg)`
            }}
          >
            <motion.div 
              className={styles.cardGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.serviceIconWrapper}>
              <div className={styles.serviceIcon}>
                <FaRegFolderOpen size={20} />
              </div>
            </div>
            <div className={styles.serviceContent}>
              <h3>خدمات الإشتراك</h3>
              <p>إدارة العضوية والتجديد</p>
              <div className={styles.serviceArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.serviceCard}
            variants={cardVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${-mousePosition.x * 8}deg)`
            }}
          >
            <motion.div 
              className={styles.cardGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.serviceIconWrapper}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.serviceContent}>
              <h3>خدمات التصديق</h3>
              <p>التصديق والاعتماد الرسمي</p>
              <div className={styles.serviceArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.serviceCard}
            variants={cardVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${-mousePosition.x * 8}deg)`
            }}
          >
            <motion.div 
              className={styles.cardGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.serviceIconWrapper}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12V7H5a2 2 0 01-2-2V3h18v9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 7v10a2 2 0 002 2h16v-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="15" r="1" />
                </svg>
              </div>
            </div>
            <div className={styles.serviceContent}>
              <h3>الخدمات التجارية</h3>
              <p>الدعم والاستشارات التجارية</p>
              <div className={styles.serviceArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.serviceCard}
            variants={cardVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(43, 154, 243, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 8}deg) rotateY(${-mousePosition.x * 8}deg)`
            }}
          >
            <motion.div 
              className={styles.cardGlow}
              initial="hidden"
              animate="visible"
              variants={glowVariants}
            ></motion.div>
            <div className={styles.serviceIconWrapper}>
              <div className={styles.serviceIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.serviceContent}>
              <h3>المجالس القطاعية</h3>
              <p>اللجان والمجالس المتخصصة</p>
              <div className={styles.serviceArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  );
}