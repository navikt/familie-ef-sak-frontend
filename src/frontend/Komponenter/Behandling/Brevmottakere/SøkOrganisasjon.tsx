import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IOrganisasjonMottaker } from './typer';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { BodyShort, TextField } from '@navikt/ds-react';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';

interface Props {
    valgteMottakere: IOrganisasjonMottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}
export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere }) => {
    const { axiosRequest } = useApp();

    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [navnHosOrganisasjon, settNavnHosOrganisasjon] = useState('');
    const [organisasjonRessurs, settOrganisasjonRessurs] = useState(
        byggTomRessurs<IOrganisasjon>()
    );
    const [feil, settFeil] = useState('');

    useEffect(() => {
        if (organisasjonsnummer?.length === 9) {
            axiosRequest<IOrganisasjon, null>({
                method: 'GET',
                url: `familie-ef-sak/api/organisasjon/${organisasjonsnummer}`,
            }).then((response: Ressurs<IOrganisasjon>) => {
                settOrganisasjonRessurs(response);
            });
        }
    }, [axiosRequest, organisasjonsnummer]);

    const leggTilOrganisasjon = (organisasjonsnummer: string) => () => {
        if (!navnHosOrganisasjon) {
            settFeil('Oppgi kontaktperson hos organisasjonen');
            return;
        }
        settFeil('');
        settValgteMottakere([
            {
                organisasjonsnummer,
                navnHosOrganisasjon: navnHosOrganisasjon,
                mottakerRolle: 'VERGE',
            },
        ]);
    };

    return (
        <>
            <Søkefelt
                label={'Organisasjonsnummer'}
                htmlSize={26}
                placeholder={'Søk'}
                value={organisasjonsnummer}
                onChange={(e) => settOrganisasjonsnummer(e.target.value)}
                autoComplete="off"
            />
            <DataViewer response={{ organisasjonRessurs }}>
                {({ organisasjonRessurs }) => {
                    return (
                        <>
                            <Søkeresultat>
                                <div>
                                    <BodyShort>{organisasjonRessurs.navn}</BodyShort>
                                    {organisasjonRessurs.organisasjonsnummer}
                                </div>
                                <LeggTilKnapp
                                    onClick={leggTilOrganisasjon(
                                        organisasjonRessurs.organisasjonsnummer
                                    )}
                                    knappetekst={'Legg til'}
                                />
                                <TextField
                                    htmlSize={25}
                                    label={'Ved'}
                                    placeholder={'Personen brevet skal til'}
                                    value={navnHosOrganisasjon}
                                    onChange={(e) => settNavnHosOrganisasjon(e.target.value)}
                                    error={feil}
                                    autoComplete="off"
                                />
                            </Søkeresultat>
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};

export interface IOrganisasjon {
    navn: string;
    organisasjonsnummer: string;
}
