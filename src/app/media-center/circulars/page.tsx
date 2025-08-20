"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaSearch } from 'react-icons/fa';
import { eventsData } from '../../../data/newsData';
import styles from '../../../styles/CircularsPage.module.css';

const CircularsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter events based on search term
  useEffect(() => {
    let result = eventsData;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEvents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

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
    <div className={styles.circularsPageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>التعاميم والفعاليات</h1>
          <p className={styles.pageDescription}>
            آخر التعاميم والفعاليات المهمة من غرفة بيشة
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
        </div>

        <div className={styles.eventsGrid}>
          {currentItems.length > 0 ? (
            currentItems.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={250}
                    className={styles.eventImage}
                  />
                  <div className={styles.eventOverlay}>
                    <Link href={`/media-center/circulars/${event.id}`} className={styles.readMoreButton}>
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
                <div className={styles.eventContent}>
                  <div className={styles.eventMetadata}>
                    <span className={styles.eventDate}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      {formatDate(event.date)}
                    </span>
                    <span className={styles.eventCategory}>
                      <FaTag className={styles.metaIcon} />
                      {event.category}
                    </span>
                  </div>
                  <h2 className={styles.eventTitle}>{event.title}</h2>
                  <p className={styles.eventExcerpt}>
                    {event.content.substring(0, 150)}...
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

        {filteredEvents.length > itemsPerPage && (
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

export default CircularsPage;
