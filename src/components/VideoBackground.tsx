import React from 'react';
import Image from 'next/image';
import styles from '../styles/VideoBackground.module.css';

const VideoBackground = () => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.imageWrapper}>
        <Image 
          src="/bisha-background.jpg" 
          alt="Bisha Background"
          fill
          priority
          quality={100}
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default VideoBackground;