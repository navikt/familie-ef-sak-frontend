import { FamilieDatovelger, FamilieSelect } from '@navikt/familie-form-elements';
import {
    Opplysningskilde,
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    Årsak,
    årsakRevuderingTilTekst,
} from './typer';
import React, { useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
}

export const ÅrsakRevurdering: React.FC<Props> = ({ revurderingsinformasjon }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const [kravMottat, settKravMotatt] = useState<string>(revurderingsinformasjon.kravMottatt);
    const [opplysningskilde, settOpplysningskilde] = useState<Opplysningskilde>(
        revurderingsinformasjon.årsakRevurdering.opplysningskilde
    );
    const [årsakRevurdering, settÅrsakRevurdering] = useState<Årsak>(
        revurderingsinformasjon.årsakRevurdering.årsak
    );

    return (
        <>
            <FamilieDatovelger
                erLesesvisning={!behandlingErRedigerbar}
                label={'Krav mottatt'}
                id={'krav-mottatt'}
                valgtDato={kravMottat}
                onChange={(dato) => {
                    settKravMotatt(dato as string);
                }}
            />
            <FamilieSelect
                label={'Hvordan har vi fått opplysningene?'}
                value={opplysningskilde}
                onChange={(e) => settOpplysningskilde(e.target.value as Opplysningskilde)}
                erLesevisning={!behandlingErRedigerbar}
            >
                {Object.values(Opplysningskilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {opplysningskildeTilTekst[kilde]}
                    </option>
                ))}
            </FamilieSelect>
            <FamilieSelect
                label={'Årsak til revurdering'}
                value={årsakRevurdering}
                onChange={(e) => settÅrsakRevurdering(e.target.value as Årsak)}
                erLesevisning={!behandlingErRedigerbar}
            >
                {Object.values(Årsak).map((årsak) => (
                    <option key={årsak} value={årsak}>
                        {årsakRevuderingTilTekst[årsak]}
                    </option>
                ))}
            </FamilieSelect>
        </>
    );
};
