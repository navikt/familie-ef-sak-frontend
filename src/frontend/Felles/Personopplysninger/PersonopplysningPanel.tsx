import { Heading, ReadMore } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
    background-color: ${AGray50};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TittelMedIkon = styled.div`
    display: flex;
    gap: 1rem;
`;

const InnholdWrapper = styled.div`
    padding-left: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Tittel = styled.div`
    grid-area: tittel;
`;

const PersonopplysningerPanel: React.FC<{
    Ikon: React.FC;
    tittel: string;
    tittelBeskrivelse?: { header: string; innhold: React.ReactElement };
    children: ReactNode;
}> = ({ Ikon, tittel, children, tittelBeskrivelse }) => {
    return (
        <Panel>
            <TittelMedIkon className="ikon">
                <Ikon />
                <Tittel>
                    <Heading size="small" className="tittel">
                        {tittel}
                    </Heading>
                    {tittelBeskrivelse && (
                        <ReadMore size="small" header={tittelBeskrivelse.header}>
                            {tittelBeskrivelse.innhold}
                        </ReadMore>
                    )}
                </Tittel>
            </TittelMedIkon>
            <InnholdWrapper>{children}</InnholdWrapper>
        </Panel>
    );
};

export default PersonopplysningerPanel;
