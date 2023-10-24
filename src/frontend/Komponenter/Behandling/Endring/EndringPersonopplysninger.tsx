import React, { useState } from 'react';
import { Button, Heading } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { utledEndringerPåPersonopplysninger } from './utils';
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

const OppdaterGrunnlagKnapp = styled(Button)`
    margin: 0 1rem 0 0.5rem;
`;

const skalViseDetaljer = (ny: string, tidligere: string) => tidligere != '' || ny != '';

const visEndringsdetaljer = (tidligere: string, ny: string) =>
    skalViseDetaljer(tidligere, ny) && (
        <>
            - <strong>Tidligere:</strong> {tidligere} <strong>Ny:</strong> {ny}
        </>
    );

const PersonEndring: React.FC<{ personendringer: Personendring[] }> = ({ personendringer }) => {
    return (
        <>
            {personendringer.map((person) => (
                <ul key={person.ident}>
                    <li>Ident: {person.ident}</li>
                    <ul>
                        {person.fjernet && <li>Fjernet</li>}
                        {person.ny && <li>Ny</li>}
                        {person.endringer.map((endring, index) => {
                            return (
                                <li key={endring.felt + index}>
                                    {endring.felt}
                                    {visEndringsdetaljer(endring.tidligere, endring.ny)}
                                </li>
                            );
                        })}
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

const AdresseEndring: React.FC = () => (
    <ul>
        <li>Det finnes adresseendring på bruker</li>
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
        case 'adresse':
            return <AdresseEndring />;
        default:
            return null;
    }
};

const Personopplysningsendringer: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { endringerPersonopplysninger, nullstillGrunnlagsendringer, vilkårState } =
        useBehandling();
    const [nyGrunnlagsdataHentes, settNyGrunnlagsdataHentes] = useState(false);

    const { oppdaterGrunnlagsdataOgHentVilkår } = vilkårState;

    const oppdaterGrunnlagsdata = () => {
        if (!nyGrunnlagsdataHentes) {
            settNyGrunnlagsdataHentes(true);
            oppdaterGrunnlagsdataOgHentVilkår(behandlingId).then(() => {
                nullstillGrunnlagsendringer();
                settNyGrunnlagsdataHentes(false);
            });
        }
    };

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
                            Opplysninger fra Folkeregisteret er endret
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
                            Saksbehandler må sjekke endringen, oppdatere registeropplysninger i
                            behandlingen og eventuelt vurdere vilkår på nytt.
                        </BodyLongMedium>
                        <OppdaterGrunnlagKnapp
                            size={'small'}
                            variant={'primary'}
                            loading={nyGrunnlagsdataHentes}
                            onClick={oppdaterGrunnlagsdata}
                        >
                            Oppdater registeropplysninger i denne behandlingen
                        </OppdaterGrunnlagKnapp>
                    </Advarsel>
                );
            }}
        </DataViewer>
    );
};

export default Personopplysningsendringer;
