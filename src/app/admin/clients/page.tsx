"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaUserPlus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
// User data interface
interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

// Permissions interface
interface UserPermissions {
  canDeleteNews: boolean;
  canAddNews: boolean;
  canEditNews: boolean;
  canRegisterAndViewComplaints: boolean;
  canViewClients: boolean;
  canChangePermissions: boolean;
}

// Pagination response interface
interface PaginatedResponse {
  newsPaper: User[];
  totalCount: number;
  pageNumber: number;
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

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    canDeleteNews: false,
    canAddNews: false,
    canEditNews: false,
    canRegisterAndViewComplaints: false,
    canViewClients: false,
    canChangePermissions: false,
  });

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

  // Handle permission button click
  const handlePermissionClick = (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    // Reset permissions to default
    setUserPermissions({
      canDeleteNews: false,
      canAddNews: false,
      canEditNews: false,
      canRegisterAndViewComplaints: false,
      canViewClients: false,
      canChangePermissions: false,
    });
    setIsPermissionModalOpen(true);
  };

  // Handle permission change
  const handlePermissionChange = (permission: keyof UserPermissions) => {
    setUserPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  // Close permission modal
  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName('');
  };

  // Save user permissions
  const saveUserPermissions = async () => {
    if (!selectedUserId) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://bisha.runasp.net';
      const url = `${API_BASE_URL}/api/Admin/Change-Roles`;

      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Convert permissions object to array of permission names
      const permissionNames: string[] = [];

      if (userPermissions.canDeleteNews) permissionNames.push('حذف الأخبار');
      if (userPermissions.canAddNews) permissionNames.push('إضافة الأخبار');
      if (userPermissions.canEditNews) permissionNames.push('تعديل الأخبار');
      if (userPermissions.canRegisterAndViewComplaints) permissionNames.push('تسجيل والاطلاع على الشكاوي');
      if (userPermissions.canViewClients) permissionNames.push('عملاء');
      if (userPermissions.canChangePermissions) permissionNames.push('تغيير صلاحيات');

      // Prepare request body
      const requestBody = {
        userId: selectedUserId.toString(),
        permissionName: permissionNames
      };

      console.log('Sending permissions:', requestBody);

      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      // Close modal and show success message
      closePermissionModal();
      toast.success('تم تحديث الصلاحيات بنجاح');

    } catch (error) {
      console.error('Failed to update permissions:', error);
      setError(`فشل في تحديث الصلاحيات: ${error.message || 'خطأ غير معروف'}`);
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
              <th>تخصيص الصلاحيات</th>

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
                <td>
                  <button
                    className={styles.permissionButton}
                    onClick={() => handlePermissionClick(user.id, user.fullName)}
                    title="تخصيص الصلاحيات"
                  >
                    <FaUserPlus />
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

      {/* Permission Modal */}
      {isPermissionModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.permissionModal}>
            <div className={styles.modalHeader}>
              <h2>تخصيص الصلاحيات</h2>
              <span className={styles.userName}>المستخدم: {selectedUserName}</span>
              <button
                className={styles.closeModalButton}
                onClick={closePermissionModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.permissionsGrid}>

                {/* News Permissions */}
                <div className={styles.permissionSection}>
                  <h3>صلاحيات الأخبار</h3>
                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canAddNews}
                        onChange={() => handlePermissionChange('canAddNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canAddNews && <FaCheck />}
                      </span>
                      إضافة الأخبار
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canEditNews}
                        onChange={() => handlePermissionChange('canEditNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canEditNews && <FaCheck />}
                      </span>
                      تعديل الأخبار
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canDeleteNews}
                        onChange={() => handlePermissionChange('canDeleteNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canDeleteNews && <FaCheck />}
                      </span>
                      حذف الأخبار
                    </label>
                  </div>
                </div>


                {/* Other Permissions */}
                <div className={styles.permissionSection}>
                  <h3>صلاحيات أخرى</h3>
                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canRegisterAndViewComplaints}
                        onChange={() => handlePermissionChange('canRegisterAndViewComplaints')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canRegisterAndViewComplaints && <FaCheck />}
                      </span>
                      تسجيل والاطلاع على الشكاوي
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canViewClients}
                        onChange={() => handlePermissionChange('canViewClients')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canViewClients && <FaCheck />}
                      </span>
                      عملاء
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canChangePermissions}
                        onChange={() => handlePermissionChange('canChangePermissions')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canChangePermissions && <FaCheck />}
                      </span>
                      تغيير صلاحيات
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>

              <button
                className={styles.saveButton}
                onClick={saveUserPermissions}
                disabled={loading}
              >
                {loading ? <FaSpinner className={styles.spinner} /> : <FaCheck />} حفظ الصلاحيات
              </button>
              <button
                className={styles.cancelButton}
                onClick={closePermissionModal}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdminClientsPage;
