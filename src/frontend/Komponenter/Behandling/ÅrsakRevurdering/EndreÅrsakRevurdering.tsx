import { FamilieDatovelger } from '@navikt/familie-form-elements';
import {
    IÅrsakRevurdering,
    Opplysningskilde,
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    Årsak,
    årsakRevuderingTilTekst,
} from './typer';
import React, { Dispatch, useState } from 'react';
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
    settRevurderingsinformasjon: Dispatch<React.SetStateAction<Revurderingsinformasjon>>;
}

export const EndreÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon,
    behandling,
    settRedigeringsmodus,
    settRevurderingsinformasjon,
}) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const { kravMottatt, årsakRevurdering } = revurderingsinformasjon;
    const opplysningskilde = årsakRevurdering?.opplysningskilde;
    const årsak = årsakRevurdering?.årsak;
    const beskrivelse = årsakRevurdering?.beskrivelse;

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
        if (!årsak) {
            settFeilmelding('Mangler årsak');
            return;
        }
        axiosRequest<string, Revurderingsinformasjon>({
            method: 'POST',
            url: `familie-ef-sak/api/revurdering/informasjon/${behandling.id}`,
            data: revurderingsinformasjon,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(false);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const oppdaterÅrsakRevurdering = (nyeVerdier: Partial<IÅrsakRevurdering>) => {
        settRevurderingsinformasjon((prevState) => ({
            ...prevState,
            årsakRevurdering: {
                ...(prevState.årsakRevurdering || {}),
                ...nyeVerdier,
            },
        }));
    };

    return (
        <>
            <FamilieDatovelger
                erLesesvisning={!behandlingErRedigerbar}
                label={'Krav mottatt'}
                id={'krav-mottatt'}
                valgtDato={kravMottatt || ''}
                onChange={(dato) => {
                    settRevurderingsinformasjon((prevState) => ({
                        ...prevState,
                        kravMottatt: dato as string,
                    }));
                }}
            />
            <Select
                label={'Hvordan har vi fått opplysningene?'}
                value={opplysningskilde}
                onChange={(e) =>
                    oppdaterÅrsakRevurdering({
                        opplysningskilde: e.target.value as Opplysningskilde,
                    })
                }
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
                value={årsak}
                onChange={(e) =>
                    oppdaterÅrsakRevurdering({
                        årsak: e.target.value as Årsak,
                        beskrivelse: undefined,
                    })
                }
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
                    onChange={(e) =>
                        oppdaterÅrsakRevurdering({
                            beskrivelse: e.target.value,
                        })
                    }
                />
            )}
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
            <Button variant={'primary'} onClick={lagreRevurderingsinformasjon}>
                Lagre
            </Button>
        </>
    );
};
