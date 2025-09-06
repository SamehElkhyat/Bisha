"use client";
import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../../styles/ServicesPage.module.css';

const ServicesPage = () => {
  const services = [
    { href: 'https://eservices.bishacci.org.sa/#/Login', label: 'التصديق الإلكتروني', external: true },
    { href: 'https://eservices.bishacci.org.sa/#/DocumentVerify', label: 'التحقق من الوثائق', external: true },
    { href: 'https://eservices.bishacci.org.sa/#/Contact', label: 'تحديث البيانات', external: true },
    { href: 'https://eservices.bishacci.org.sa/#/Login', label: 'الدليل التجاري', external: true },
    { href: 'https://cocclient.mci.gov.sa/', label: 'تجديد الاشتراك', external: true },
    { href: 'https://numo.sa/ar/b/fraa-bysh', label: 'التدريب الالكتروني', external: true },
    { href: 'https://eservices.bishacci.org.sa/#/Login', label: 'الشكاوي والاقتراحات', external: true },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowRight />
          العودة للرئيسية
        </Link>
        <h1 className={styles.title}>خدماتنا</h1>
        <p className={styles.subtitle}>جميع الخدمات الإلكترونية المتاحة</p>
      </div>

      <div className={styles.servicesList}>
        {services.map((service, index) => (
          service.external ? (
            <a
              key={index}
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.serviceItem}
            >
              <span className={styles.serviceLabel}>{service.label}</span>
              <FaExternalLinkAlt className={styles.externalIcon} />
            </a>
          ) : (
            <Link
              key={index}
              href={service.href}
              className={styles.serviceItem}
            >
              <span className={styles.serviceLabel}>{service.label}</span>
              <FaArrowRight className={styles.arrowIcon} />
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
