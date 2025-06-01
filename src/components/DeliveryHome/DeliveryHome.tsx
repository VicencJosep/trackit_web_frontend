import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import styles from '../Home/Home.module.css';
import { User } from '../../types';
import PacketsToDeliverBox from '../PacketsToDeliverBox/PacketsToDeliverBox';

const Home: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User | undefined;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const Delivery = {
    id: user.id || 'unknown-id',
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.sectionsContainer}>
        <div className={styles.section}>
          <PacketsToDeliverBox user={Delivery} />
        </div>
      </div>
    </div>
  );
};

export default Home;