import React, { useState } from 'react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ITilbakekrevingsvalg, TilbakekrevingsvalgTilTekst } from './Tilbakekreving';
import IkonKnapp from '../../../Felles/Knapper/IkonKnapp';
import Søknad from '../../../Felles/Ikoner/Søknad';
import { useApp } from '../../../App/context/AppContext';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

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
    kanForhåndsvise: boolean;
    behandlingId: string;
}

export const VisTilbakekreving: React.FC<Props> = ({
    tilbakekrevingsvalg,
    varseltekst,
    begrunnelse,
    kanForhåndsvise,
    behandlingId,
}) => {
    const { axiosRequest } = useApp();

    const [forhåndsvisningsFeil, settForhåndsvisningsFeil] = useState<string>();

    const visBrevINyFane = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `familie-ef-sak/api/tilbakekreving/${behandlingId}/brev`,
        }).then((respons: Ressurs<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(
                    base64toBlob(respons.data, 'application/pdf'),
                    'Forhåndsvisning av varselbrev'
                );
            } else if (
                respons.status === RessursStatus.IKKE_TILGANG ||
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settForhåndsvisningsFeil(respons.frontendFeilmelding);
            }
        });
    };

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
                    {kanForhåndsvise && (
                        <IkonKnapp
                            erLesevisning={false}
                            ikon={<Søknad />}
                            label={'Forhåndsvis varselbrev'}
                            kompakt={true}
                            mini={true}
                            onClick={visBrevINyFane}
                        />
                    )}
                    {forhåndsvisningsFeil && (
                        <AlertStripeFeil>{forhåndsvisningsFeil}</AlertStripeFeil>
                    )}
                </>
            )}
            <UnderOverskrfit>Begrunnelse (internt notat):</UnderOverskrfit>
            <Normaltekst>{begrunnelse ? begrunnelse : 'Ingen begrunnelse'}</Normaltekst>
        </VisningsContainer>
    );
};
