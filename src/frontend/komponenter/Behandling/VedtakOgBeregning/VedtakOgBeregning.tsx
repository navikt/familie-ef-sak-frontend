import React, { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Ressurs } from '../../../typer/ressurs';
import { StyledTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Select, Textarea } from 'nav-frontend-skjema';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../utils/formatter';
import { Søknadsgrunnlag } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ISøknadData } from '../../../typer/beregningssøknadsdata';
import { useDataHenter } from '../../../hooks/felles/useDataHenter';

interface Props {
    behandlingId: string;
}

enum EVilkårsresultatType {
    INNVILGE = 'INNVILGE',
    AVSLÅ = 'AVSLÅ',
    HENLEGGE = 'HENLEGGE',
    ANNULLERE = 'ANNULLERE',
}

const StyledSelect = styled(Select)`
    max-width: 200px;
`;

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const VedtakOgBeregning: FC<Props> = ({ behandlingId }) => {
    const [vedtaksresultatType, settVedtaksresultatType] = useState<EVilkårsresultatType>();

    const [vedtaksperiodeBegrunnelse, settVedtaksperiodeBegrunnelse] = useState<string>('');
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>('');

    const søknadDataConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/hent-soknad`,
        }),
        [behandlingId]
    );

    const søknadDataResponse: Ressurs<ISøknadData> = useDataHenter<ISøknadData, null>(
        søknadDataConfig
    );

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
            case EVilkårsresultatType.ANNULLERE:
                return <Hovedknapp style={{ marginTop: '2rem' }}>Fullfør annullering</Hovedknapp>;
        }
    };

    return (
        <DataViewer response={{ søknadDataResponse }}>
            {({ søknadDataResponse }) => {
                return (
                    <StyledInntekt>
                        <Element style={{ marginBottom: '0.5rem' }}>Søknadsinformasjon</Element>
                        <StyledTabell style={{ marginBottom: '2rem' }}>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søknadsdato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                            </Normaltekst>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søker stønad fra</Normaltekst>
                            <Normaltekst>
                                {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra)}
                            </Normaltekst>
                        </StyledTabell>
                        <StyledSelect
                            label="Vedtak"
                            value={vedtaksresultatType}
                            onChange={(e) => {
                                settVedtaksresultatType(e.target.value as EVilkårsresultatType);
                            }}
                        >
                            <option value="">Velg</option>
                            <option value={EVilkårsresultatType.INNVILGE}>Innvilge</option>
                            <option value={EVilkårsresultatType.AVSLÅ} disabled>
                                Avslå
                            </option>
                            <option value={EVilkårsresultatType.HENLEGGE} disabled>
                                Henlegge
                            </option>
                            <option value={EVilkårsresultatType.ANNULLERE}>ANNULLER</option>
                        </StyledSelect>
                        {vedtaksresultatType && vedtaksresultatSwitch(vedtaksresultatType)}
                    </StyledInntekt>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
