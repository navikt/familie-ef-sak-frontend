import React, { FC } from 'react';
import styles from './Side.module.css';

export const Side: FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    return <div className={styles.sideContainer}>{children}</div>;
};
