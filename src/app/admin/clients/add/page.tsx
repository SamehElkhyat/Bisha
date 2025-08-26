"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from '../../../../styles/AdminForms.module.css';
import { FaUsers, FaSave, FaArrowRight, FaIdCard, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { clientsAPI } from '../../../../services/api';

const AddClientPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    passwordHash: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      // router.push('/login');
      setLoading(false);
    } else if (!isAdmin()) {
        // router.push('/');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.passwordHash || !formData.confirmPassword) {
        setError('يرجى تعبئة جميع الحقول المطلوبة');
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('يرجى إدخال بريد إلكتروني صحيح');
        setIsSubmitting(false);
        return;
      }
      
      // Validate password match
      if (formData.passwordHash !== formData.confirmPassword) {
        setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
        setIsSubmitting(false);
        return;
      }

      // Validate password strength
      if (formData.passwordHash.length < 6) {
        setError('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
        setIsSubmitting(false);
        return;
      }

      // Prepare user data for API
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        passwordHash: formData.passwordHash,
        confirmPassword: formData.confirmPassword
      };

      // Send to API
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://bisha.runasp.net';
      const url = `${API_BASE_URL}/api/Register/User`;
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Registering user with data:', userData);
      
      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // Show success message
      setSuccess('تم إضافة المستخدم بنجاح');
      
      // Reset form after success
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        passwordHash: '',
        confirmPassword: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Failed to add user:', error);
      setError(`فشل إضافة المستخدم: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className={styles.adminFormContainer}>
      <div className={styles.formHeader}>
        <Link href="/admin/users" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1><FaUsers className={styles.headerIcon} /> إضافة مستخدم جديد</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">الاسم الكامل *</label>
          <div className={styles.inputWithIcon}>
            <FaIdCard className={styles.inputIcon} />
            <input
              className='text-black'
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email">البريد الإلكتروني *</label>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                className='text-black'
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">رقم الهاتف *</label>
            <div className={styles.inputWithIcon}>
              <FaPhone className={styles.inputIcon} />
              <input
                className='text-black'
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="أدخل رقم الهاتف"
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="passwordHash">كلمة المرور *</label>
          <div className={styles.inputWithIcon}>
            <FaLock className={styles.inputIcon} />
            <input
              className='text-black'
              type="password"
              id="passwordHash"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">تأكيد كلمة المرور *</label>
          <div className={styles.inputWithIcon}>
            <FaCheckCircle className={styles.inputIcon} />
            <input
              className='text-black'
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أعد إدخال كلمة المرور"
              required
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinnerSmall}></div> جاري الحفظ...
              </>
            ) : (
              <>
                <FaSave /> حفظ المستخدم
              </>
            )}
          </button>
          <Link href="/admin/users" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;
