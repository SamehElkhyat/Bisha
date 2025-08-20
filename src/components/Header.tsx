import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { FaTiktok, FaTelegramPlane, FaSnapchatGhost, FaYoutube, FaFacebookF, FaInstagram, FaTimes } from 'react-icons/fa';

const Header = () => {
  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'عن الغرفة' },
    { href: '/media-center', label: 'المركز الاعلامي' },
    { href: '/committees', label: 'اللجان' },
    { href: '/circulars', label: 'التعاميم' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  const socialLinks = [
    { href: '#', icon: <FaTiktok /> },
    { href: '#', icon: <FaTelegramPlane /> },
    { href: '#', icon: <FaSnapchatGhost /> },
    { href: '#', icon: <FaYoutube /> },
    { href: '#', icon: <FaFacebookF /> },
    { href: '#', icon: <FaInstagram /> },
    { href: '#', icon: <FaTimes /> }, // Assuming X icon
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.socialIcons}>
          {socialLinks.map((social, index) => (
            <a key={index} href={social.href} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
