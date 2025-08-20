"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaSearch } from 'react-icons/fa';
import { newsData } from '../../../data/newsData';
import styles from '../../../styles/NewsPage.module.css';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState(newsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get all unique categories
  const categories = ['all', ...new Set(newsData.map(item => item.category))];

  // Filter news based on search term and category
  useEffect(() => {
    let result = newsData;
    
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
          {currentItems.length > 0 ? (
            currentItems.map((news) => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImageContainer}>
                  <Image
                    src={news.image}
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
                      {formatDate(news.date)}
                    </span>
                    <span className={styles.newsCategory}>
                      <FaTag className={styles.metaIcon} />
                      {news.category}
                    </span>
                  </div>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                  <p className={styles.newsExcerpt}>
                    {news.content.substring(0, 150)}...
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
