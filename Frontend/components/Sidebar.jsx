import React from 'react';
import { useRouter } from 'next/router';
import { LayoutDashboard, Plus, ListTodo, CheckCircle, User, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, activePage, onLogout }) => {
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'add-task', name: 'Add Task', icon: Plus, path: '/add-task' },
    { id: 'all-tasks', name: 'All Tasks', icon: ListTodo, path: '/all-tasks' },
    { id: 'completed', name: 'Completed Tasks', icon: CheckCircle, path: '/completed-tasks' },
    { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logo}>TaskNotifier</h2>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`${styles.navItem} ${activePage === item.id ? styles.navItemActive : ''}`}
            >
              <Icon size={20} />
              <span className={styles.navText}>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button className={styles.logoutBtn} onClick={onLogout}>
        <LogOut size={20} />
        <span className={styles.navText}>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
