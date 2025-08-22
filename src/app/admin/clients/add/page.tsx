"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from '../../../../styles/AdminForms.module.css';
import { FaUsers, FaSave, FaArrowRight, FaIdCard, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';

const AddClientPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    type: 'business',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      router.push('/');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // In a real application, we would make an API call to save the client
    console.log('Adding client:', formData);
    
    // Show success message
    setSuccess('تم إضافة العميل بنجاح');
    
    // Reset form after success
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      type: 'business',
      notes: ''
    });
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/clients');
    }, 2000);
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
        <Link href="/admin/clients" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1><FaUsers className={styles.headerIcon} /> إضافة عميل جديد</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">اسم العميل *</label>
          <div className={styles.inputWithIcon}>
            <FaIdCard className={styles.inputIcon} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسم العميل"
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
            <label htmlFor="phone">رقم الهاتف *</label>
            <div className={styles.inputWithIcon}>
              <FaPhone className={styles.inputIcon} />
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم الهاتف"
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="company">الشركة / المؤسسة</label>
            <div className={styles.inputWithIcon}>
              <FaBuilding className={styles.inputIcon} />
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="أدخل اسم الشركة أو المؤسسة"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">نوع العميل</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="business">شركة</option>
              <option value="individual">فرد</option>
              <option value="government">جهة حكومية</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">العنوان</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="أدخل العنوان"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">ملاحظات</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="أدخل ملاحظات إضافية"
            rows={4}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            <FaSave /> حفظ العميل
          </button>
          <Link href="/admin/clients" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;
