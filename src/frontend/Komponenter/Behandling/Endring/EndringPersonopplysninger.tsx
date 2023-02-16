import React, { useState } from 'react';
import { Button, Heading } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { utledEndringerPåPersonopplysninger } from './utils';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { useBehandling } from '../../../App/context/BehandlingContext';
import {
    endringerKeyTilTekst,
    Feltendring,
    IEndringer,
    Personendring,
} from './personopplysningerEndringer';
import styled from 'styled-components';
import { AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { BodyLongMedium } from '../../../Felles/Visningskomponenter/Tekster';

const Advarsel = styled(AlertWarning)`
    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const PersonEndring: React.FC<{ personendringer: Personendring[] }> = ({ personendringer }) => {
    return (
        <>
            {personendringer.map((person) => (
                <ul key={person.ident}>
                    <li>Ident: {person.ident}</li>
                    <ul>
                        {person.fjernet && <li>Fjernet</li>}
                        {person.ny && <li>Ny</li>}
                        {person.endringer.map((endring, index) => (
                            <li key={endring.felt + index}>
                                {endring.felt} - <strong>Tidligere:</strong> {endring.tidligere}{' '}
                                <strong>Ny:</strong> {endring.ny}
                            </li>
                        ))}
                    </ul>
                </ul>
            ))}
        </>
    );
};

const FeltEndring: React.FC<{ feltendring: Feltendring }> = ({ feltendring }) => (
    <ul>
        <li>
            <strong>Tidligere</strong>: {feltendring.tidligere} <strong>Ny:</strong>{' '}
            {feltendring.ny}
        </li>
    </ul>
);

const Endringsdetaljer: React.FC<{ endringer: IEndringer; personopplysning: keyof IEndringer }> = ({
    endringer,
    personopplysning,
}) => {
    switch (personopplysning) {
        case 'barn':
        case 'annenForelder':
            return <PersonEndring personendringer={endringer[personopplysning].detaljer} />;
        case 'folkeregisterpersonstatus':
        case 'fødselsdato':
        case 'dødsdato':
            return <FeltEndring feltendring={endringer[personopplysning].detaljer} />;
        default:
            return null;
    }
};

const Personopplysningsendringer: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { toggles } = useToggles();
    const skalViseKomponent = toggles[ToggleName.visEndringerPersonopplysninger];
    const { endringerPersonopplysninger, nullstillGrunnlagsendringer, useHentVilkår } =
        useBehandling();
    const [nyGrunnlagsdataHentes, settNyGrunnlagsdataHentes] = useState(false);

    const { oppdaterGrunnlagsdataOgHentVilkår } = useHentVilkår;

    if (!skalViseKomponent) {
        return <></>;
    }

    return (
        <DataViewer response={{ endringerPersonopplysninger }}>
            {({ endringerPersonopplysninger }) => {
                if (!endringerPersonopplysninger) return null;
                const endringer = utledEndringerPåPersonopplysninger(endringerPersonopplysninger);
                const erEndring = endringer.length > 0;

                if (!erEndring) {
                    return <></>;
                }

                return (
                    <Advarsel>
                        <Heading spacing size="small" level="2">
                            Endring i Folkeregisteropplysninger
                        </Heading>
                        <BodyLongMedium>
                            Bruker sine opplysninger fra Folkeregisteret har endret seg siden denne
                            behandlingen ble påbegynt. Endringen gjelder:
                        </BodyLongMedium>
                        <ul>
                            {endringer.map((personopplysning) => (
                                <li key={personopplysning}>
                                    {endringerKeyTilTekst[personopplysning]}
                                    <Endringsdetaljer
                                        endringer={endringerPersonopplysninger.endringer}
                                        personopplysning={personopplysning}
                                    />
                                </li>
                            ))}
                        </ul>
                        <BodyLongMedium>
                            Saksbehandler må sjekke om endringen er relevant for behandlingen. Hvis
                            endringen er relevant må man oppdatere registeropplysninger og vurdere
                            aktuelle vilkår.
                        </BodyLongMedium>
                        <Button
                            size={'small'}
                            variant={'primary'}
                            loading={nyGrunnlagsdataHentes}
                            onClick={() => {
                                if (!nyGrunnlagsdataHentes) {
                                    settNyGrunnlagsdataHentes(true);
                                    oppdaterGrunnlagsdataOgHentVilkår(behandlingId).then(() => {
                                        nullstillGrunnlagsendringer();
                                        settNyGrunnlagsdataHentes(false);
                                    });
                                }
                            }}
                        >
                            Oppdater registeropplysninger i denne behandlingen
                        </Button>
                    </Advarsel>
                );
            }}
        </DataViewer>
    );
};

export default Personopplysningsendringer;
