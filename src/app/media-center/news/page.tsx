"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaSearch } from 'react-icons/fa';
import { newsAPI } from '../../../services/api';
import styles from '../../../styles/NewsPage.module.css';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newsData, setNewsData] = useState([]);
  const itemsPerPage = 6;

  // Get all unique categories
  const categories = ['all', ...new Set(newsData.map(item => item.type || item.category).filter(Boolean))];

  // Filter news based on search term and category
  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await newsAPI.getAll();
        console.log(data);

        if (data && data.newsPaper) {
          setNewsData(data.newsPaper); // Show all data, not just 5 items
          setFilteredNews(data.newsPaper); // Initialize filtered news with all data
        } else {
          setError('لا توجد بيانات متاحة');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
        // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    let result = newsData; // Start with all news data

    if (searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.type === selectedCategory || item.category === selectedCategory);
    }

    setFilteredNews(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, newsData]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      let date;
      if (dateString && dateString.includes('T')) {
        // ISO format
        date = new Date(dateString);
      } else if (dateString) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        return '';
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      const monthNames: { [key: string]: string } = {
        '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
        '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
        '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
      };
      
      return `${day} ${monthNames[month]} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className={styles.newsPageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>المركز الإعلامي</h1>
          <p className={styles.pageDescription}>
            آخر أخبار وفعاليات غرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
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
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'الكل' : category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.newsGrid}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل الأخبار...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((news) => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImageContainer}>
                  <Image
                    src={news.imageUrl || news.imageURL || '/news-placeholder.jpg'}
                    alt={news.title}
                    width={400}
                    height={250}
                    className={styles.newsImage}
                  />
                  <div className={styles.newsOverlay}>
                    <Link href={`/media-center/news/${news.id}`} className={styles.readMoreButton}>
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
                <div className={styles.newsContent}>
                  <div className={styles.newsMetadata}>
                    <span className={styles.newsDate}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      {formatDate(news.createdAt || news.date)}
                    </span>
                    <span className={styles.newsCategory}>
                      <FaTag className={styles.metaIcon} />
                      {news.type || news.category || 'أخبار'}
                    </span>
                  </div>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                  <p className={styles.newsExcerpt}>
                    {(news.description || news.content || '').substring(0, 150)}...
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>لا توجد نتائج مطابقة للبحث</h3>
              <p>يرجى تغيير معايير البحث والمحاولة مرة أخرى.</p>
            </div>
          )}
        </div>

        {filteredNews.length > itemsPerPage && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              السابق
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`${styles.paginationButton} ${currentPage === number ? styles.activePage : ''}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
