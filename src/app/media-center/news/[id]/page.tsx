"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import { newsData } from '../../../../data/newsData';
import styles from '../../../../styles/NewsDetail.module.css';

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // Find the news item
  const newsItem = newsData.find(item => item.id === id);

  // Find related news (same category, excluding current)
  const relatedNews = newsData
    .filter(item => item.category === newsItem?.category && item.id !== id)
    .slice(0, 3);

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

  // If news item not found
  if (!newsItem) {
    return (
      <div className={styles.notFound}>
        <h1>الخبر غير موجود</h1>
        <p>عذراً، الخبر الذي تبحث عنه غير موجود.</p>
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
            src={newsItem.image}
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
                      src={news.image}
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
