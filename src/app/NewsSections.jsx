import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/NewsSections.module.css";
import { newsAPI } from '../services/api';
import { motion, AnimatePresence } from "framer-motion";

export default function NewsSections() {
  // State for news and events data from API
  const [activeTab, setActiveTab] = useState("news");
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState({ news: true, events: true });
  const [error, setError] = useState({ news: "", events: "" });
  
  // Carousel states
  const [newsPage, setNewsPage] = useState(0);
  const [eventsPage, setEventsPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const newsCarouselRef = useRef(null);
  const eventsCarouselRef = useRef(null);

  // Items per page based on screen size
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1400) {
        setItemsPerPage(4);
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
        return "";
      }

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

      return `${day} ${monthNames[month]} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading((prev) => ({ ...prev, news: true }));
        setError((prev) => ({ ...prev, news: "" }));
        const data = await newsAPI.getAll();
        console.log(data);

        if (data && data.newsPaper) {
          setNewsData(data.newsPaper);
        } else {
          setError((prev) => ({ ...prev, news: "لا توجد بيانات متاحة" }));
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError((prev) => ({ ...prev, news: "حدث خطأ أثناء تحميل البيانات" }));
      } finally {
        setLoading((prev) => ({ ...prev, news: false }));
      }
    };

    fetchNews();
  }, []);

  // Fetch events data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading((prev) => ({ ...prev, events: true }));
        setError((prev) => ({ ...prev, events: "" }));
        const data = await newsAPI.getAllCirculars(1);

        if (data && data.newsPaper) {
          setEventsData(data.newsPaper);
        } else {
          setError((prev) => ({ ...prev, events: "لا توجد بيانات متاحة" }));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError((prev) => ({
          ...prev,
          events: "حدث خطأ أثناء تحميل البيانات",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, events: false }));
      }
    };

    fetchEvents();
  }, []);

  // Carousel navigation functions
  const handleNewsNavigation = (direction) => {
    if (newsData.length <= itemsPerPage) return;
    
    const maxPages = Math.ceil(newsData.length / itemsPerPage) - 1;
    
    if (direction === "next") {
      setNewsPage((prev) => (prev >= maxPages ? 0 : prev + 1));
    } else {
      setNewsPage((prev) => (prev <= 0 ? maxPages : prev - 1));
    }
  };

  const handleEventsNavigation = (direction) => {
    if (eventsData.length <= itemsPerPage) return;
    
    const maxPages = Math.ceil(eventsData.length / itemsPerPage) - 1;
    
    if (direction === "next") {
      setEventsPage((prev) => (prev >= maxPages ? 0 : prev + 1));
    } else {
      setEventsPage((prev) => (prev <= 0 ? maxPages : prev - 1));
    }
  };

  // Auto-scroll carousels
  useEffect(() => {
    const newsInterval = setInterval(() => {
      if (newsData.length > itemsPerPage) {
        handleNewsNavigation("next");
      }
    }, 7000);

    const eventsInterval = setInterval(() => {
      if (eventsData.length > itemsPerPage) {
        handleEventsNavigation("next");
      }
    }, 8000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(eventsInterval);
    };
  }, [newsData.length, eventsData.length, itemsPerPage]);

  // Mouse drag handlers for carousel
  const handleMouseDown = (e, carouselRef) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e, carouselRef) => {
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
  const getCurrentNewsItems = () => {
    const startIndex = newsPage * itemsPerPage;
    return newsData.slice(startIndex, startIndex + itemsPerPage);
  };

  const getCurrentEventsItems = () => {
    const startIndex = eventsPage * itemsPerPage;
    return eventsData.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className={styles.newsSection}>
      <div className={styles.newsContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>المركز الإعلامي</h2>
          <p className={styles.sectionSubtitle}>تعرف على أحدث إصداراتنا</p>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "news" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("news")}
            >
              الأخبار
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "events" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("events")}
            >
              الفعاليات
            </button>
          </div>
        </div>

        <div className={styles.contentContainer}>
          {activeTab === "news" && (
            <div className={styles.carouselContainer}>
              {loading.news ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>جاري تحميل الأخبار...</p>
                </div>
              ) : error.news ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>{error.news}</p>
                </div>
              ) : newsData.length === 0 ? (
                <div className={styles.noResults}>
                  <h3>لا توجد أخبار متاحة</h3>
                </div>
              ) : (
                <>
                  <div 
                    className={styles.intelligentCarousel}
                    ref={newsCarouselRef}
                    onMouseDown={(e) => handleMouseDown(e, newsCarouselRef)}
                    onMouseMove={(e) => handleMouseMove(e, newsCarouselRef)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={newsPage}
                        className={styles.carouselItems}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                      >
                        {getCurrentNewsItems().map((news, index) => {
                              let day, monthName, year;

                              try {
                                if (news.createdAt.includes("T")) {
                                  // ISO format
                                  const date = new Date(news.createdAt);
                                  day = date.getDate().toString().padStart(2, "0");
                                  const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                  year = date.getFullYear();
    
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
                                  monthName = monthNames[month];
                                } else {
                                  // DD/MM/YYYY format
                                  [day, month, year] = news.createdAt.split("/");
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
                                  monthName = monthNames[month];
                                }
                              } catch (error) {
                                console.error("Error formatting date:", error);
                                [day, monthName, year] = ["", "", ""];
                              }
                              return (
                          <motion.div 
                            key={news.id} 
                            className={styles.carouselCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1 }
                            }}
                            whileHover={{ 
                              y: -10,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <Link
                              href={`/media-center/news/${news.id}`}
                              className={styles.newsCard}
                            >
                              <div className={styles.newsImage}>
                                <Image
                                  src={news.imageUrl}
                                  alt={news.title}
                                  width={400}
                                  height={250}
                                  className={styles.cardImage}
                                />
                                <div className={styles.imageOverlay}></div>
                              </div>
                              <div className={styles.newsContent}>
                                <div className={styles.newsDate}>
                                  <span className={styles.dateNumber}>{day}</span>
                                  <span className={styles.dateMonth}>{monthName} {year}</span>
                                </div>
                                <h3 className={styles.newsTitle}>{news.title}</h3>
                                <span className={styles.newsCategory}>
                                  {news.category}
                                </span>
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
                      <div className={styles.carouselNavigation}>
                        <button 
                          className={styles.carouselButton}
                          onClick={() => handleNewsNavigation("prev")}
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
                                index === newsPage ? styles.activeIndicator : ""
                              }`}
                              onClick={() => setNewsPage(index)}
                              aria-label={`Go to page ${index + 1}`}
                            />
                          ))}
                        </div>
                        <button 
                          className={styles.carouselButton}
                          onClick={() => handleNewsNavigation("next")}
                          aria-label="Next news"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <Link href="/media-center/news" className={styles.viewAllLink}>
                        عرض الكل
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className={styles.carouselContainer}>
              {loading.events ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>جاري تحميل الفعاليات...</p>
                </div>
              ) : error.events ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>{error.events}</p>
                </div>
              ) : eventsData.length === 0 ? (
                <div className={styles.noResults}>
                  <h3>لا توجد فعاليات متاحة</h3>
                </div>
              ) : (
                <>
                  <div 
                    className={styles.intelligentCarousel}
                    ref={eventsCarouselRef}
                    onMouseDown={(e) => handleMouseDown(e, eventsCarouselRef)}
                    onMouseMove={(e) => handleMouseMove(e, eventsCarouselRef)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={eventsPage}
                        className={styles.carouselItems}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                      >
                        {getCurrentEventsItems().map((event, index) => {
                          // Format date based on the format
                          let day, monthName, year;

                          try {
                            if (event.createdAt.includes("T")) {
                              // ISO format
                              const date = new Date(event.createdAt);
                              day = date.getDate().toString().padStart(2, "0");
                              const month = (date.getMonth() + 1).toString().padStart(2, "0");
                              year = date.getFullYear();

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
                              monthName = monthNames[month];
                            } else {
                              // DD/MM/YYYY format
                              [day, month, year] = event.createdAt.split("/");
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
                              monthName = monthNames[month];
                            }
                          } catch (error) {
                            console.error("Error formatting date:", error);
                            [day, monthName, year] = ["", "", ""];
                          }

                          return (
                            <motion.div 
                              key={event.id} 
                              className={styles.carouselCard}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: { delay: index * 0.1 }
                              }}
                              whileHover={{ 
                                y: -10,
                                transition: { duration: 0.2 }
                              }}
                            >
                              <Link
                                href={`/media-center/circulars/${event.id}`}
                                className={styles.newsCard}
                              >
                                <div className={styles.newsImage}>
                                  <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    width={400}
                                    height={250}
                                    className={styles.cardImage}
                                  />
                                  <div className={styles.imageOverlay}></div>
                                </div>
                                <div className={styles.newsContent}>
                                  <div className={styles.newsDate}>
                                    <span className={styles.dateNumber}>{day}</span>
                                    <span className={styles.dateMonth}>
                                      {monthName} {year}
                                    </span>
                                  </div>
                                  <h3 className={styles.newsTitle}>{event.title}</h3>
                                  <span className={styles.newsCategory}>
                                    {event.category}
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {eventsData.length > itemsPerPage && (
                    <div className={styles.carouselControls}>
                      <div className={styles.carouselNavigation}>
                        <button 
                          className={styles.carouselButton}
                          onClick={() => handleEventsNavigation("prev")}
                          aria-label="Previous event"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className={styles.carouselIndicators}>
                          {Array.from({ length: Math.ceil(eventsData.length / itemsPerPage) }).map((_, index) => (
                            <button
                              key={index}
                              className={`${styles.carouselIndicator} ${
                                index === eventsPage ? styles.activeIndicator : ""
                              }`}
                              onClick={() => setEventsPage(index)}
                              aria-label={`Go to page ${index + 1}`}
                            />
                          ))}
                        </div>
                        <button 
                          className={styles.carouselButton}
                          onClick={() => handleEventsNavigation("next")}
                          aria-label="Next event"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <Link href="/media-center/circulars" className={styles.viewAllLink}>
                        عرض الكل
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}