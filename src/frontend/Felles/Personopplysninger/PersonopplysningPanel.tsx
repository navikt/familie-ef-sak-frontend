import { BodyShort, Heading, ReadMore } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
    background-color: ${AGray50};
    padding: 1rem;
`;

const TittelMedIkon = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const IkonWrapper = styled.div`
    width: 24px;
    height: 24px;
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
        <Panel>
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
        </Panel>
    );
};

export default PersonopplysningerPanel;
