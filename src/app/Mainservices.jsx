import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Mainservices.module.css';

export default function Mainservices() {
  // Animation variants for staggered animations
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
    hidden: { y: 30, opacity: 0 },
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

  // Committee data
  const committees = [
    {
      id: 1,
      title: "اللجان القطاعية",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "أن تصبح منطقة عسير من المناطق المتقدمة صناعياً خلال الأعوام القادمة عن طريق الاستفادة بطاقة مستمرة في تطوير القطاع الصناعي السعودي في مجالات: التقنية، التصدير"
    },
    {
      id: 2,
      title: "اللجان التجارية",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "تطوير القطاع التجاري وتعزيز الاستثمار في المنطقة من خلال تقديم الخدمات المتميزة والحلول المبتكرة للتجار والمستثمرين"
    },
    {
      id: 3,
      title: "اللجان الاستشارية",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "تقديم الاستشارات المتخصصة والدعم الفني للشركات والمؤسسات في مختلف المجالات الاقتصادية والإدارية"
    }
  ];

  return (
    <section className={styles.sectoralSection}>
      <div className={styles.sectionBackground}></div>
      <div className={styles.sectionOverlay}></div>
      
      <div className={styles.sectionContent}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleGlow}>اللجان القطاعية</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            تعرف على اللجان القطاعية المختلفة وخدماتها المتنوعة
          </p>
        </motion.div>

        <motion.div 
          className={styles.committeesContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {committees.map((committee) => (
            <motion.div 
              key={committee.id} 
              className={styles.committeeCard}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.committeeIconWrapper}>
                <div className={styles.committeeIcon}>
                  {committee.icon}
                </div>
              </div>
              <div className={styles.committeeContent}>
                <h3 className={styles.committeeTitle}>{committee.title}</h3>
                <p className={styles.committeeDescription}>
                  {committee.description}
                </p>
                <motion.button 
                  className={styles.detailsButton}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>تفاصيل أكثر</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}