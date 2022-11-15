import { FamilieDatovelger } from '@navikt/familie-form-elements';
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
import { Button, Select, Textarea } from '@navikt/ds-react';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { EnsligErrorMessage } from '../../../Felles/ErrorMessage/EnsligErrorMessage';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

export const EndreÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon,
    behandling,
    settRedigeringsmodus,
}) => {
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
            if (res.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(false);
            } else {
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
            <Select
                label={'Hvordan har vi fått opplysningene?'}
                value={opplysningskilde}
                onChange={(e) => settOpplysningskilde(e.target.value as Opplysningskilde)}
            >
                <option value="">Ikke valgt</option>
                {Object.values(Opplysningskilde).map((kilde) => (
                    <option key={kilde} value={kilde}>
                        {opplysningskildeTilTekst[kilde]}
                    </option>
                ))}
            </Select>
            <Select
                label={'Årsak til revurdering'}
                value={årsakRevurdering}
                onChange={(e) => {
                    settBeskrivelse(undefined);
                    settÅrsakRevurdering(e.target.value as Årsak);
                }}
            >
                <option value="">Ikke valgt</option>
                {Object.values(Årsak).map((årsak) => (
                    <option key={årsak} value={årsak}>
                        {årsakRevuderingTilTekst[årsak]}
                    </option>
                ))}
            </Select>
            {årsakRevurdering === Årsak.ANNET && (
                <Textarea
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
