import { FamilieDatovelger } from '@navikt/familie-form-elements';
import {
    IÅrsakRevurdering,
    Opplysningskilde,
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    Årsak,
    årsakerForStønadstype,
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
import { erGyldigDato } from '../../../App/utils/dato';

const Container = styled.div`
    > * {
        margin-bottom: 1rem;
    }
`;

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
    oppdaterRevurderingsinformasjon: (revurderingsinformasjon: Revurderingsinformasjon) => void;
}

const ENDRE_ÅRSAK_REVURDERING = 'endre-årsak-revurdering';

export const EndreÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon: initStateRevurderingsinformasjon,
    behandling,
    oppdaterRevurderingsinformasjon,
}) => {
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { behandlingErRedigerbar, hentAnsvarligSaksbehandler, hentBehandling } = useBehandling();

    const [revurderingsinformasjon, settRevurderingsinformasjon] =
        useState<Revurderingsinformasjon>(initStateRevurderingsinformasjon);

    const { kravMottatt, årsakRevurdering } = revurderingsinformasjon;
    const { opplysningskilde, årsak, beskrivelse } = årsakRevurdering || {};

    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState(false);

    const lagreRevurderingsinformasjon = () => {
        if (laster) {
            return;
        }
        if (!kravMottatt || !erGyldigDato(kravMottatt)) {
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
        settLaster(true);
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
        })
            .then((res: RessursSuksess<Revurderingsinformasjon> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    oppdaterRevurderingsinformasjon(res.data);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                    hentAnsvarligSaksbehandler.rerun();
                }
            })
            .finally(() => {
                nullstillIkkePersisterteKomponenter();
                settLaster(false);
            });
    };

    const oppdaterÅrsakRevurdering = (nyeVerdier: Partial<IÅrsakRevurdering>) => {
        settIkkePersistertKomponent(ENDRE_ÅRSAK_REVURDERING);
        settRevurderingsinformasjon((prevState) => ({
            ...prevState,
            årsakRevurdering: {
                ...(prevState.årsakRevurdering || {}),
                ...nyeVerdier,
            },
        }));
    };

    const labelBeskrivelse = `Beskrivelse av årsak${
        årsakRevurdering?.årsak === Årsak.ANNET ? '' : ' (Fylles ut ved behov)'
    }`;
    return (
        <Container>
            <FamilieDatovelger
                erLesesvisning={!behandlingErRedigerbar}
                label={'Krav mottatt'}
                id={'krav-mottatt'}
                value={kravMottatt || ''}
                onChange={(dato) => {
                    settRevurderingsinformasjon((prevState) => ({
                        ...prevState,
                        kravMottatt: dato as string,
                    }));
                }}
                feil={kravMottatt && !erGyldigDato(kravMottatt) ? 'Ugyldig dato' : undefined}
                limitations={{ maxDate: new Date().toISOString() }}
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
                    })
                }
            >
                <option value="">Ikke valgt</option>
                {Object.values(årsakerForStønadstype(behandling.stønadstype)).map((årsak) => (
                    <option key={årsak} value={årsak}>
                        {årsakRevuderingTilTekst[årsak]}
                    </option>
                ))}
            </Select>
            <Textarea
                label={labelBeskrivelse}
                value={beskrivelse}
                onChange={(e) =>
                    oppdaterÅrsakRevurdering({
                        beskrivelse: e.target.value,
                    })
                }
            />
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
            <Button variant={'primary'} onClick={lagreRevurderingsinformasjon} disabled={laster}>
                Lagre
            </Button>
        </Container>
    );
};
