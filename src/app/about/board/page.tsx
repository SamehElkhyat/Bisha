"use client";

import React from 'react';
import Image from 'next/image';
import { FaUser, FaUserTie, FaUsers } from 'react-icons/fa';
import styles from '../../../styles/Board.module.css';

// Board members data
const boardMembers = [
  {
    id: 1,
    name: "جلوي محمد كركمان",
    position: "رئيس مجلس الإدارة",
    image: "/board-member-placeholder.jpg",
    isChairman: true
  },
  {
    id: 2,
    name: "مسفر مفلح المساعد",
    position: "نائب رئيس مجلس الإدارة",
    image: "/board-member-placeholder.jpg",
    isViceChairman: true
  },
  {
    id: 3,
    name: "عون حالان الحارثي",
    position: "نائب رئيس مجلس الإدارة",
    image: "/board-member-placeholder.jpg",
    isViceChairman: true
  },
  {
    id: 4,
    name: "محمد دغيليب الشهراني",
    position: "عضو مجلس الإدارة",
    image: "/board-member-placeholder.jpg"
  },
  {
    id: 5,
    name: "عبدالرزاق أحمد الغامدي",
    position: "عضو مجلس الإدارة",
    image: "/board-member-placeholder.jpg"
  },
  {
    id: 6,
    name: "سعيد علي كدسة",
    position: "عضو مجلس الإدارة",
    image: "/board-member-placeholder.jpg"
  },
  {
    id: 7,
    name: "عبير محمد السلولي",
    position: "عضو مجلس الإدارة",
    image: "/board-member-placeholder.jpg"
  },
  {
    id: 8,
    name: "أحمد علي الغامدي",
    position: "عضو مجلس الإدارة",
    image: "/board-member-placeholder.jpg"
  }
];

const BoardPage = () => {
  // Get chairman, vice chairmen and regular members
  const chairman = boardMembers.find(member => member.isChairman);
  const viceChairmen = boardMembers.filter(member => member.isViceChairman);
  const regularMembers = boardMembers.filter(member => !member.isChairman && !member.isViceChairman);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>مجلس الإدارة</h1>
          <p className={styles.pageDescription}>
            أعضاء مجلس إدارة غرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Chairman Section */}
        {chairman && (
          <div className={styles.chairmanSection}>
            <div className={styles.sectionTitle}>
              <FaUserTie className={styles.sectionIcon} />
              <h2>رئيس مجلس الإدارة</h2>
            </div>
            
            <div className={styles.chairmanCard}>
              <div className={styles.memberImageContainer}>
                <div className={styles.memberImageWrapper}>
                  <Image 
                    src={chairman.image} 
                    alt={chairman.name} 
                    width={300} 
                    height={300} 
                    className={styles.memberImage}
                  />
                </div>
              </div>
              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{chairman.name}</h3>
                <p className={styles.memberPosition}>{chairman.position}</p>
              </div>
            </div>
          </div>
        )}

        {/* Vice Chairmen Section */}
        {viceChairmen.length > 0 && (
          <div className={styles.viceChairmenSection}>
            <div className={styles.sectionTitle}>
              <FaUserTie className={styles.sectionIcon} />
              <h2>نواب رئيس مجلس الإدارة</h2>
            </div>
            
            <div className={styles.viceChairmenGrid}>
              {viceChairmen.map(member => (
                <div key={member.id} className={styles.memberCard}>
                  <div className={styles.memberImageContainer}>
                    <div className={styles.memberImageWrapper}>
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={250} 
                        height={250} 
                        className={styles.memberImage}
                      />
                    </div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberPosition}>{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Board Members Section */}
        <div className={styles.membersSection}>
          <div className={styles.sectionTitle}>
            <FaUsers className={styles.sectionIcon} />
            <h2>أعضاء مجلس الإدارة</h2>
          </div>
          
          <div className={styles.membersGrid}>
            {regularMembers.map(member => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberImageContainer}>
                  <div className={styles.memberImageWrapper}>
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      width={200} 
                      height={200} 
                      className={styles.memberImage}
                    />
                  </div>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberPosition}>{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
