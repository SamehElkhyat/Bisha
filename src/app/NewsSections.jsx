import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/NewsSections.module.css";
import { newsAPI } from '../services/api';
import { motion, AnimatePresence } from "framer-motion";

export default function NewsSections() {
  // State for news data from API
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Carousel states
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const carouselRef = useRef(null);

  // Items per page based on screen size
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1400) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 992) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    try {
      let date;
      if (dateString && dateString.includes("T")) {
        // ISO format
        date = new Date(dateString);
      } else if (dateString) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split("/");
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        return { day: "", month: "", year: "" };
      }

      const day = date.getDate().toString().padStart(2, "0");
      const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      const monthNames = {
        "01": "يناير",
        "02": "فبراير",
        "03": "مارس",
        "04": "أبريل",
        "05": "مايو",
        "06": "يونيو",
        "07": "يوليو",
        "08": "أغسطس",
        "09": "سبتمبر",
        "10": "أكتوبر",
        "11": "نوفمبر",
        "12": "ديسمبر",
      };

      return { 
        day, 
        month: monthNames[monthNum], 
        year 
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { day: "", month: "", year: "" };
    }
  };

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await newsAPI.getAll();

        if (data && data.newsPaper) {
          setNewsData(data.newsPaper);
        } else {
          setError("لا توجد بيانات متاحة");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Carousel navigation functions
  const handleNavigation = (direction) => {
    if (newsData.length <= itemsPerPage) return;
    
    const maxPages = Math.ceil(newsData.length / itemsPerPage) - 1;
    
    if (direction === "next") {
      setCurrentPage((prev) => (prev >= maxPages ? 0 : prev + 1));
    } else {
      setCurrentPage((prev) => (prev <= 0 ? maxPages : prev - 1));
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (newsData.length > itemsPerPage) {
        handleNavigation("next");
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [newsData.length, itemsPerPage]);

  // Mouse drag handlers for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get current page items
  const getCurrentItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return newsData.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className={styles.newsSection}>
      <div className={styles.newsContainer}>
        <h2 className={styles.sectionTitle}>اخر الأخبار</h2>
        
        <div className={styles.contentContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل الأخبار...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : newsData.length === 0 ? (
            <div className={styles.noResults}>
              <h3>لا توجد أخبار متاحة</h3>
            </div>
          ) : (
            <>
              <div 
                className={styles.newsCarousel}
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentPage}
                    className={styles.carouselItems}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getCurrentItems().map((news, index) => {
                      const { day, month, year } = formatDate(news.createdAt);
                      console.log(news);
                      return (
                        <motion.div 
                          key={news.id} 
                          className={styles.newsCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                          }}
                          whileHover={{ 
                            y: -5,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Link
                            href={`/media-center/news/${news.id}`}
                            className={styles.newsCardLink}
                          >
                            <div className={styles.newsImage}>
                              <Image
                                src={news.imageUrl || "/news-placeholder.jpg"}
                                alt={news.title}
                                width={600}
                                height={400}
                                priority
                                className={styles.cardImage}
                              />
                            </div>
                            <div className={styles.newsContent}>
                              <div className={styles.newsDate}>
                                <div className={styles.dateBox}>
                                  <span className={styles.dateNumber}>{day}</span>
                                  <span className={styles.dateText}>{`${month} ${year}`}</span>
                                </div>
                              </div>
                              <h3 className={styles.newsTitle}>{news.title}</h3>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {newsData.length > itemsPerPage && (
                <div className={styles.carouselControls}>
                  <button 
                    className={`${styles.carouselButton} ${styles.prevButton}`}
                    onClick={() => handleNavigation("prev")}
                    aria-label="Previous news"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className={styles.carouselIndicators}>
                    {Array.from({ length: Math.ceil(newsData.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.carouselIndicator} ${
                          index === currentPage ? styles.activeIndicator : ""
                        }`}
                        onClick={() => setCurrentPage(index)}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className={`${styles.carouselButton} ${styles.nextButton}`}
                    onClick={() => handleNavigation("next")}
                    aria-label="Next news"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}