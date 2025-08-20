import React from 'react';
import styles from '../styles/VideoBackground.module.css';

const VideoBackground = () => {
  return (
    <div className={styles.videoContainer}>

      <video autoPlay loop muted className={styles.video}>
        <source src="/Intro.mp4" type="video/mp4" />
      </video>
      
      <div className={styles.overlay}></div>
    </div>
  );
};

export default VideoBackground;
