import React from 'react';
import styled from 'styled-components';
import { formaterIsoDatoTidKort } from '../../../App/utils/formatter';
import { Hendelse, HendelseIkon, hendelseTilHistorikkTekst } from './Historikk';
import { HistorikkElementProps, LinjeProps, StyledHistorikkElementProps } from './typer';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { base64toBlob, winUrl, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { BreakWordUndertekst } from '../../../Felles/Visningskomponenter/BreakWordUndertekst';
import { Button } from '@navikt/ds-react';
import { DetailSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { AGray900 } from '@navikt/ds-tokens/dist/tokens';

const IkonMedStipletLinje = styled.div`
    margin-right: 1rem;
`;

const Linje = styled.div<LinjeProps>`
    margin-right: 13px;
    border-right: 1px dashed #a0a0a0;

    min-height: ${(props) => (props.$siste ? '30px' : props.$størreMellomrom ? '75px' : '60px')};
    height: ${(props) => (props.$siste ? '30px' : '100%')};
`;

const Innhold = styled.div``;

const StyledHistorikkElement = styled.li<StyledHistorikkElementProps>`
    display: flex;

    list-style: none;

    padding: ${(props) => (props.$første ? '0.75rem 2rem 0' : '0 2rem')};

    .navds-body-short,
    .navds-label,
    .navds-detail {
        color: ${AGray900};
    }
`;

const HistorikkElement: React.FC<HistorikkElementProps> = ({
    behandlingshistorikk,
    første,
    siste,
    behandlingId,
    behandling,
    skalViseBegrunnelse,
}) => {
    const { axiosRequest } = useApp();

    const hentOgÅpneVedtaksbrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(base64toBlob(respons.data, 'application/pdf'), 'Vedtaksbrev');
            } else {
                window.open(winUrl(respons.frontendFeilmelding), '_blank');
            }
        });
    };

    const vedtakIverksatt = behandlingshistorikk.hendelse === Hendelse.VEDTAK_IVERKSATT;

    const harVedtaksbrev =
        [Behandlingstype.FØRSTEGANGSBEHANDLING, Behandlingstype.REVURDERING].includes(
            behandling.type
        ) &&
        [
            BehandlingResultat.OPPHØRT,
            BehandlingResultat.INNVILGET,
            BehandlingResultat.AVSLÅTT,
        ].includes(behandling.resultat) &&
        [
            Behandlingsårsak.SØKNAD,
            Behandlingsårsak.NYE_OPPLYSNINGER,
            Behandlingsårsak.KLAGE,
            Behandlingsårsak.SANKSJON_1_MND,
        ].includes(behandling.behandlingsårsak);

    const harMetadata =
        behandlingshistorikk.metadata?.årsak ||
        behandlingshistorikk.metadata?.begrunnelse ||
        vedtakIverksatt;

    return (
        <StyledHistorikkElement $første={første}>
            <IkonMedStipletLinje>
                <HendelseIkon behandlingshistorikk={behandlingshistorikk} />
                <Linje $siste={siste} $størreMellomrom={harMetadata} />
            </IkonMedStipletLinje>
            <Innhold>
                <SmallTextLabel>
                    {hendelseTilHistorikkTekst[behandlingshistorikk.hendelse]}
                </SmallTextLabel>
                <DetailSmall>
                    {formaterIsoDatoTidKort(behandlingshistorikk.endretTid)} |{' '}
                    {behandlingshistorikk.endretAvNavn}
                </DetailSmall>
                {behandlingshistorikk.metadata?.begrunnelse && skalViseBegrunnelse && (
                    <BreakWordUndertekst>
                        Begrunnelse: {behandlingshistorikk.metadata?.begrunnelse}
                    </BreakWordUndertekst>
                )}
                {behandlingshistorikk.metadata?.årsak && (
                    <DetailSmall>Årsak: {behandlingshistorikk.metadata?.årsak}</DetailSmall>
                )}
                {vedtakIverksatt && harVedtaksbrev && (
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={hentOgÅpneVedtaksbrev}
                        icon={<ExternalLinkIcon />}
                        iconPosition={'right'}
                        size={'xsmall'}
                    >
                        Vedtaksbrev
                    </Button>
                )}
            </Innhold>
        </StyledHistorikkElement>
    );
};

export default HistorikkElement;
