import {
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    årsakRevuderingTilTekst,
} from './typer';
import React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { Alert, Button, Detail } from '@navikt/ds-react';
import {
    formaterIsoDatoTidMedSekunder,
    formaterNullableIsoDato,
} from '../../../App/utils/formatter';
import { Undertittel } from 'nav-frontend-typografi';
import { Edit } from '@navikt/ds-icons';
import {
    StyledStrek,
    StyledVurderingLesemodus,
    TittelOgKnappWrapper,
    SistOppdatertOgVurderingWrapper,
} from '../Vurdering/StyledVurdering';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

export const VisÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon,
    settRedigeringsmodus,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const årsakRevurdering = revurderingsinformasjon.årsakRevurdering;

    // TODO endret til

    return (
        <StyledVurderingLesemodus>
            <BrukerMedBlyantIkon />
            <TittelOgKnappWrapper>
                <Undertittel>Vurdert</Undertittel>
                <Button
                    variant={'tertiary'}
                    type={'button'}
                    hidden={!behandlingErRedigerbar}
                    onClick={() => settRedigeringsmodus(true)}
                    icon={<Edit />}
                >
                    Rediger
                </Button>
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
            </SistOppdatertOgVurderingWrapper>
        </StyledVurderingLesemodus>
    );
};
