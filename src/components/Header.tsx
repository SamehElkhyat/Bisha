import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { FaTiktok, FaTelegramPlane, FaSnapchatGhost, FaYoutube, FaFacebookF, FaInstagram, FaTimes, FaChevronDown, FaUserShield, FaBars } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface NavLink {
  href: string;
  label: string;
  id?: string;
  hasDropdown?: boolean;
  external?: boolean;
  dropdownItems?: Array<{
    href: string;
    label: string;
  }>;
}

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { isAdmin } = useAuth();
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown]?.contains(target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close any open dropdowns when toggling mobile menu
    setActiveDropdown(null);
  };

  // Base navigation links (always visible)
  const baseNavLinks: NavLink[] = [
    { href: '/', label: 'الرئيسية' },
    {
      id: 'about',
      href: '#',
      label: 'عن الغرفة',
      hasDropdown: true,
      dropdownItems: [
        
        { href: '/about/vision', label: 'الرؤية والرسالة' },
        { href: '/about/regulations', label: 'اللوائح والأنظمة' },
        { href: '/about/board', label: 'مجلس الإدارة' },
        { href: '/about/secretariat', label: 'الأمانة العامة' },
        { href: '/about/magazine', label: 'مجلة الغرفة' },
        { href: '/about/general-assembly', label: 'الجمعية العمومية' },
        { href: '/about/elections', label: 'الانتخابات' },
        { href: '/about/annual-reports', label: 'التقرير السنوي' },
        { href: '/about/e-library', label: 'المكتبة الإلكترونية' },
        { href: '/about/trade-bulletins', label: 'النشرات التجارية' },
        { href: '/about/studies', label: 'الدراسات والبحوث' },
        { href: '/about/committees', label: 'اللجان القطاعية' },
        { href: '/about/surveys', label: 'الاستبيانات' }
      ]
    },
    {
      id: 'media',
      href: '#',
      label: 'المركز الاعلامي',
      hasDropdown: true,
      dropdownItems: [
        { href: '/media-center/news', label: 'الاخبار' },
        { href: '/media-center/circulars', label: 'التعاميم' }
      ]
    },
    { href: 'https://eservices.bishacci.org.sa/#/Login', label: 'التدريب', external: true },
    { href: '/', label: 'المبادرات' },
    { href: '/contact', label: 'اتصل بنا' }
  ];
  


  // Admin link (only visible to admins)
  const adminLink: NavLink = { href: '/admin', label: '🔧 لوحة التحكم', id: 'admin' };

  // Get user from auth context
  const { user } = useAuth();
  
  // Login link
  const authLink: NavLink = { href: '/login', label: '🔐 تسجيل الدخول', id: 'auth' };

  // Combine base links with conditional links
  let navLinks: NavLink[] = [...baseNavLinks];
  
  const decodedToken = JSON.parse(localStorage.getItem('DecodedToken') || '{}');
  // Add admin link ONLY if user is admin
  if (decodedToken?.Role === 'Admin' ) {
    console.log('Admin user detected, showing admin panel link');
    navLinks.push(adminLink);
  } else {
    console.log('Non-admin user, hiding admin panel link');
  }
  
  // Add login link ONLY if user is not logged in
  if (!user) {
    navLinks.push(authLink);
  }

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
        {/* Logo/Brand section for mobile */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.brandLink}>
            غرفة بيشة التجارية
          </Link>
        </div>

        {/* Mobile hamburger menu button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <FaBars />
        </button>

        {/* Desktop Navigation */}
        <nav className={`${styles.nav} ${styles.desktopNav}`}>
          {navLinks.map((link, index) => (
            link.hasDropdown ? (
              <div
                key={index}
                className={styles.dropdownContainer}
                ref={(el) => {
                  if (link.id) {
                    dropdownRefs.current[link.id] = el;
                  }
                }}
              >
                <div
                  className={`${styles.navLink} ${styles.dropdownTrigger} ${activeDropdown === link.id ? styles.activeDropdown : ''}`}
                  onClick={() => link.id && toggleDropdown(link.id)}
                >
                  {link.label} <FaChevronDown className={`${styles.dropdownIcon} ${activeDropdown === link.id ? styles.rotateIcon : ''}`} />
                </div>
                {activeDropdown === link.id && (
                  <div className={`${styles.dropdownMenu} ${link.id === 'about' ? styles.largeDropdown : ''}`}>
                    {link.dropdownItems?.map((item, idx) => (
                      <Link key={idx} href={item.href} className={styles.dropdownItem}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              link.external ? (
                <a key={index} href={link.href} className={styles.navLink} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link key={index} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              )
            )
          ))}
        </nav>

        {/* Desktop Social Icons */}
        <div className={`${styles.socialIcons} ${styles.desktopSocial}`}>
          {socialLinks.map((social, index) => (
            <a key={index} href={social.href} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              {social.icon}
            </a>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavContent}>
              {/* Close button */}
              <div className={styles.mobileNavHeader}>
                <button 
                  className={styles.mobileCloseButton}
                  onClick={toggleMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Social Icons */}
              <div className={styles.mobileSocialIcons}>
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.href} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Mobile Navigation Links */}
              <nav className={styles.mobileNavLinks}>
                {navLinks.map((link, index) => (
                  link.hasDropdown ? (
                    <div key={index} className={styles.mobileDropdownContainer}>
                      <div
                        className={`${styles.mobileNavLink} ${styles.mobileDropdownTrigger}`}
                        onClick={() => link.id && toggleDropdown(link.id)}
                      >
                        {link.label} <FaChevronDown className={`${styles.dropdownIcon} ${activeDropdown === link.id ? styles.rotateIcon : ''}`} />
                      </div>
                      {activeDropdown === link.id && (
                        <div className={styles.mobileDropdownMenu}>
                          {link.dropdownItems?.map((item, idx) => (
                            <Link 
                              key={idx} 
                              href={item.href} 
                              className={styles.mobileDropdownItem}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    link.external ? (
                      <a 
                        key={index} 
                        href={link.href} 
                        className={styles.mobileNavLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        key={index} 
                        href={link.href} 
                        className={styles.mobileNavLink}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  )
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;