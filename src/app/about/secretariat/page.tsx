"use client";

import React from 'react';
import Image from 'next/image';
import { FaUserTie, FaQuoteRight, FaQuoteLeft, FaEnvelope } from 'react-icons/fa';
import styles from '../../../styles/Secretariat.module.css';

const SecretariatPage = () => {
  return (
    <div className={styles.secretariatContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الأمانة العامة</h1>
          <p className={styles.pageDescription}>
            مكتب الأمين العام لغرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.secretarySection}>
          <div className={styles.secretaryCard}>
            <div className={styles.cardContent}>
              <div className={styles.secretaryImageContainer}>
                <div className={styles.secretaryImageWrapper}>
                  <Image 
                    src="/secretary-placeholder.jpg" 
                    alt="محمد بن إبراهيم بن مشوط" 
                    width={300} 
                    height={400} 
                    className={styles.secretaryImage}
                  />
                </div>
              </div>

              <div className={styles.secretaryInfo}>
                <div className={styles.secretaryTitle}>
                  <FaUserTie className={styles.titleIcon} />
                  <h2>الأمين العام</h2>
                </div>
                <h3 className={styles.secretaryName}>محمد بن إبراهيم بن مشوط</h3>
                
                <div className={styles.quoteContainer}>
                  <FaQuoteRight className={styles.quoteIconRight} />
                  <p className={styles.secretaryQuote}>
                    نواصل المسيرة في وضع الأسس الإدارية والاستراتيجية لبناء تنمية مستدامة لقطاع أعمال حيوي.
                  </p>
                  <FaQuoteLeft className={styles.quoteIconLeft} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <FaEnvelope className={styles.contactIcon} />
              <h3>للتواصل مباشرة مع الأمين العام</h3>
            </div>
            
            <div className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم</label>
                <input type="text" id="name" className={styles.formInput} placeholder="الاسم الكامل" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input type="email" id="email" className={styles.formInput} placeholder="البريد الإلكتروني" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الجوال</label>
                <input type="tel" id="phone" className={styles.formInput} placeholder="رقم الجوال" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject">الموضوع</label>
                <input type="text" id="subject" className={styles.formInput} placeholder="موضوع الرسالة" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">الرسالة</label>
                <textarea id="message" className={styles.formTextarea} placeholder="نص الرسالة" rows={5}></textarea>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                إرسال الرسالة
              </button>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>مهام الأمانة العامة</h3>
            <ul className={styles.infoList}>
              <li>تنفيذ قرارات مجلس الإدارة</li>
              <li>الإشراف على الشؤون الإدارية والمالية للغرفة</li>
              <li>تمثيل الغرفة في المحافل والاجتماعات الرسمية</li>
              <li>متابعة أعمال اللجان المختلفة</li>
              <li>إعداد التقارير الدورية عن أنشطة الغرفة</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>الرؤية المستقبلية</h3>
            <p className={styles.infoText}>
              تسعى الأمانة العامة إلى تطوير آليات العمل وتحسين الخدمات المقدمة لأعضاء الغرفة، وتعزيز التواصل مع القطاعات المختلفة، والمساهمة في تحقيق رؤية المملكة 2030 من خلال دعم قطاع الأعمال وتشجيع الاستثمار في المنطقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretariatPage;
