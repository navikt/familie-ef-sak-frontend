import { BodyShort, Heading, HStack, ReadMore, VStack } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import styles from './PersonopplysningPanel.module.css';

const PersonopplysningerPanel: React.FC<{
    Ikon: React.FC;
    tittel: string;
    tittelBeskrivelse?: { header: string; innhold: React.ReactElement };
    children?: ReactNode;
}> = ({ Ikon, tittel, children, tittelBeskrivelse }) => {
    return (
        <div className={styles.panel}>
            <HStack gap="4" align="center">
                <Ikon />
                <Heading size="small" className="tittel">
                    {tittel}
                </Heading>
                {!children && <BodyShort size="small">(Ingen data)</BodyShort>}
            </HStack>
            {tittelBeskrivelse && (
                <ReadMore
                    style={{ paddingLeft: '2.5rem' }}
                    size="small"
                    header={tittelBeskrivelse.header}
                >
                    {tittelBeskrivelse.innhold}
                </ReadMore>
            )}
            {children && (
                <VStack style={{ paddingLeft: '1.75rem' }} gap="4">
                    {children}
                </VStack>
            )}
        </div>
    );
};

export default PersonopplysningerPanel;
