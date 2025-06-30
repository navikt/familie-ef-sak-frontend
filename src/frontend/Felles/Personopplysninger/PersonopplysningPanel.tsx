import { BodyShort, Heading, ReadMore } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import styles from './PersonopplysningPanel.module.css';

const TittelMedIkon = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const IkonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const InnholdWrapper = styled.div`
    padding-left: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ReadMoreMedMarginLeft = styled(ReadMore)`
    padding-left: 2.5rem;
`;

const PersonopplysningerPanel: React.FC<{
    Ikon: React.FC;
    tittel: string;
    tittelBeskrivelse?: { header: string; innhold: React.ReactElement };
    children?: ReactNode;
}> = ({ Ikon, tittel, children, tittelBeskrivelse }) => {
    return (
        <div className={styles.panel}>
            <TittelMedIkon className="ikon">
                <IkonWrapper>
                    <Ikon />
                </IkonWrapper>
                <Heading size="small" className="tittel">
                    {tittel}
                </Heading>
                {!children && <BodyShort size="small">(Ingen data)</BodyShort>}
            </TittelMedIkon>
            {tittelBeskrivelse && (
                <ReadMoreMedMarginLeft size="small" header={tittelBeskrivelse.header}>
                    {tittelBeskrivelse.innhold}
                </ReadMoreMedMarginLeft>
            )}
            {children && <InnholdWrapper>{children}</InnholdWrapper>}
        </div>
    );
};

export default PersonopplysningerPanel;
