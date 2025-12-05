import React, { FC } from 'react';
import { AGray900 } from '@navikt/ds-tokens/dist/tokens';
import styles from './Divider.module.css';

interface Props {
    farge?: string;
}

export const VannrettDivider: FC<Props> = ({ farge = `${AGray900}` }) => {
    return <div className={styles.vannrettDivider} style={{ borderBottomColor: farge }} />;
};

export const LoddrettDivider: FC<Props> = ({ farge = `${AGray900}` }) => {
    return <div className={styles.loddrettDivider} style={{ borderLeftColor: farge }} />;
};
