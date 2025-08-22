"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import Link from 'next/link';

// Mock client data for demonstration
const clientsData = [
  {
    id: 1,
    name: "شركة النور للتجارة",
    email: "info@alnoor.com",
    phone: "0555123456",
    company: "شركة النور للتجارة",
    type: "business",
    address: "بيشة، المملكة العربية السعودية"
  },
  {
    id: 2,
    name: "أحمد محمد العتيبي",
    email: "ahmed@example.com",
    phone: "0555789012",
    company: "مؤسسة الأفق",
    type: "individual",
    address: "بيشة، المملكة العربية السعودية"
  },
  {
    id: 3,
    name: "بلدية محافظة بيشة",
    email: "info@bisha.gov.sa",
    phone: "0555345678",
    company: "بلدية محافظة بيشة",
    type: "government",
    address: "بيشة، المملكة العربية السعودية"
  },
  {
    id: 4,
    name: "شركة الأمل للمقاولات",
    email: "contact@alamal.com",
    phone: "0555901234",
    company: "شركة الأمل للمقاولات",
    type: "business",
    address: "بيشة، المملكة العربية السعودية"
  },
  {
    id: 5,
    name: "خالد عبدالله الشهري",
    email: "khalid@example.com",
    phone: "0555567890",
    company: "",
    type: "individual",
    address: "بيشة، المملكة العربية السعودية"
  }
];

const AdminClientsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [clients, setClients] = useState(clientsData);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  
  // Get all unique client types
  const clientTypes = ['all', ...new Set(clientsData.map(item => item.type))];

  // Map client types to Arabic
  const clientTypeMap: { [key: string]: string } = {
    'all': 'جميع الأنواع',
    'business': 'شركة',
    'individual': 'فرد',
    'government': 'جهة حكومية'
  };

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      setLoading(false);

      // router.push('/login');
    } else if (!isAdmin()) {
      setLoading(false);

      // router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  // Filter clients based on search term and type
  useEffect(() => {
    let result = clients;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }
    
    setFilteredClients(result);
  }, [searchTerm, selectedType, clients]);

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      // In a real application, we would make an API call to delete the client
      // For this demo, we'll filter out the deleted client from our state
      const updatedClients = clients.filter(item => item.id !== id);
      setClients(updatedClients);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminListContainer}>
      <div className={styles.listHeader}>
        <h1><FaUsers className={styles.headerIcon} /> إدارة العملاء</h1>
        <Link href="/admin/clients/add" className={styles.addButton}>
          <FaPlus /> إضافة عميل جديد
        </Link>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="ابحث هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <div className={styles.categoryFilter}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            {clientTypes.map((type, index) => (
              <option key={index} value={type}>
                {clientTypeMap[type] || type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>رقم الهاتف</th>
              <th>النوع</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className={styles.titleCell}>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{clientTypeMap[item.type]}</td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/clients/edit/${item.id}`} className={styles.editButton}>
                      <FaEdit />
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.noResults}>
                  لا توجد نتائج مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClientsPage;
