import React from 'react';
import { ListTodo, LayoutDashboard, CheckCircle } from 'lucide-react';
import styles from './OverviewCards.module.css';

const OverviewCards = ({ allTasks = 0, pendingTasks = 0, completedTasks = 0, isLoading = false }) => {
  const cardsData = [
    {
      id: 1,
      title: 'All Tasks',
      value: allTasks,
      trend: '↑ 12% from last week',
      icon: ListTodo,
      colorClass: styles.cardBlue
    },
    {
      id: 2,
      title: 'Pending Tasks',
      value: pendingTasks,
      trend: '↓ 5% from last week',
      icon: LayoutDashboard,
      colorClass: styles.cardOrange
    },
    {
      id: 3,
      title: 'Completed Tasks',
      value: completedTasks,
      trend: '↑ 18% from last week',
      icon: CheckCircle,
      colorClass: styles.cardGreen
    }
  ];

  return (
    <div className={styles.cardsGrid}>
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className={`${styles.card} ${card.colorClass}`}>
            <div className={styles.cardIcon}>
              <Icon size={28} />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>{card.title}</p>
              <h3 className={styles.cardValue}>
                {isLoading ? '...' : card.value}
              </h3>
              <p className={styles.cardTrend}>{card.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
