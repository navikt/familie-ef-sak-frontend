import { FamilieDatovelger } from '@navikt/familie-form-elements';
import {
    IÅrsakRevurdering,
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
import styled from 'styled-components';

const StyledEndreÅrsakRevurdering = styled.div`
    > * {
        margin-bottom: 1rem;
    }
`;

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
    oppdaterRevurderingsinformasjon: (revurderingsinformasjon: Revurderingsinformasjon) => void;
}

export const EndreÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon: initStateRevurderingsinformasjon,
    behandling,
    oppdaterRevurderingsinformasjon,
}) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [revurderingsinformasjon, settRevurderingsinformasjon] =
        useState<Revurderingsinformasjon>(initStateRevurderingsinformasjon);

    const { kravMottatt, årsakRevurdering } = revurderingsinformasjon;
    const { opplysningskilde, årsak, beskrivelse } = årsakRevurdering || {};

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
        axiosRequest<Revurderingsinformasjon, Revurderingsinformasjon>({
            method: 'POST',
            url: `familie-ef-sak/api/revurdering/informasjon/${behandling.id}`,
            data: {
                kravMottatt,
                årsakRevurdering: {
                    opplysningskilde,
                    årsak,
                    beskrivelse,
                },
            },
        }).then((res: RessursSuksess<Revurderingsinformasjon> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                oppdaterRevurderingsinformasjon(res.data);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const oppdaterÅrsakRevurdering = (nyeVerdier: Partial<IÅrsakRevurdering>) =>
        settRevurderingsinformasjon((prevState) => ({
            ...prevState,
            årsakRevurdering: {
                ...(prevState.årsakRevurdering || {}),
                ...nyeVerdier,
            },
        }));

    return (
        <StyledEndreÅrsakRevurdering>
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
        </StyledEndreÅrsakRevurdering>
    );
};
