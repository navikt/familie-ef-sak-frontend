import React from 'react';
import styles from './Sticky.module.css';

export const Sticky: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
    children,
    style,
}) => {
    return (
        <div className={styles.sticky} style={style}>
            {children}
        </div>
    );
};
