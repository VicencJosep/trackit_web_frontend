import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1>Welcome to the Package Management System</h1>
            <h2>Your Active Packages</h2>
            <p>Here you can manage and track your packages.</p>
        </div>
    );
};

export default Dashboard;