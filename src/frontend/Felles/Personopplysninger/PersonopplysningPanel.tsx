import { Heading, ReadMore } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
    display: grid;
    grid-template-columns: 32px max-content;
    grid-template-rows: auto;
    grid-template-areas: 'ikon tittel' '. innhold';
    background-color: ${AGray50};
    padding: 1rem;
    gap: 0.5rem;

    .ikon {
        grid-area: ikon;
        display: flex;
        justify-content: center;
    }

    .innhold {
        grid-area: innhold;
        margin-left: -12px;
    }
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
            <div className="ikon">
                <Ikon />
            </div>
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
            {children}
        </Panel>
    );
};

export default PersonopplysningerPanel;
