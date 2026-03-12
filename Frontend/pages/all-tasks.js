import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Calendar, Flag, CheckCircle, Clock, Edit2, Trash2, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import EditTask from '../components/EditTask';
import { getAllTasks, deleteTask } from '../services/taskService';
import { getCurrentUser, removeUser } from '../services/authService';
import styles from '../styles/AllTasks.module.css';

export default function AllTasks() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('all-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  
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
      const data = await getAllTasks(user.id);
      setTasks(data);
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

  const handleSaveEdit = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
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

  // Date filtering logic
  const filterTasksByDate = (task) => {
    if (filterDate === 'all') return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (filterDate) {
      case 'overdue':
        return diffDays < 0 && task.status !== 'completed';
      case 'today':
        return diffDays === 0;
      case 'upcoming':
        return diffDays > 0;
      default:
        return true;
    }
  };

  // Count tasks by date category
  const getDateCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let overdue = 0;
    let todayCount = 0;
    let upcoming = 0;
    
    tasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0 && task.status !== 'completed') {
        overdue++;
      } else if (diffDays === 0) {
        todayCount++;
      } else if (diffDays > 0) {
        upcoming++;
      }
    });
    
    return { overdue, today: todayCount, upcoming };
  };

  const dateCounts = getDateCounts();

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  const dateFilteredTasks = filteredTasks.filter(filterTasksByDate);

  const searchedTasks = dateFilteredTasks.filter(task => 
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

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === 'completed' ? styles.statusCompleted : styles.statusPending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
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
            <h1 className={styles.pageTitle}>All Tasks</h1>
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

        {/* Date Filter Section */}
        <div className={styles.dateFilterSection}>
          <div className={styles.dateFilterLabel}>
            <Filter size={18} />
            Filter by Date:
          </div>
          <div className={styles.dateFilterButtons}>
            <button 
              className={`${styles.dateFilterBtn} ${filterDate === 'all' ? styles.dateFilterActive : ''}`}
              onClick={() => setFilterDate('all')}
            >
              All
            </button>
            <button 
              className={`${styles.dateFilterBtn} ${styles.dateFilterOverdue} ${filterDate === 'overdue' ? styles.dateFilterActive : ''}`}
              onClick={() => setFilterDate('overdue')}
            >
              Overdue {dateCounts.overdue > 0 && <span className={styles.countBadge}>{dateCounts.overdue}</span>}
            </button>
            <button 
              className={`${styles.dateFilterBtn} ${styles.dateFilterToday} ${filterDate === 'today' ? styles.dateFilterActive : ''}`}
              onClick={() => setFilterDate('today')}
            >
              Today {dateCounts.today > 0 && <span className={styles.countBadge}>{dateCounts.today}</span>}
            </button>
            <button 
              className={`${styles.dateFilterBtn} ${styles.dateFilterUpcoming} ${filterDate === 'upcoming' ? styles.dateFilterActive : ''}`}
              onClick={() => setFilterDate('upcoming')}
            >
              Upcoming {dateCounts.upcoming > 0 && <span className={styles.countBadge}>{dateCounts.upcoming}</span>}
            </button>
          </div>
        </div>

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
              <p>No tasks found</p>
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
                    <span className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
                      {task.status?.toLowerCase() === 'completed' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                      <span style={{ textTransform: 'capitalize' }}>{task.status?.toLowerCase()}</span>
                    </span>
                    
                    <span className={`${styles.dueDate} ${isOverdue(task.dueDate, task.status) ? styles.overdueDate : ''}`}>
                      <Calendar size={16} />
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate, task.status) && <span className={styles.overdueLabel}>Overdue</span>}
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
