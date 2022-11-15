import React from 'react';
import styled from 'styled-components';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTidKort } from '../../../App/utils/formatter';
import { Hendelse, HendelseIkon, hendelseTilHistorikkTekst } from './Historikk';
import { HistorikkElementProps, LinjeProps, StyledHistorikkElementProps } from './typer';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { ExternalLink } from '@navikt/ds-icons';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { BreakWordUndertekst } from '../../../Felles/Visningskomponenter/BreakWordUndertekst';
import { Button } from '@navikt/ds-react';

const IkonMedStipletLinje = styled.div`
    margin-right: 1rem;
`;

const Linje = styled.div`
    margin-right: 13px;
    border-right: 1px dashed #a0a0a0;

    min-height: ${(props: LinjeProps) =>
        props.siste ? '30px' : props.størreMellomrom ? '75px' : '60px'};
    height: ${(props: LinjeProps) => (props.siste ? '30px' : '100%')};
`;

const Innhold = styled.div``;

const StyledHistorikkElement = styled.li`
    display: flex;

    list-style: none;

    padding: ${(props: StyledHistorikkElementProps) =>
        props.første ? '0.75rem 2rem 0' : '0 2rem'};

    .typo-normal,
    .typo-element {
        color: ${navFarger.navMorkGra};
    }

    .typo-undertekst {
        color: ${navFarger.navMorkGra};
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
        }).then((respons: Ressurs<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(base64toBlob(respons.data, 'application/pdf'), 'Vedtaksbrev');
            } else if (
                respons.status === RessursStatus.IKKE_TILGANG ||
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                console.error(respons.frontendFeilmelding);
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
        <StyledHistorikkElement første={første}>
            <IkonMedStipletLinje>
                <HendelseIkon behandlingshistorikk={behandlingshistorikk} />
                <Linje siste={siste} størreMellomrom={harMetadata} />
            </IkonMedStipletLinje>
            <Innhold>
                <Element>{hendelseTilHistorikkTekst[behandlingshistorikk.hendelse]}</Element>
                <Undertekst>
                    {formaterIsoDatoTidKort(behandlingshistorikk.endretTid)} |{' '}
                    {behandlingshistorikk.endretAvNavn}
                </Undertekst>
                {behandlingshistorikk.metadata?.begrunnelse && skalViseBegrunnelse && (
                    <BreakWordUndertekst>
                        Begrunnelse: {behandlingshistorikk.metadata?.begrunnelse}
                    </BreakWordUndertekst>
                )}
                {behandlingshistorikk.metadata?.årsak && (
                    <Undertekst>Årsak: {behandlingshistorikk.metadata?.årsak}</Undertekst>
                )}
                {vedtakIverksatt && harVedtaksbrev && (
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={hentOgÅpneVedtaksbrev}
                        icon={<ExternalLink />}
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
