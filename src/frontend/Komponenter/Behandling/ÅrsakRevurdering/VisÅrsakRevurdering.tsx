import {
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    årsakRevuderingTilTekst,
} from './typer';
import React, { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Alert, BodyShort, Button, Detail, Heading, Label } from '@navikt/ds-react';
import {
    formaterIsoDatoTidMedSekunder,
    formaterNullableIsoDato,
} from '../../../App/utils/formatter';
import { TrashIcon, PencilIcon } from '@navikt/aksel-icons';
import {
    SistOppdatertOgVurderingWrapper,
    VertikalStrek,
    VurderingLesemodusGrid,
    TittelOgKnappWrapper,
} from '../Vurdering/StyledVurdering';
import { useApp } from '../../../App/context/AppContext';
import { Behandling } from '../../../App/typer/fagsak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { ModalState } from '../Modal/NyEierModal';
import { erBehandlingUnderArbeid } from '../../../App/typer/behandlingstatus';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
    behandling: Behandling;
    oppdaterRevurderingsinformasjon: (revurderingsinformasjon: Revurderingsinformasjon) => void;
}

const BreakWordDiv = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

export const VisÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon,
    settRedigeringsmodus,
    behandling,
    oppdaterRevurderingsinformasjon,
}) => {
    const {
        behandlingErRedigerbar,
        hentAnsvarligSaksbehandler,
        hentBehandling,
        settNyEierModalState,
    } = useBehandling();
    const { axiosRequest } = useApp();
    const [feil, settFeil] = useState('');
    const [laster, settLaster] = useState(false);

    const årsakRevurdering = revurderingsinformasjon.årsakRevurdering;

    const formatertKravMottattDato =
        formaterNullableIsoDato(revurderingsinformasjon.kravMottatt) || 'Ingen data';

    const opplysningskilde =
        årsakRevurdering?.opplysningskilde &&
        opplysningskildeTilTekst[årsakRevurdering.opplysningskilde];

    const årsakTilRevurdering =
        årsakRevurdering?.årsak && årsakRevuderingTilTekst[årsakRevurdering.årsak];

    const slettÅrsakRevurdering = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `/familie-ef-sak/api/revurdering/informasjon/${behandling.id}`,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFeil('');
                    oppdaterRevurderingsinformasjon({});
                    hentBehandling.rerun();
                } else {
                    settFeil('Kunne ikke slette: ' + res.frontendFeilmelding);
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <VurderingLesemodusGrid>
            <BrukerMedBlyantIkon />
            <TittelOgKnappWrapper>
                <Heading size={'small'} level={'3'}>
                    Vurdert
                </Heading>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => settRedigeringsmodus(true)}
                            icon={<PencilIcon />}
                        >
                            Rediger
                        </Button>
                        <Button
                            variant={'tertiary'}
                            type={'button'}
                            onClick={slettÅrsakRevurdering}
                            disabled={laster}
                            icon={<TrashIcon />}
                        >
                            Slett
                        </Button>
                    </div>
                )}
            </TittelOgKnappWrapper>
            <VertikalStrek />
            <SistOppdatertOgVurderingWrapper>
                {revurderingsinformasjon.endretTid && (
                    <Detail>
                        Sist endret dato{' '}
                        {formaterIsoDatoTidMedSekunder(revurderingsinformasjon.endretTid)}
                    </Detail>
                )}
                <div>
                    <Label>Krav mottatt</Label>
                    <BodyShort>{formatertKravMottattDato}</BodyShort>
                </div>
                {årsakRevurdering && (
                    <>
                        <div>
                            <Label>Hvordan har vi fått opplysningene?</Label>
                            <BodyShort>{opplysningskilde}</BodyShort>
                        </div>
                        <div>
                            <Label>Årsak til revurdering</Label>
                            <BodyShort>{årsakTilRevurdering}</BodyShort>
                        </div>
                        {årsakRevurdering.beskrivelse && (
                            <BreakWordDiv>
                                <Label>Beskrivelse av årsak</Label>
                                <BodyShort>{årsakRevurdering.beskrivelse}</BodyShort>
                            </BreakWordDiv>
                        )}
                    </>
                )}
                {!årsakRevurdering && !erBehandlingUnderArbeid(behandling) && (
                    <Alert variant={'info'}>
                        Ingen informasjon å vise. Behandlingen ble opprettet før årsak til
                        revurdering ble lagt til som egen fane i behandling.
                    </Alert>
                )}
                {feil && <Alert variant={'error'}>{feil}</Alert>}
            </SistOppdatertOgVurderingWrapper>
        </VurderingLesemodusGrid>
    );
};
