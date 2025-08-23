"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import styles from '../../../../styles/NewsDetail.module.css';
import { newsAPI } from '../../../../services/api';

// Define types for API responses
interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  image: string;
}

interface PaginatedResponse {
  newsPaper: NewsItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch news item from API
  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await newsAPI.getById(id);
        
        if (data) {
          setNewsItem(data);
          
          // Fetch related news (we'll get all news and filter)
          try {
            const allNewsData: PaginatedResponse = await newsAPI.getAll(1);
            if (allNewsData && allNewsData.newsPaper) {
              // Filter related news (same category, excluding current)
              const related = allNewsData.newsPaper
                .filter(item => item.category === data.category && item.id !== id)
                .slice(0, 3);
              
              setRelatedNews(related);
            }
          } catch (err) {
            console.error('Error fetching related news:', err);
            setRelatedNews([]);
          }
        } else {
          setError('الخبر غير موجود');
          setNewsItem(null);
        }
      } catch (err) {
        console.error('Error fetching news item:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsItem();
    }
  }, [id]);

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      // Check if the date is in ISO format
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        const monthNames: { [key: string]: string } = {
          '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
          '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
          '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
        };
        
        return `${day} ${monthNames[month]} ${year}`;
      } else {
        // Handle the format DD/MM/YYYY
        const [day, month, year] = dateString.split('/');
        const monthNames: { [key: string]: string } = {
          '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
          '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
          '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
        };
        
        return `${day} ${monthNames[month]} ${year}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if there's an error
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل الخبر...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !newsItem) {
    return (
      <div className={styles.notFound}>
        <h1>الخبر غير موجود</h1>
        <p>{error || 'عذراً، الخبر الذي تبحث عنه غير موجود.'}</p>
        <Link href="/media-center/news" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الأخبار
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.newsDetailContainer}>
      <div className={styles.backLink}>
        <Link href="/media-center/news" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الأخبار
        </Link>
      </div>

      <div className={styles.newsDetailContent}>
        <div className={styles.newsHeader}>
          <h1 className={styles.newsTitle}>{newsItem.title}</h1>
          <div className={styles.newsMetadata}>
            <span className={styles.newsDate}>
              <FaCalendarAlt className={styles.metaIcon} />
              {formatDate(newsItem.date)}
            </span>
            <span className={styles.newsCategory}>
              <FaTag className={styles.metaIcon} />
              {newsItem.category}
            </span>
          </div>
        </div>

        <div className={styles.newsImageContainer}>
          <Image
            src={newsItem.image || "/news-placeholder.jpg"}
            alt={newsItem.title}
            width={800}
            height={500}
            className={styles.newsImage}
            priority
          />
        </div>

        <div className={styles.newsBody}>
          <p className={styles.newsContent}>{newsItem.content}</p>
        </div>

        {relatedNews.length > 0 && (
          <div className={styles.relatedNews}>
            <h2 className={styles.relatedTitle}>أخبار ذات صلة</h2>
            <div className={styles.relatedGrid}>
              {relatedNews.map((news) => (
                <div key={news.id} className={styles.relatedCard}>
                  <div className={styles.relatedImageContainer}>
                    <Image
                      src={news.image || "/news-placeholder.jpg"}
                      alt={news.title}
                      width={300}
                      height={200}
                      className={styles.relatedImage}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedNewsTitle}>{news.title}</h3>
                    <Link href={`/media-center/news/${news.id}`} className={styles.relatedLink}>
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetailPage;
