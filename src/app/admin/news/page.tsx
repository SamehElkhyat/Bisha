"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import { newsData } from '../../../data/newsData';

const AdminNewsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState(newsData);
  const [filteredNews, setFilteredNews] = useState(newsData);
  
  // Get all unique categories
  const categories = ['all', ...new Set(newsData.map(item => item.category))];

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

  // Filter news based on search term and category
  useEffect(() => {
    let result = news;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredNews(result);
  }, [searchTerm, selectedCategory, news]);

  // Format date function
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const monthNames: { [key: string]: string } = {
      '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
      '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
      '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
    };
    
    return `${day} ${monthNames[month]} ${year}`;
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      // In a real application, we would make an API call to delete the news
      // For this demo, we'll filter out the deleted news from our state
      const updatedNews = news.filter(item => item.id !== id);
      setNews(updatedNews);
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
    <div className={styles.adminListContainer}>
      <div className={styles.listHeader}>
        <h1><FaNewspaper className={styles.headerIcon} /> إدارة الأخبار</h1>
        <Link href="/admin/news/add" className={styles.addButton}>
          <FaPlus /> إضافة خبر جديد
        </Link>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="ابحث هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <div className={styles.categoryFilter}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category === 'all' ? 'جميع التصنيفات' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>العنوان</th>
              <th>التصنيف</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className={styles.titleCell}>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{formatDate(item.date)}</td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/news/edit/${item.id}`} className={styles.editButton}>
                      <FaEdit />
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noResults}>
                  لا توجد نتائج مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNewsPage;
