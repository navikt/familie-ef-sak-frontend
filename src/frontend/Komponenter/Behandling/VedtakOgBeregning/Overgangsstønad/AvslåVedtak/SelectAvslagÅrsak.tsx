import {
    avslagÅrsakTilTekst,
    EAvslagÅrsak,
    årsakerTilAvslag,
} from '../../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';
import {
    BodyShortSmall,
    LabelSmallAsText,
} from '../../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    avslagÅrsak?: EAvslagÅrsak;
    settAvslagÅrsak: (val: EAvslagÅrsak) => void;
    feilmelding: string;
}

const StyledSelect = styled(EnsligFamilieSelect)`
    max-width: 200px;
    .skjemaelement__label {
        font-size: 1.25rem;
        line-height: 1.5625rem;
    }
    margin-top: 0.6rem;
    margin-bottom: 1rem;
`;

const FeilmeldingTekst = styled(BodyShortSmall)`
    margin-top: 0;
    margin-bottom: 2rem;
    font-weight: 600;
    color: #ba3a26;
`;

const SelectAvslagÅrsak = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { toggles } = useToggles();
    const { avslagÅrsak, settAvslagÅrsak, feilmelding } = props;

    const avslagÅrsaker = toggles[ToggleName.avslagMindreInntektsendringer]
        ? årsakerTilAvslag
        : [
              EAvslagÅrsak.BARN_OVER_ÅTTE_ÅR,
              EAvslagÅrsak.MANGLENDE_OPPLYSNINGER,
              EAvslagÅrsak.STØNADSTID_OPPBRUKT,
          ];
    return (
        <>
            <LabelSmallAsText>Årsak</LabelSmallAsText>
            <StyledSelect
                value={avslagÅrsak}
                erLesevisning={!behandlingErRedigerbar}
                onChange={(e) => {
                    settAvslagÅrsak(e.target.value as EAvslagÅrsak);
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={avslagÅrsak && avslagÅrsakTilTekst[avslagÅrsak]}
                label={'Årsak avslag'}
                hideLabel={true}
            >
                <option value="">Velg</option>
                {avslagÅrsaker.map((årsak) => {
                    return (
                        <option value={årsak} key={årsak}>
                            {avslagÅrsakTilTekst[årsak]}
                        </option>
                    );
                })}
            </StyledSelect>
            {feilmelding && <FeilmeldingTekst>{feilmelding}</FeilmeldingTekst>}
        </>
    );
};

export default SelectAvslagÅrsak;
