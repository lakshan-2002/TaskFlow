import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import OverviewCards from '../components/OverviewCards';
import Charts from '../components/Charts';
import { getAllTasks } from '../services/taskService';
import { getCurrentUser, removeUser } from '../services/authService';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Calculate task statistics
  const calculateStats = () => {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status?.toLowerCase() === 'pending').length;
    
    return {
      allTasks,
      completedTasks,
      pendingTasks
    };
  };

  const stats = calculateStats();

  const handleLogout = () => {
    removeUser();
    toast.success('Logged out successfully!');
    router.push('/login');
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
            <h1 className={styles.pageTitle}>Dashboard</h1>
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

        {/* Content Area */}
        <div className={styles.content}>
          {/* Overview Cards */}
          <OverviewCards 
            allTasks={stats.allTasks}
            pendingTasks={stats.pendingTasks}
            completedTasks={stats.completedTasks}
            isLoading={isLoading}
          />

          {/* Charts */}
          <Charts 
            tasks={tasks}
            allTasks={stats.allTasks}
            pendingTasks={stats.pendingTasks}
            completedTasks={stats.completedTasks}
            isLoading={isLoading}
          />

          {/* Error Display */}
          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={fetchTasks} className={styles.retryBtn}>
                Retry
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
