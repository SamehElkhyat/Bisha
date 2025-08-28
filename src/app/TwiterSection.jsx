import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/TwitterSection.module.css';

export default function TwitterSection() {
  const controls = useAnimation();
  const imageRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Apply subtle rotation based on mouse position
      controls.start({
        rotateY: x * 10,
        rotateX: -y * 10,
        transition: { type: "spring", stiffness: 100, damping: 30 }
      });
    };
    
    const handleMouseLeave = () => {
      controls.start({
        rotateY: -5,
        rotateX: 3,
        transition: { type: "spring", stiffness: 100, damping: 30 }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      }
    }
  };

  return (
    <section className={styles.twitterSection}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.backgroundPattern}></div>
      
      <motion.div 
        className={styles.sectionContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className={styles.imageContainer}
          variants={itemVariants}
          ref={imageRef}
        >
          <div className={styles.imageGlow}></div>
          <motion.div 
            className={styles.imageWrapper}
            animate={controls}
          >
            <Image
              src="/Tiwtter.jpg"
              alt="غرفة بيشة"
              width={600}
              height={600}
              className={styles.twitterImage}
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.contentContainer}
          variants={itemVariants}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleGradient}>تابعنا على تويتر</span>
          </h2>
          <p className={styles.sectionDescription}>
            تابع آخر أخبار وفعاليات غرفة بيشة على منصة تويتر للبقاء على اطلاع بكل جديد من خدمات وأنشطة الغرفة التجارية
          </p>
          
          <motion.a 
            href="https://x.com/Bisha_cci"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitterButton}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 30px rgba(29, 161, 242, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="currentColor" />
              </svg>
            </span>
            متابعة @Bisha_cci
          </motion.a>

          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>+3K</span>
              <span className={styles.statLabel}>متابع</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>+2K</span>
              <span className={styles.statLabel}>تغريدة</span>
            </div>
        
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}