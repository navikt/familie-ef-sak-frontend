import React, { useState } from 'react';
import styled from 'styled-components';
import { ITilbakekrevingsvalg, TilbakekrevingsvalgTilTekst } from './Tilbakekreving';
import { useApp } from '../../../App/context/AppContext';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { FileContent } from '@navikt/ds-icons';
import { Button, Heading } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';

const VisningsContainer = styled.div`
    margin-top: 1rem;
`;

const UnderOverskrfit = styled(SmallTextLabel)`
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
            <Heading size={'medium'} as={'h2'}>
                Tilbakekreving
            </Heading>
            <UnderOverskrfit>Valg for tilbakekreving:</UnderOverskrfit>
            <BodyShortSmall>
                {TilbakekrevingsvalgTilTekst[tilbakekrevingsvalg as ITilbakekrevingsvalg]}
            </BodyShortSmall>
            {varseltekst && (
                <>
                    <UnderOverskrfit>Fritekst i varselet</UnderOverskrfit>
                    <BodyShortSmall>{varseltekst}</BodyShortSmall>
                    {kanForhåndsvise && (
                        <Button
                            type={'button'}
                            variant={'tertiary'}
                            icon={<FileContent />}
                            size={'xsmall'}
                            onClick={visBrevINyFane}
                        >
                            Forhåndsvis varselbrev
                        </Button>
                    )}
                    {forhåndsvisningsFeil && <AlertError>{forhåndsvisningsFeil}</AlertError>}
                </>
            )}
            <UnderOverskrfit>Begrunnelse (internt notat):</UnderOverskrfit>
            <BodyShortSmall>{begrunnelse ? begrunnelse : 'Ingen begrunnelse'}</BodyShortSmall>
        </VisningsContainer>
    );
};
