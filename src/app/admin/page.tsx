"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminRoute from '../../components/AdminRoute';
import styles from '../../styles/Admin.module.css';
import { FaNewspaper, FaUserPlus, FaSignOutAlt, FaChartBar, FaUsers, FaBullhorn } from 'react-icons/fa';
import Link from 'next/link';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      setLoading(false);

      // router.push('/login');
    } else if (!isAdmin()) {
      setLoading(false);

      // router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.adminProfile}>
          <div className={styles.profileImage}>
            <FaUsers size={40} />
          </div>
          <div className={styles.profileInfo}>
            <h3>{user?.name}</h3>
            <p>مدير النظام</p>
          </div>
        </div>
        
        <nav className={styles.adminNav}>
          <Link href="/admin" className={`${styles.navLink} ${styles.active}`}>
            <FaChartBar className={styles.navIcon} />
            <span>لوحة التحكم</span>
          </Link>
          <Link href="/admin/news" className={styles.navLink}>
            <FaNewspaper className={styles.navIcon} />
            <span>إدارة الأخبار</span>
          </Link>
          <Link href="/admin/clients" className={styles.navLink}>
            <FaUsers className={styles.navIcon} />
            <span>إدارة العملاء</span>
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            <FaUserPlus className={styles.navIcon} />
            <span>إدارة المستخدمين</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt className={styles.navIcon} />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>لوحة التحكم</h1>
          <p>مرحباً بك في لوحة تحكم غرفة بيشة</p>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaNewspaper />
            </div>
            <div className={styles.statInfo}>
              <h3>10</h3>
              <p>الأخبار</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
            <div className={styles.statInfo}>
              <h3>25</h3>
              <p>العملاء</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBullhorn />
            </div>
            <div className={styles.statInfo}>
              <h3>5</h3>
              <p>التعاميم</p>
            </div>
          </div>
        </div>
        
        <div className={styles.quickActions}>
          <h2>إجراءات سريعة</h2>
          <div className={styles.actionCards}>
            <Link href="/admin/news/add" className={styles.actionCard}>
              <FaNewspaper className={styles.actionIcon} />
              <h3>إضافة خبر جديد</h3>
              <p>أضف خبر جديد للموقع</p>
            </Link>
            
            <Link href="/admin/clients/add" className={styles.actionCard}>
              <FaUserPlus className={styles.actionIcon} />
              <h3>إضافة عميل جديد</h3>
              <p>أضف عميل جديد للنظام</p>
            </Link>
            
            <Link href="/admin/users/add" className={styles.actionCard}>
              <FaUserPlus className={styles.actionIcon} />
              <h3>إضافة مستخدم جديد</h3>
              <p>أضف مستخدم جديد للنظام</p>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
