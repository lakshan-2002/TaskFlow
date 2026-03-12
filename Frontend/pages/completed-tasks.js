import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Calendar, Flag, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import EditTask from '../components/EditTask';
import { getAllTasks, deleteTask } from '../services/taskService';
import { getCurrentUser, removeUser } from '../services/authService';
import styles from '../styles/CompletedTasks.module.css';

export default function CompletedTasks() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('completed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Tasks data and loading state
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const user = getCurrentUser();

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllTasks();
      const completedTasks = data.filter(task => task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed');
      setTasks(completedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeUser();
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedTask) => {
    // Refetch all tasks to ensure we have the latest data from the backend
    await fetchTasks();
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully!');
      } catch (err) {
        console.error('Error deleting task:', err);
        const errorMessage = err.response?.data?.message || 'Failed to delete task';
        setError(errorMessage);
        toast.error("Error deleting task");
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  const searchedTasks = filteredTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch (priorityLower) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onLogout={handleLogout}
      />

      <main className={`${styles.main} ${!isSidebarOpen ? styles.mainExpanded : ''}`}>
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
            <h1 className={styles.pageTitle}>Completed Tasks</h1>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </header>

        {/* Tasks Grid */}
        <div className={styles.tasksGrid}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading tasks...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.retryBtn} onClick={fetchTasks}>Retry</button>
            </div>
          ) : searchedTasks.length === 0 ? (
            <div className={styles.noTasks}>
              <p>No completed tasks found</p>
            </div>
          ) : (
            searchedTasks.map(task => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskCardHeader}>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                </div>

                <div className={styles.priorityBadgeContainer}>
                  <span className={`${styles.priorityBadge} ${getPriorityColor(task.priority || 'medium')}`}>
                    <Flag size={14} />
                    <span style={{ textTransform: 'capitalize' }}>{task.priority?.toLowerCase() || 'medium'}</span>
                  </span>
                </div>
                
                <p className={styles.taskDescription}>{task.description}</p>
                
                <div className={styles.taskFooter}>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
                      <CheckCircle size={16} />
                      <span style={{ textTransform: 'capitalize' }}>{task.status?.toLowerCase() === 'done' ? 'Done' : 'Completed'}</span>
                    </span>
                    
                    <span className={styles.dueDate}>
                      <Calendar size={16} />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                <div className={styles.taskActionsBottom}>
                  <button 
                    className={`${styles.actionBtnBottom} ${styles.editBtnBottom}`}
                    onClick={() => handleEdit(task)}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    className={`${styles.actionBtnBottom} ${styles.deleteBtnBottom}`}
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <EditTask 
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
