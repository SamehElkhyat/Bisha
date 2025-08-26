
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppWrapper from '../components/AppWrapper';
import styles from '../styles/Home.module.css';
import mapStyles from '../styles/Map.module.css';
import { newsAPI } from '../services/api';

// Dynamically import the MapClient component with no SSR
const MapClient = dynamic(() => import('../components/MapClient'), {
  ssr: false
});

// Define types for API responses
interface NewsItem {
  [x: string]: any;
  id: number;
  createdAt: string;
  title: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
  type?: string;
}

interface PaginatedResponse {
  newsPaper: NewsItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isAnnouncementAnimating, setIsAnnouncementAnimating] = useState(false);


  // State for news and events data from API
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [eventsData, setEventsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState({ news: true, events: true });

  // Format date to show day, month and year
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

      const monthNames = {
        '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
        '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
        '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
      };

      return `${day} ${monthNames[month]} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  const [error, setError] = useState({ news: '', events: '' });

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(prev => ({ ...prev, news: true }));
        setError(prev => ({ ...prev, news: '' }));
        const data = await newsAPI.getAll();
        console.log(data);

        if (data && data.newsPaper) {
          setNewsData(data.newsPaper.slice(0, 5)); // Limit to 5 items for homepage
        } else {
          setError(prev => ({ ...prev, news: 'لا توجد بيانات متاحة' }));
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(prev => ({ ...prev, news: 'حدث خطأ أثناء تحميل البيانات' }));
        // Use fallback data if API fails
      } finally {
        setLoading(prev => ({ ...prev, news: false }));
      }
    };

    fetchNews();
  }, []);

  // Fetch events data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        setError(prev => ({ ...prev, events: '' }));
        const data = await newsAPI.getAllCirculars(1);

        console.log(data);
        if (data && data.newsPaper) {
          setEventsData(data.newsPaper.slice(0, 5)); // Limit to 5 items for homepage
        } else {
          setError(prev => ({ ...prev, events: 'لا توجد بيانات متاحة' }));
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(prev => ({ ...prev, events: 'حدث خطأ أثناء تحميل البيانات' }));
        // Use fallback data if API fails
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    fetchEvents();
  }, []);

  // All services data with multiple sets
  const allServicesData = [
    [
      {
        id: 1,
        title: "إدارة البحوث والدراسات",
        description: "هي الجهة المختصة في الغرفة بتقديم خدمات البحوث والدراسات...",
        icon: "M8 12h24v16H8V12zm2 2v12h20V14H10z M12 16h16v2H12v-2zm0 4h12v2H12v-2z"
      },
      {
        id: 2,
        title: "إدارة الاستثمار",
        description: "الإدارة التي تقدم خدمات استثمارية وبناء شراكات إستراتيجية مع...",
        icon: "M20 8l8 6v16h-6v-8h-4v8h-6V14l8-6z"
      },
      {
        id: 3,
        title: "مركز المنشآت الصغيرة",
        description: "تعزيز وتطوير المشاريع الصغيرة والمتوسطة في منطقة عسير...",
        icon: "M20 4C11.16 4 4 11.16 4 20s7.16 16 16 16 16-7.16 16-16S28.84 4 20 4zm0 28c-6.63 0-12-5.37-12-12S13.37 8 20 8s12 5.37 12 12-5.37 12-12 12z M18 14h4v8h-4v-8zm0 10h4v4h-4v-4z"
      }
    ],
    [
      {
        id: 4,
        title: "إدارة الشؤون القانونية",
        description: "تقدم الاستشارات القانونية والخدمات التحكيمية لأعضاء الغرفة...",
        icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      },
      {
        id: 5,
        title: "إدارة التدريب والتطوير",
        description: "تنظم البرامج التدريبية وورش العمل لتطوير مهارات رجال الأعمال...",
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      },
      {
        id: 6,
        title: "إدارة العلاقات العامة",
        description: "تدير العلاقات مع الجهات الحكومية والخاصة وتنظم الفعاليات...",
        icon: "M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11v7h4v4h4z"
      }
    ],
    [
      {
        id: 7,
        title: "إدارة التسويق الإلكتروني",
        description: "تساعد الشركات في التحول الرقمي وتطوير استراتيجيات التسويق الحديثة...",
        icon: "M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2z"
      },
      {
        id: 8,
        title: "إدارة الجودة والاعتماد",
        description: "تقدم خدمات الحصول على شهادات الجودة والمعايير الدولية...",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      {
        id: 9,
        title: "إدارة الخدمات اللوجستية",
        description: "تسهل عمليات الشحن والنقل وإدارة سلاسل التوريد للشركات الأعضاء...",
        icon: "M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
      }
    ]
  ];

  // Announcements data
  const allAnnouncementsData = [
    [
      {
        id: 1,
        title: "الاستثمار في مراكز ضيافة الأطفال الأهلية",
        date: "21 أغسطس 2025",
        details: {
          subtitle: "بالتعاون مع وزارة الموارد البشرية والتنمية الاجتماعية",
          description: "للحضور والمشاركة من أجل الاستثمار في مركز ضيافة الأطفال الأهلية",
          phone: "0556862551",
          location: "مقر غرفة أبها | المركز الرئيسي"
        }
      },
      {
        id: 2,
        title: "دورة تدريبية لمدة 3 أيام \" عمارة مرتفعات أبها \"",
        date: "05 أغسطس 2025",
        details: {
          subtitle: "\" عمارة مرتفعات أبها \"",
          dateRange: "من 11 - 13",
          month: "أغسطس",
          year: "2025",
          time: "من الساعة 5:00 - 8:00 مساءً",
          trainer: "المدرب: سعد بن عبدالله"
        }
      }
    ],
    [
      {
        id: 3,
        title: "ورشة عمل التجارة الإلكترونية",
        date: "15 سبتمبر 2025",
        details: {
          subtitle: "تطوير مهارات التجارة الرقمية",
          description: "ورشة متخصصة في أساسيات التجارة الإلكترونية",
          phone: "0556862552",
          location: "مقر غرفة بيشة | القاعة الكبرى"
        }
      },
      {
        id: 4,
        title: "مؤتمر الاستثمار السياحي",
        date: "28 سبتمبر 2025",
        details: {
          subtitle: "فرص الاستثمار في القطاع السياحي",
          dateRange: "من 25 - 28",
          month: "سبتمبر",
          year: "2025",
          time: "من الساعة 9:00 - 12:00 صباحاً",
          trainer: "المتحدث: د. أحمد العمري"
        }
      }
    ]
  ];

  // Committee data
  const allCommitteeData = [
    {
      id: 1,
      title: "هنا تجد كل ما يتعلق بخدمات اللجان القطاعية",
      subtitle: "اللجان القطاعية",
      description: "أن تصبح منطقة عسير من المناطق المتقدمة صناعياً خلال الأعوام القادمة عن طريق الاستفادة بطاقة مستمرة في تطوير القطاع الصناعي السعودي في مجالات: التقنية، التصدير",
      image: "/committee-bg.jpg"
    },
    {
      id: 2,
      title: "هنا تجد كل ما يتعلق بخدمات اللجان التجارية",
      subtitle: "اللجان التجارية",
      description: "تطوير القطاع التجاري وتعزيز الاستثمار في المنطقة من خلال تقديم الخدمات المتميزة والحلول المبتكرة للتجار والمستثمرين",
      image: "/committee-bg2.jpg"
    },
    {
      id: 3,
      title: "هنا تجد كل ما يتعلق بخدمات اللجان الاستشارية",
      subtitle: "اللجان الاستشارية",
      description: "تقديم الاستشارات المتخصصة والدعم الفني للشركات والمؤسسات في مختلف المجالات الاقتصادية والإدارية",
      image: "/committee-bg3.jpg"
    }
  ];

  const currentServices = allServicesData[currentServiceIndex];
  const currentAnnouncements = allAnnouncementsData[currentAnnouncementIndex];

  const handleServiceNavigation = (direction) => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      if (direction === 'up') {
        setCurrentServiceIndex((prev) =>
          prev > 0 ? prev - 1 : allServicesData.length - 1
        );
      } else {
        setCurrentServiceIndex((prev) =>
          prev < allServicesData.length - 1 ? prev + 1 : 0
        );
      }

      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection('');
      }, 50);
    }, 300);
  };

  const handleAnnouncementNavigation = (direction) => {
    if (isAnnouncementAnimating) return;

    setIsAnnouncementAnimating(true);

    setTimeout(() => {
      if (direction === 'left') {
        setCurrentAnnouncementIndex((prev) => prev > 0 ? prev - 1 : allAnnouncementsData.length - 1);
      } else {
        setCurrentAnnouncementIndex((prev) => prev < allAnnouncementsData.length - 1 ? prev + 1 : 0);
      }
      setTimeout(() => {
        setIsAnnouncementAnimating(false);
      }, 50);
    }, 300);
  };



  return (
    <AppWrapper>
      <div>
        <Header />
        <main className={styles.main}>
          <div className={styles.logoContainer}>
            {/* Add your logo.png to the /public folder */}
            <Image
              src="/bisha-chamber-logo.png"
              alt="Bisha Chamber Logo"
              className={styles.logo}
              width={320}
              height={320}
              priority
            />
          </div>
          <div className={styles.buttonGrid}>
            <button onClick={() => window.open('https://eservices.bishacci.org.sa/#/Login', '_blank')} className={styles.gridButton}>

              الصندوق الإلكتروني
            </button>
            <button className={styles.gridButton}>

              طباعة شهادة العضوية
            </button>
            <button className={styles.gridButton}>

              تحديث البيانات
            </button>
            <button className={styles.gridButton}>

              التحقق من الوثائق
            </button>
            <button className={styles.gridButton}>

              اشتراك جديد
            </button>
            <button className={styles.gridButton}>

              الاستعلام عن رقم العضوية
            </button>
            <button className={styles.gridButton}>

              تجديد الاشتراك
            </button>
            <button className={styles.gridButton}>

              الدليل التجاري
            </button>
            <button className={styles.gridButton}>

              السجل التجاري
            </button>
            <button className={styles.gridButton}>

              قوائم التمويل
            </button>
            <button className={styles.gridButton}>

              التدريب الإلكتروني
            </button>
            <button className={styles.gridButton}>

              المكتبة الإلكترونية
            </button>
            <button className={styles.gridButton}>
              الشكاوى والمقترحات
            </button>
            <button className={styles.gridButton}>

              الاتحاد والتحكيم
            </button>
          </div>
        </main>

        {/* News Section */}
        <section className={styles.newsSection}>
          <div className={styles.newsContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>المركز الإعلامي</h2>
              <p className={styles.sectionSubtitle}>تعرف على أحدث إصداراتنا</p>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'news' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('news')}
                >
                  الأخبار
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'events' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  الفعاليات
                </button>
              </div>
            </div>

            <div className={styles.contentContainer}>
              {activeTab === 'news' && (
                <div className={`${styles.newsGrid} ${styles.fadeIn}`}>
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
                    newsData.map((news) => {
                      return (
                        <Link href={`/media-center/news/${news.id}`} key={news.id} className={styles.newsCard}>
                          <div className={styles.newsImage}>
                            <Image src={news.imageUrl} alt="News" width={400} height={250} />
                          </div>
                          <div className={styles.newsContent}>
                            <div className={styles.newsDate}>
                              {(() => {
                                const formattedDate = formatDate(news.createdAt || news.date);
                                const parts = formattedDate.split(' ');
                                if (parts.length >= 3) {
                                  const day = parts[0];
                                  const monthYear = parts.slice(1).join(' ');
                                  return (
                                    <>
                                      <span className={styles.dateNumber}>{day}</span>
                                      <span className={styles.dateMonth}>{monthYear}</span>
                                    </>
                                  );
                                }
                                return <span className={styles.dateMonth}>{formattedDate}</span>;
                              })()}
                            </div>
                            <h3 className={styles.newsTitle}>{news.title}</h3>
                            <span className={styles.newsCategory}>{news.category}</span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className={`${styles.newsGrid} ${styles.fadeIn}`}>
                  {loading.events ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <p>جاري تحميل التعاميم...</p>
                    </div>
                  ) : error.events ? (
                    <div className={styles.errorContainer}>
                      <p className={styles.errorMessage}>{error.events}</p>
                    </div>
                  ) : eventsData.length === 0 ? (
                    <div className={styles.noResults}>
                      <h3>لا توجد تعاميم متاحة</h3>
                    </div>
                  ) : (
                    eventsData.map((event) => {
                      // Format date based on the format
                      let day, month, year, monthName;

                      try {
                        console.log(event);
                        if (event.createdAt.includes('T')) {
                          // ISO format
                          const date = new Date(event.createdAt);
                          day = date.getDate().toString().padStart(2, '0');
                          month = (date.getMonth() + 1).toString().padStart(2, '0');
                          year = date.getFullYear();

                          const monthNames = {
                            '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
                            '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
                            '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
                          };
                          monthName = monthNames[month];
                        } else {
                          // DD/MM/YYYY format
                          [day, month, year] = event.createdAt.split('/');
                          const monthNames = {
                            '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
                            '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
                            '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
                          };
                          monthName = monthNames[month];
                        }
                      } catch (error) {
                        console.error('Error formatting date:', error);
                        [day, monthName, year] = ['', '', ''];
                      }

                      return (
                        <Link href={`/media-center/circulars/${event.id}`} key={event.id} className={styles.newsCard}>
                          <div className={styles.newsImage}>
                            <Image src={event.imageUrl} alt="Event" width={400} height={250} />
                          </div>
                          <div className={styles.newsContent}>
                            <div className={styles.newsDate}>
                              <span className={styles.dateNumber}>{day}</span>
                              <span className={styles.dateMonth}>{monthName} {year}</span>
                            </div>
                            <h3 className={styles.newsTitle}>{event.title}</h3>
                            <span className={styles.newsCategory}>{event.category}</span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className={styles.newsNavigation}>
              <button className={styles.navButton}>‹</button>
              <button className={styles.navButton}>›</button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.servicesSection}>
          <div className={styles.servicesContainer}>
            <div className={styles.servicesContent}>
              <div className={styles.servicesText}>
                <h2 className={styles.servicesTitle}>
                  هنا تجد كل ما يتعلق بإدارات
                  <br />
                  الغرفة المختلفة
                </h2>
                <div className={styles.servicesSubtitle}>الإدارات</div>
              </div>

              <div className={`${styles.servicesCards} ${isAnimating
                ? slideDirection === 'up' ? styles.slideOutDown : styles.slideOutUp
                : styles.slideIn
                }`}>
                {currentServices.map((service, index) => (
                  <div
                    key={service.id}
                    className={styles.serviceCard}
                    style={{
                      animationDelay: isAnimating ? '0ms' : `${index * 100}ms`,
                      opacity: isAnimating ? 0 : 1
                    }}
                  >
                    <div className={styles.serviceIcon}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d={service.icon} fill="currentColor" />
                      </svg>
                    </div>
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDescription}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.servicesNavigation}>
              <button
                className={styles.serviceNavButton}
                onClick={() => handleServiceNavigation('up')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 14l5-5 5 5z" fill="currentColor" />
                </svg>
              </button>
              <button
                className={styles.serviceNavButton}
                onClick={() => handleServiceNavigation('down')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </section>



        {/* Committee Section */}
        <section className={styles.committeeSection}>
          <div className={styles.committeeContainer}>
            <div className={styles.committeeSectionHeader}>
              <h2 className={styles.committeeSectionTitle}>اللجان القطاعية</h2>
              <p className={styles.committeeSectionDescription}>
                تعرف على اللجان القطاعية المختلفة وخدماتها المتنوعة
              </p>
            </div>

            <div className={styles.committeeCardsGrid}>
              {allCommitteeData.map((committee, index) => (
                <div key={committee.id} className={styles.committeeCard}>
                  <div className={styles.committeeCardHeader}>
                    <div className={styles.committeeCardIcon}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className={styles.committeeCardTitle}>{committee.subtitle}</h3>
                  </div>

                  <div className={styles.committeeCardContent}>
                    <p className={styles.committeeCardDescription}>
                      {committee.description}
                    </p>
                  </div>

                  <div className={styles.committeeCardFooter}>
                    <button className={styles.committeeCardButton}>
                      تفاصيل أكثر
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className={mapStyles.mapSection}>
          <MapClient />
        </section>

        {/* Footer Section */}
        <Footer />
      </div>
    </AppWrapper>
  );
};

export default HomePage;

