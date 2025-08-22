"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from '../../../../styles/AdminForms.module.css';
import { FaNewspaper, FaSave, FaArrowRight, FaImage } from 'react-icons/fa';
import Link from 'next/link';
import { newsData } from '../../../../data/newsData';

const AddNewsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'الأخبار',
    image: null,
    imagePreview: ''
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title || !formData.content || !formData.category) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // In a real application, we would make an API call to save the news
    // For this demo, we'll simulate adding to the newsData array
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const newNews = {
      id: newsData.length + 1,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      date: formattedDate,
      type: 'IT',
      image: formData.imagePreview || '/news-placeholder.jpg'
    };

    // In a real app, we would update the database
    console.log('Adding news:', newNews);
    
    // Show success message
    setSuccess('تم إضافة الخبر بنجاح');
    
    // Reset form after success
    setFormData({
      title: '',
      content: '',
      category: 'الأخبار',
      image: null,
      imagePreview: ''
    });
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/news');
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
        <Link href="/admin/news" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1><FaNewspaper className={styles.headerIcon} /> إضافة خبر جديد</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">عنوان الخبر *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="أدخل عنوان الخبر"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">تصنيف الخبر *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="الأخبار">الأخبار</option>
            <option value="التعاميم">التعاميم</option>
            <option value="الأخبار التعاميم">الأخبار التعاميم</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">محتوى الخبر *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="أدخل محتوى الخبر"
            rows={10}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">صورة الخبر</label>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className={styles.fileInput}
            />
            <label htmlFor="image" className={styles.customFileInput}>
              <FaImage /> اختر صورة
            </label>
            {formData.imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={formData.imagePreview}
                  alt="معاينة"
                  className={styles.imagePreview}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            <FaSave /> حفظ الخبر
          </button>
          <Link href="/admin/news" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddNewsPage;
