import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { utledEndringerPåPersonopplysninger } from './utils';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { endringerKeyTilTekst, IEndringer, Personendring } from './personopplysningerEndringer';

const DetaljerPersonendring: React.FC<{ personendringer: Personendring[] }> = ({
    personendringer,
}) => {
    return (
        <>
            {personendringer.map((person) => (
                <ul key={person.ident}>
                    <li>Ident: {person.ident}</li>
                    <ul>
                        {person.endringer.map((endring, index) => (
                            <li key={endring.felt + index}>
                                {endring.felt} - Tidligere:
                                {endring.tidligere} Ny:
                                {endring.ny}
                            </li>
                        ))}
                    </ul>
                </ul>
            ))}
        </>
    );
};

const Detaljer: React.FC<{ endringer: IEndringer; personopplysning: keyof IEndringer }> = ({
    endringer,
    personopplysning,
}) => {
    switch (personopplysning) {
        case 'barn':
        case 'annenForelder':
            return <DetaljerPersonendring personendringer={endringer[personopplysning].detaljer} />;
        default:
            return null;
    }
};

const EndringPersonopplsyninger: React.FC = () => {
    const { toggles } = useToggles();
    const skalViseKomponent = toggles[ToggleName.visEndringerPersonopplysninger];
    const { endringerPersonopplysninger } = useBehandling();

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
                    <Alert variant="warning" title="Endring i folkeregisteropplysninger">
                        <Heading spacing size="small" level="2">
                            Endring i folkeregisteropplysninger
                        </Heading>
                        <div>
                            Det har vært endringer i bruker sine opplysninger fra folkeregisteret
                            siden denne behandlingen ble påbegynt. Endringene gjelder:
                        </div>
                        <ul>
                            {endringer.map((personopplysning) => (
                                <li key={personopplysning}>
                                    {endringerKeyTilTekst[personopplysning]}
                                    <Detaljer
                                        endringer={endringerPersonopplysninger.endringer}
                                        personopplysning={personopplysning}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Alert>
                );
            }}
        </DataViewer>
    );
};

export default EndringPersonopplsyninger;
