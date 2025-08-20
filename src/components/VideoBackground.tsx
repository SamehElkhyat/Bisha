import React from 'react';
import styles from '../styles/VideoBackground.module.css';

const VideoBackground = () => {
  return (
    <div className={styles.videoContainer}>

      <div className={styles.video} style={{
        background: `url('https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2023/09/18/images/249868.jpg') no-repeat center center`,
        backgroundSize: 'cover'
      }}></div>
      
      <div className={styles.overlay}></div>
    </div>
  );
};

export default VideoBackground;
