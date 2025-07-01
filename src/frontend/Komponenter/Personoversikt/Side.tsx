import React, { FC } from 'react';
import styles from './Side.module.css';

export const Side: FC<{
    children?: React.ReactNode;
    skalHaBakgrunnsfarge?: boolean;
}> = ({ children, skalHaBakgrunnsfarge }) => {
    return (
        <div
            className={
                styles.sideContainer + (skalHaBakgrunnsfarge ? ` ${styles.bakgrunnsfarge}` : '')
            }
        >
            {children}
        </div>
    );
};
