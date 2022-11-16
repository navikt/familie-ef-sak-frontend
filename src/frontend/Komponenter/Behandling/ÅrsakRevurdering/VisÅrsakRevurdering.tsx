import {
    opplysningskildeTilTekst,
    Revurderingsinformasjon,
    årsakRevuderingTilTekst,
} from './typer';
import React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { Alert, Button } from '@navikt/ds-react';
import RedigerBlyant from '../../../Felles/Ikoner/RedigerBlyant';

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
        <>
            <BrukerMedBlyantIkon />
            <div>
                <Button
                    variant={'tertiary'}
                    hidden={!behandlingErRedigerbar}
                    onClick={() => settRedigeringsmodus(true)}
                    icon={<RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />}
                >
                    Rediger
                </Button>
                <FamilieLesefelt
                    label={'Krav mottatt'}
                    verdi={revurderingsinformasjon.kravMottatt || 'Ingen data'}
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
            </div>
        </>
    );
};
