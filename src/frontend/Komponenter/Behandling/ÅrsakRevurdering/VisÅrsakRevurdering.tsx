import {
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    årsakRevuderingTilTekst,
} from './typer';
import React, { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { Alert, Button, Detail } from '@navikt/ds-react';
import {
    formaterIsoDatoTidMedSekunder,
    formaterNullableIsoDato,
} from '../../../App/utils/formatter';
import { Undertittel } from 'nav-frontend-typografi';
import { Delete, Edit } from '@navikt/ds-icons';
import {
    SistOppdatertOgVurderingWrapper,
    StyledStrek,
    StyledVurderingLesemodus,
    TittelOgKnappWrapper,
} from '../Vurdering/StyledVurdering';
import { useApp } from '../../../App/context/AppContext';
import { Behandling } from '../../../App/typer/fagsak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
    behandling: Behandling;
    oppdaterRevurderingsinformasjon: (revurderingsinformasjon: Revurderingsinformasjon) => void;
}

export const VisÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon,
    settRedigeringsmodus,
    behandling,
    oppdaterRevurderingsinformasjon,
}) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const { axiosRequest } = useApp();
    const [feil, settFeil] = useState('');

    const årsakRevurdering = revurderingsinformasjon.årsakRevurdering;

    const slettÅrsakRevurdering = () => {
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `/familie-ef-sak/api/revurdering/informasjon/${behandling.id}`,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFeil('');
                oppdaterRevurderingsinformasjon({});
                hentBehandling.rerun();
            } else {
                settFeil('Kunne ikke slette: ' + res.frontendFeilmelding);
            }
        });
    };

    return (
        <StyledVurderingLesemodus>
            <BrukerMedBlyantIkon />
            <TittelOgKnappWrapper>
                <Undertittel>Vurdert</Undertittel>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => settRedigeringsmodus(true)}
                            icon={<Edit />}
                        >
                            Rediger
                        </Button>
                        <Button
                            variant={'tertiary'}
                            type={'button'}
                            onClick={slettÅrsakRevurdering}
                            icon={<Delete />}
                        >
                            Slett
                        </Button>
                    </div>
                )}
            </TittelOgKnappWrapper>
            <StyledStrek />
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
                            <FamilieLesefelt
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
        </StyledVurderingLesemodus>
    );
};
