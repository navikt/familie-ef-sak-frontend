import React from 'react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ITilbakekrevingsvalg, TilbakekrevingsvalgTilTekst } from './Tilbakekreving';

const VisningsContainer = styled.div`
    margin-top: 1rem;
`;

const UnderOverskrfit = styled(Element)`
    margin-top: 1rem;
`;

interface Props {
    tilbakekrevingsvalg: ITilbakekrevingsvalg;
    varseltekst: string;
    begrunnelse: string;
}

export const VisTilbakekreving: React.FC<Props> = ({
    tilbakekrevingsvalg,
    varseltekst,
    begrunnelse,
}) => {
    return (
        <VisningsContainer>
            <h2>Tilbakekreving</h2>
            <UnderOverskrfit>Valg for tilbakekreving:</UnderOverskrfit>
            <Normaltekst>
                {TilbakekrevingsvalgTilTekst[tilbakekrevingsvalg as ITilbakekrevingsvalg]}
            </Normaltekst>
            {varseltekst && (
                <>
                    <UnderOverskrfit>Fritekst i varselet</UnderOverskrfit>
                    <Normaltekst>{varseltekst}</Normaltekst>
                </>
            )}
            <UnderOverskrfit>Begrunnelse (internt notat):</UnderOverskrfit>
            <Normaltekst>{begrunnelse ? begrunnelse : 'Ingen begrunnelse'}</Normaltekst>
        </VisningsContainer>
    );
};
