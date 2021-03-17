import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { Input } from 'nav-frontend-skjema';
import DatoPeriode from '../../Oppgavebenk/DatoPeriode';
import { useHistory } from 'react-router';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { StyledTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { VilkårStatusIkon } from '../../Felleskomponenter/Visning/VilkårOppfylt';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FnrInput, Select, Textarea } from 'nav-frontend-skjema';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../utils/formatter';
import TabellVisning, { TabellIkon } from '../../Behandling/TabellVisning';
import { Søknadsgrunnlag } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ISøknadData } from '../../../typer/beregningssøknadsdata';

interface Props {
    behandlingId: string;
}

enum EVilkårsresultatType {
    INNVILGE = 'INNVILGE',
    ANNULLER = 'ANNULLER',
}

const Tittel = styled(Element)`
    margin-bottom: 0.5rem;
`;

const StyledSelect = styled(Select)`
    max-width: 200px;
`;

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const StyledInput = styled(Input)`
    max-width: 200px;
    margin-bottom: 1rem;
`;

const VedtakOgBeregning: FC<Props> = ({ behandlingId }) => {
    const history = useHistory();
    const [startDato, settStartDato] = useState('');
    const [sluttDato, settSluttDato] = useState('');
    const [startDatoStønad, settStartDatoStønad] = useState('');
    const [sluttDatoStønad, settSluttDatoStønad] = useState('');
    const [inntekt, settInntekt] = useState('');
    const [suksess, settSuksess] = useState<boolean>(false);
    const [feil, settFeil] = useState<string>('');
    const [søknadData, settSøknadData] = useState<any>({});
    const [vedtaksresultatType, settVedtaksresultatType] = useState<EVilkårsresultatType>(
        EVilkårsresultatType.INNVILGE
    );

    const [vedtaksperiodeBegrunnelse, settVedtaksperiodeBegrunnelse] = useState<string>('');
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>('');

    const { axiosRequest } = useApp();

    useEffect(() => {
        suksess && history.push(`/behandling/${behandlingId}/utbetalingsoversikt`);
    }, [suksess]);

    useEffect(() => {
        hentSøknadsMetaData();
    }, []);
    console.log(søknadData);

    const hentSøknadsMetaData = () => {
        axiosRequest<ISøknadData, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/hent-soknad`,
        }).then((respons: Ressurs<ISøknadData>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settSøknadData(respons.data);
                    return;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    settFeil(respons.frontendFeilmelding);
            }
        });
    };

    const beregn = (): any => {
        const data = {
            inntektsPerioder: [
                {
                    inntekt: inntekt,
                    startDato: startDato,
                    sluttDato: sluttDato,
                },
            ],
            stønadFom: startDatoStønad,
            stønadTom: sluttDatoStønad,
        };

        axiosRequest<any, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
            data,
        }).then((respons: Ressurs<string>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settSuksess(true);
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    settFeil(respons.frontendFeilmelding);
                    return respons;
                default:
                    return respons;
            }
        });
    };

    const vedtaksresultatSwitch = (vedtaksresultatType: EVilkårsresultatType) => {
        switch (vedtaksresultatType) {
            case EVilkårsresultatType.INNVILGE:
                return (
                    <>
                        <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                            Vedtaksperiode
                        </Element>
                        <Textarea
                            value={vedtaksperiodeBegrunnelse}
                            onChange={(e) => {
                                settVedtaksperiodeBegrunnelse(e.target.value);
                            }}
                            label="Begrunnelse"
                        />
                        <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                            Inntekt
                        </Element>
                        <Textarea
                            value={inntektBegrunnelse}
                            onChange={(e) => {
                                settInntektBegrunnelse(e.target.value);
                            }}
                            label="Begrunnelse"
                        />
                        <Hovedknapp style={{ marginTop: '2rem' }}>Lag blankett</Hovedknapp>
                    </>
                );
            case EVilkårsresultatType.ANNULLER:
                return <Hovedknapp>Fullfør annullering</Hovedknapp>;
        }
    };

    return (
        <>
            <StyledInntekt>
                <Element style={{ marginBottom: '0.5rem' }}>Søknadsinformasjon</Element>
                <StyledTabell style={{ marginBottom: '2rem' }}>
                    <Søknadsgrunnlag />
                    <Normaltekst>Søknadsdato</Normaltekst>
                    <Normaltekst>{formaterNullableIsoDato(søknadData.søknadsdato)}</Normaltekst>
                    <Søknadsgrunnlag />
                    <Normaltekst>Søker stønad fra</Normaltekst>
                    <Normaltekst>{formaterNullableMånedÅr(søknadData.søkerStønadFra)}</Normaltekst>
                </StyledTabell>
                <StyledSelect
                    label="Vedtak"
                    value={vedtaksresultatType}
                    onChange={(e) => {
                        settVedtaksresultatType(e.target.value as EVilkårsresultatType);
                    }}
                >
                    <option value={EVilkårsresultatType.INNVILGE}>Innvilge</option>
                    <option value={EVilkårsresultatType.ANNULLER}>ANNULLER</option>
                </StyledSelect>
                {vedtaksresultatSwitch(vedtaksresultatType)}
            </StyledInntekt>
        </>
    );
};

export default VedtakOgBeregning;
