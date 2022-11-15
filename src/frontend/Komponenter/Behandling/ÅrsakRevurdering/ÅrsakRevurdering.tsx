import { FamilieDatovelger, FamilieSelect, FamilieTextarea } from '@navikt/familie-form-elements';
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
import { Button } from '@navikt/ds-react';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { EnsligErrorMessage } from '../../../Felles/ErrorMessage/EnsligErrorMessage';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
}

export const ÅrsakRevurdering: React.FC<Props> = ({ revurderingsinformasjon, behandling }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const [kravMottatt, settKravMotatt] = useState<string | undefined>(
        revurderingsinformasjon.kravMottatt
    );
    const [opplysningskilde, settOpplysningskilde] = useState<Opplysningskilde | undefined>(
        revurderingsinformasjon.årsakRevurdering?.opplysningskilde
    );
    const [årsakRevurdering, settÅrsakRevurdering] = useState<Årsak | undefined>(
        revurderingsinformasjon.årsakRevurdering?.årsak
    );
    const [beskrivelse, settBeskrivelse] = useState<string | undefined>(
        revurderingsinformasjon.årsakRevurdering?.beskrivelse
    );

    const [feilmelding, settFeilmelding] = useState<string>();

    const lagreRevurderingsinformasjon = () => {
        if (!kravMottatt) {
            settFeilmelding('Mangler krav mottatt');
            return;
        }
        if (!opplysningskilde) {
            settFeilmelding('Mangler opplysningskilde');
            return;
        }

        if (!årsakRevurdering) {
            settFeilmelding('Mangler årsak');
            return;
        }
        axiosRequest<string, Revurderingsinformasjon>({
            method: 'POST',
            url: `familie-ef-sak/api/revurdering/informasjon/${behandling.id}`,
            data: {
                kravMottatt,
                årsakRevurdering: {
                    årsak: årsakRevurdering,
                    opplysningskilde,
                    beskrivelse,
                },
            },
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status !== RessursStatus.SUKSESS) {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    return (
        <>
            <FamilieDatovelger
                erLesesvisning={!behandlingErRedigerbar}
                label={'Krav mottatt'}
                id={'krav-mottatt'}
                valgtDato={kravMottatt || ''}
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
                <option value="">Ikke valgt</option>
                {Object.values(Opplysningskilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {opplysningskildeTilTekst[kilde]}
                    </option>
                ))}
            </FamilieSelect>
            <FamilieSelect
                label={'Årsak til revurdering'}
                value={årsakRevurdering}
                onChange={(e) => {
                    settBeskrivelse(undefined);
                    settÅrsakRevurdering(e.target.value as Årsak);
                }}
                erLesevisning={!behandlingErRedigerbar}
            >
                <option value="">Ikke valgt</option>
                {Object.values(Årsak).map((årsak) => (
                    <option key={årsak} value={årsak}>
                        {årsakRevuderingTilTekst[årsak]}
                    </option>
                ))}
            </FamilieSelect>
            {årsakRevurdering === Årsak.ANNET && (
                <FamilieTextarea
                    erLesevisning={!behandlingErRedigerbar}
                    label={'Beskrivelse av årsak'}
                    value={beskrivelse}
                    onChange={(e) => settBeskrivelse(e.target.value)}
                />
            )}
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
            <Button variant={'primary'} onClick={lagreRevurderingsinformasjon}>
                Lagre
            </Button>
        </>
    );
};
