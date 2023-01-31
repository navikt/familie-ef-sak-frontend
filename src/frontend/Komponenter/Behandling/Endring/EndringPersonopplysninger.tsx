import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
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

const Personopplysningsendringer: React.FC = () => {
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
                    <Alert variant="warning">
                        <Heading spacing size="small" level="2">
                            Endring i Folkeregisteropplysninger
                        </Heading>
                        <div>
                            Det har vært endringer i bruker sine opplysninger fra Folkeregisteret
                            siden denne behandlingen ble påbegynt. Endringene gjelder:
                        </div>
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
                    </Alert>
                );
            }}
        </DataViewer>
    );
};

export default Personopplysningsendringer;
