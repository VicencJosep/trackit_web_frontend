import React from 'react';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
    

    return (
        <div className={styles.homeContainer}>
            <h1>Bienvenido a mi aplicación</h1>
            <p>Esta es la página de inicio.</p>
        </div>
    );
}
export default Home;