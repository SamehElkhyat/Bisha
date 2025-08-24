"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import { newsAPI } from '../../../services/api';

const AdminNewsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  // Get all unique categories
  const categories = ['all', ...new Set(news.map(item => item.category))];

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsAPI.getAll() ;
      const eventsData = await newsAPI.getAllCirculars();
      setNews(data.newsPaper);
      setFilteredNews(data.newsPaper);
      setEvents(eventsData.newsPaper);
      setFilteredEvents(eventsData.newsPaper);
    };
    fetchNews();
    // Check if user is authenticated and is admin
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      router.push('/admin/news');
      setLoading(false);

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

  // Filter events based on search term
  useEffect(() => {
    let result = events;

    if (searchTerm) {
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.response?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [searchTerm, events]);

  // Format date function
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
          className="text-black"
            type="text"
            placeholder="ابحث هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <div className={styles.categoryFilter}>
          <FaFilter className={styles.filterIcon} />
          <select
          className="text-black"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category === 'all' ? 'جميع التصنيفات' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>الأخبار</h2>
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
                  <td className="text-black">{index + 1}</td>
                  <td className="text-black">{item.title}</td>
                  <td className="text-black">{item.category}</td>
                  <td className="text-black">{item.date}</td>
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

      {/* Events/Responses Table */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>التعاميم</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>العنوان</th>
              <th>المحتوى</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-black">{index + 1}</td>
                  <td  className="text-black">{item.title || 'غير محدد'}</td>
                  <td className="text-black">
                    {item.content ? item.content.substring(0, 100) + '...' : 'غير محدد'}
                  </td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/events/edit/${item.id}`} className={styles.editButton}>
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
                <td colSpan={6} className={styles.noResults}>
 لا توجد تعاميم 
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
