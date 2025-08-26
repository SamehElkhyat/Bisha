"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaSave } from 'react-icons/fa';
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('news'); // 'news' or 'events'
  const [modalLoading, setModalLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: '',
    imageFile: null
  });

  // Get all unique categories
  const categories = ['all', ...new Set(news.map(item => item.category))];


  const UpdateNews = async (newData, id) => {
    const response = await newsAPI.UpdateNews(newData, id);

  }

  // Modal handlers
  const openEditModal = async (item, type) => {

    try {
      setModalLoading(true);
      setIsModalOpen(true);
      setModalType(type);

      // Fetch fresh data from API
      let freshData;
      if (type === 'news') {
        const response = await newsAPI.getById(item.id);
        freshData = response.newsPaper || response;
      } else {
        const response = await newsAPI.getCircularById(item.id);
        freshData = response.newsPaper || response;
      }

      setEditingItem(freshData);
      setFormData({
        title: freshData.title || '',
        description: freshData.description || '',
        imageUrl: freshData.imageUrl || '',
        type: freshData.type || ''
      });

    } catch (error) {
      console.error('Error fetching item details:', error);
      // Fallback to existing data if API fails
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        type: item.type || ''
      });
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      type: '',
      imageFile: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      // Handle file input
      if (files && files[0]) {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      // Handle regular text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...editingItem,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        type: formData.type,
      };

      await UpdateNews(updatedData, editingItem.id);

      // Update local state
      if (modalType === 'news') {
        const updatedNews = news.map(item =>
          item.id === editingItem.id ? updatedData : item
        );
        setNews(updatedNews);
      } else {
        const updatedEvents = events.map(item =>
          item.id === editingItem.id ? updatedData : item
        );
        setEvents(updatedEvents);
      }

      closeModal();
      alert('تم التحديث بنجاح!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsAPI.getAll();
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
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [searchTerm, events]);

  // Format date function
  const handleDelete = async (id: number) => {
    const response = await newsAPI.delete(id);
    if (response.message === "تم حذف الخبر بنجاح") {
      alert('تم الحذف بنجاح');
    } else {
      alert('حدث خطأ أثناء الحذف');
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
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(item, 'news')}
                    >
                      <FaEdit />
                    </button>
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
                  <td className="text-black">{item.title || 'غير محدد'}</td>
                  <td className="text-black">
                    {item.content ? item.content.substring(0, 100) + '...' : 'غير محدد'}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(item, 'events')}
                    >
                      <FaEdit />
                    </button>
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>تعديل {modalType === 'news' ? 'الخبر' : 'التعميم'}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {modalLoading ? (
                <div className={styles.modalLoading}>
                  <div className={styles.spinner}></div>
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="title" className={styles.inputLabel}>العنوان</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={styles.modalInput}
                      placeholder="أدخل العنوان"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="description" className={styles.inputLabel}>الوصف</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.modalTextarea}
                      placeholder="أدخل الوصف"
                      rows={4}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="imageFile" className={styles.inputLabel}>اختر صورة</label>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      onChange={handleInputChange}
                      className={styles.modalInput}
                      accept="image/*"
                    />
                    {formData.imageUrl && (
                      <div className={styles.currentImage}>
                        <span>الصورة الحالية: </span>
                        <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
                          عرض الصورة
                        </a>
                      </div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="type" className={styles.inputLabel}>النوع/التصنيف</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={styles.modalInput}
                      placeholder="أدخل النوع أو التصنيف"
                    />
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeModal}>
                إلغاء
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={modalLoading}
              >
                <FaSave /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
