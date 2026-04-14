import React, { FC } from 'react';
import styles from './Divider.module.css';
import { Neutral1000 } from "@navikt/ds-tokens/js";

interface Props {
    farge?: string;
}

export const VannrettDivider: FC<Props> = ({ farge = `${Neutral1000}` }) => {
    return <div className={styles.vannrettDivider} style={{ borderBottomColor: farge }} />;
};

export const LoddrettDivider: FC<Props> = ({ farge = `${Neutral1000}` }) => {
    return <div className={styles.loddrettDivider} style={{ borderLeftColor: farge }} />;
};
