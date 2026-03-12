import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { createTask } from '../services/taskService';
import { getCurrentUser, removeUser } from '../services/authService';
import styles from '../styles/AddTask.module.css';

export default function AddTask() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('add-task');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLogout = () => {
    removeUser();
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const user = getCurrentUser();

      if (!user) {
        router.push('/login');
        return;
      }

      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        user: user
      });

      setSuccessMessage('Task added successfully!');
      toast.success('Task added successfully!');
      
      handleReset();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Error adding task:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while adding the task';
      setError(errorMessage);
      toast.error("Error adding task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`${styles.main} ${!isSidebarOpen ? styles.mainExpanded : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={styles.menuBtn}
            >
              <div className={styles.hamburgerIcon}>  
                <span></span>
                <span></span>
                <span></span>
              </div>  
            </button>
            <h1 className={styles.pageTitle}>Add New Task</h1>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.taskForm}>
              {/* Title Field */}
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>
                  Task Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter task title"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description Field */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>
                  Description <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Enter task description"
                  rows="5"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Status and Priority Row */}
              <div className={styles.formRow}>
                {/* Status Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="status" className={styles.formLabel}>
                    Status <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Priority Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="priority" className={styles.formLabel}>
                    Priority <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Due Date Field */}
              <div className={styles.formGroup}>
                <label htmlFor="dueDate" className={styles.formLabel}>
                  Due Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className={styles.successMessage}>
                  {successMessage}
                </div>
              )}
              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {/* Form Buttons */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={isLoading}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding Task...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
