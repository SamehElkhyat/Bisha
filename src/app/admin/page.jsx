"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminRoute from '../../components/AdminRoute';
import styles from '../../styles/Admin.module.css';
import { FaNewspaper, FaUserPlus, FaSignOutAlt, FaChartBar, FaUsers, FaBullhorn, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState();


  const GetAllCounts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/Count`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setCounts(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetAllCounts()

    const decodedToken = JSON.parse(localStorage.getItem('DecodedToken') || '{}');
    setDecodedToken(decodedToken);
    console.log(decodedToken);

    if (decodedToken?.Role !== 'Admin') {
      router.push('/login');
    }


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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileSidebar}
            aria-label="Toggle mobile menu"
          >
            <FaBars />
          </button>
          <h1>لوحة التحكم</h1>
          <div className={styles.mobileProfileImage}>
            <FaUsers size={24} />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className={styles.mobileOverlay} onClick={toggleMobileSidebar} />
        )}

        {/* Sidebar */}
        <div className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.sidebarOpen : ''}`}>
          {/* Mobile Close Button */}
          <div className={styles.mobileCloseContainer}>
            <button
              className={styles.mobileCloseButton}
              onClick={toggleMobileSidebar}
              aria-label="Close mobile menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.adminProfile}>
            <div className={styles.profileImage}>
              <FaUsers size={40} />
            </div>
            <div className={styles.profileInfo}>
              <h3>{user?.name || 'مدير النظام'}</h3>
              <p>مدير النظام</p>
            </div>
          </div>

          <nav className={styles.adminNav}>
            {decodedToken?.Permission.map((item, index) => {
              return (
                <div key={`nav-${item}-${index}`}>
                  {item === 'GetContact' && (
                    <Link href="/admin" className={`${styles.navLink} ${styles.active}`} onClick={() => setIsMobileSidebarOpen(false)}>
                      <FaChartBar className={styles.navIcon} />
                      <span>لوحة التحكم</span>
                    </Link>
                  )}
                  {item === 'AddNewsPaper' && (
                    <Link href="/admin/news" className={styles.navLink} onClick={() => setIsMobileSidebarOpen(false)}>
                      <FaNewspaper className={styles.navIcon} />
                      <span>إدارة الأخبار والاعلانات</span>
                    </Link>
                  )}
                  {item === 'GetAllUsers' && (
                    <Link href="/admin/clients" className={styles.navLink} onClick={() => setIsMobileSidebarOpen(false)}>
                      <FaUsers className={styles.navIcon} />
                      <span>إدارة العملاء</span>
                    </Link>
                  )}
                  {item === 'GetContact' && (
                    <Link href="/admin/contact" className={styles.navLink} onClick={() => setIsMobileSidebarOpen(false)}>
                      <FaUserPlus className={styles.navIcon} />
                      <span>الاطلاع علي الشكاوي</span>
                    </Link>
                  )}
                  {item === 'GetContact' && (
                    <Link href="/admin/contact/edit" className={styles.navLink} onClick={() => setIsMobileSidebarOpen(false)}>
                      <FaUserPlus className={styles.navIcon} />
                      <span>تعديل البيانات تواصل معنا</span>
                    </Link>
                  )}

                </div>
              )
            })
            }

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
                <h3>{counts?.newsPaper || 0}</h3>
                <p>الأخبار</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUsers />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.users || 0}</h3>
                <p>العملاء</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBullhorn />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.ads || 0}</h3>
                <p>الاعلانات</p>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2>إجراءات سريعة</h2>
            <div className={styles.actionCards}>
              {decodedToken?.Permission.map((item, index) => {
                return (
                  <div key={`action-${item}-${index}`}>
                    {item === 'AddNewsPaper' && (
                      <Link href="/admin/news/add" className={styles.actionCard} onClick={() => setIsMobileSidebarOpen(false)}>
                        <FaNewspaper className={styles.actionIcon} />
                        <h3>إضافة خبر جديد</h3>
                        <p>أضف خبر جديد للموقع</p>
                      </Link>
                    )}

                    {item === 'AddUser' && (
                      <Link href="/admin/users/add" className={styles.actionCard} onClick={() => setIsMobileSidebarOpen(false)}>
                        <FaUserPlus className={styles.actionIcon} />
                        <h3>إضافة مستخدم جديد</h3>
                        <p>أضف مستخدم جديد للنظام</p>
                      </Link>
                    )}
                    {item === 'GetContact' && (
                      <Link href="/admin/contact" className={styles.actionCard} onClick={() => setIsMobileSidebarOpen(false)}>
                        <FaUserPlus className={styles.actionIcon} />
                        <h3>الاطلاع علي الشكاوي</h3>
                        <p>الاطلاع علي الشكاوي</p>
                      </Link>
                    )}
                    {item === 'GetAllUsers' && (
                      <Link href="/admin/users" className={styles.actionCard} onClick={() => setIsMobileSidebarOpen(false)}>
                        <FaUserPlus className={styles.actionIcon} />
                        <h3>عرض واداره المستخدمين</h3>
                        <p>عرض واداره المستخدمين</p>
                      </Link>
                    )}
                    {item === 'GetContact' && (
                      <Link href="/admin/contact/edit" className={styles.actionCard} onClick={() => setIsMobileSidebarOpen(false)}>
                        <FaUserPlus className={styles.actionIcon} />
                        <h3>تعديل البيانات تواصل معنا</h3>
                        <p>تعديل البيانات تواصل معنا</p>
                      </Link>
                    )}

                  </div>
                )
              })
              }
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
