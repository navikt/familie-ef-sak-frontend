import {
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    årsakRevuderingTilTekst,
} from './typer';
import React, { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { Alert, Button, Detail, Heading } from '@navikt/ds-react';
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

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
    behandling: Behandling;
    oppdaterRevurderingsinformasjon: (revurderingsinformasjon: Revurderingsinformasjon) => void;
}

const BreakWordFamilieLesefelt = styled(FamilieLesefelt)`
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
                <FamilieLesefelt
                    label={'Krav mottatt'}
                    verdi={
                        formaterNullableIsoDato(revurderingsinformasjon.kravMottatt) || 'Ingen data'
                    }
                />
                {årsakRevurdering && (
                    <>
                        <FamilieLesefelt
                            label={'Hvordan har vi fått opplysningene?'}
                            verdi={
                                årsakRevurdering.opplysningskilde &&
                                opplysningskildeTilTekst[årsakRevurdering.opplysningskilde]
                            }
                        />
                        <FamilieLesefelt
                            label={'Årsak til revurdering'}
                            verdi={
                                årsakRevurdering.årsak &&
                                årsakRevuderingTilTekst[årsakRevurdering.årsak]
                            }
                        />
                        {årsakRevurdering.beskrivelse && (
                            <BreakWordFamilieLesefelt
                                label={'Beskrivelse av årsak'}
                                verdi={årsakRevurdering.beskrivelse}
                            />
                        )}
                    </>
                )}
                {!årsakRevurdering && !behandlingErRedigerbar && (
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
