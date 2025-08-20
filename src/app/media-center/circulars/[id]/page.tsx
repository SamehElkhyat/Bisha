"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import { eventsData } from '../../../../data/newsData';
import styles from '../../../../styles/CircularDetail.module.css';

const CircularDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // Find the event item
  const eventItem = eventsData.find(item => item.id === id);

  // Find related events (same category, excluding current)
  const relatedEvents = eventsData
    .filter(item => item.category === eventItem?.category && item.id !== id)
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

  // If event item not found
  if (!eventItem) {
    return (
      <div className={styles.notFound}>
        <h1>التعميم غير موجود</h1>
        <p>عذراً، التعميم الذي تبحث عنه غير موجود.</p>
        <Link href="/media-center/circulars" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى التعاميم
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.circularDetailContainer}>
      <div className={styles.backLink}>
        <Link href="/media-center/circulars" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى التعاميم
        </Link>
      </div>

      <div className={styles.circularDetailContent}>
        <div className={styles.circularHeader}>
          <h1 className={styles.circularTitle}>{eventItem.title}</h1>
          <div className={styles.circularMetadata}>
            <span className={styles.circularDate}>
              <FaCalendarAlt className={styles.metaIcon} />
              {formatDate(eventItem.date)}
            </span>
            <span className={styles.circularCategory}>
              <FaTag className={styles.metaIcon} />
              {eventItem.category}
            </span>
          </div>
        </div>

        <div className={styles.circularImageContainer}>
          <Image
            src={eventItem.image}
            alt={eventItem.title}
            width={800}
            height={500}
            className={styles.circularImage}
            priority
          />
        </div>

        <div className={styles.circularBody}>
          <p className={styles.circularContent}>{eventItem.content}</p>
        </div>

        {relatedEvents.length > 0 && (
          <div className={styles.relatedCirculars}>
            <h2 className={styles.relatedTitle}>تعاميم ذات صلة</h2>
            <div className={styles.relatedGrid}>
              {relatedEvents.map((event) => (
                <div key={event.id} className={styles.relatedCard}>
                  <div className={styles.relatedImageContainer}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={300}
                      height={200}
                      className={styles.relatedImage}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedCircularTitle}>{event.title}</h3>
                    <Link href={`/media-center/circulars/${event.id}`} className={styles.relatedLink}>
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

export default CircularDetailPage;
