"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
// User data interface
interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

// Pagination response interface
interface PaginatedResponse {
  items: User[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

const AdminClientsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');

  // Function to fetch users from API
  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://bisha.runasp.net';
      const url = `${API_BASE_URL}/api/Register/Get-Users/${page}`;
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make the API request
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      console.log(data);
      setUsers(data.newsPaper);
      setFilteredUsers(data.newsPaper);
      setTotalPages(data.totalPages);
      setTotalCount(data.pageNumber);
      setCurrentPage(data.pageNumber);

    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(`فشل في جلب بيانات المستخدمين: ${error.message || 'خطأ غير معروف'}`);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      setLoading(false);
      fetchUsers(currentPage);

    } else {
      setLoading(false);
      fetchUsers(currentPage);
    }
  }, [user, isAdmin, router, currentPage]);

  // Filter users based on search term
  useEffect(() => {

    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const result = users.filter(user =>
      user.fullName.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phoneNumber.includes(searchTerm)
    );

    setFilteredUsers(result);

  }, [searchTerm, users]);

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://bisha.runasp.net';
        const url = `${API_BASE_URL}/api/Register/Delete-User/${id}`;

        // Get auth token
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Make the API request
        const response = await fetch(url, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API error: ${response.status}`);
        }

        // Refresh the user list
        fetchUsers(currentPage);
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError(`فشل في حذف المستخدم: ${error.message || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUsers(newPage);
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
        <h1><FaUsers className={styles.headerIcon} /> إدارة المستخدمين</h1>
        <Link href="/admin/clients/add" className={styles.addButton}>
          <FaPlus /> إضافة مستخدم جديد
        </Link>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

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
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم الكامل</th>
              <th>البريد الإلكتروني</th>
              <th>رقم الهاتف</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={user.isActive ? '' : styles.inactiveRow}>
                <td className='text-black'>{(currentPage - 1) * 10 + index + 1}</td>
                <td className='text-black'>{user.fullName}</td>
                <td className='text-black'>{user.email}</td>
                <td className='text-black'>{user.phoneNumber}</td>
                <td>
                  <span className={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <Link href={`/admin/clients/edit/${user.id}`} className={styles.editButton}>
                    <FaEdit />
                  </Link>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronRight />
          </button>

          <div className={styles.pageInfo}>
            الصفحة {currentPage} من {totalPages} (إجمالي: {totalCount})
          </div>

          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronLeft />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;
