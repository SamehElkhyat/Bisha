
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppWrapper from '../components/AppWrapper';
import mapStyles from '../styles/Map.module.css';
import Main from './Main';
import NewsSections from './NewsSections';
import Mainservices from './Mainservices';
import DetailsBisha from './DetailsBisha';
import TwitterSection from './TwiterSection';

// Dynamically import the MapClient component with no SSR
const MapClient = dynamic(() => import('../components/MapClient'), {
  ssr: false
});


const HomePage = () => {


  // Format date to show day, month and year


  // All services data with multiple sets
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


  return (
    <AppWrapper>
      <div>
        <Header />
        <Main />
        <NewsSections />
        <Mainservices />
        <DetailsBisha />
        <TwitterSection />



        






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

