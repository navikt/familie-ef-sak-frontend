import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBrevmottakerRolle, IOrganisasjonMottaker } from './typer';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { BodyShort, TextField } from '@navikt/ds-react';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

interface Props {
    valgteMottakere: IOrganisasjonMottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}
export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere, valgteMottakere }) => {
    const { axiosRequest } = useApp();

    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [navnHosOrganisasjon, settNavnHosOrganisasjon] = useState('');
    const [organisasjonRessurs, settOrganisasjonRessurs] =
        useState(byggTomRessurs<IOrganisasjon>());
    const [feilmelding, settFeilmelding] = useState('');

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
            settFeilmelding('Oppgi kontaktperson hos organisasjonen');
            return;
        }

        const finnesAllerede = valgteMottakere.some(
            (mottaker) => mottaker.organisasjonsnummer === organisasjonsnummer
        );

        if (!finnesAllerede) {
            settValgteMottakere((forrigeMottakere) => [
                ...forrigeMottakere,
                {
                    organisasjonsnummer,
                    navnHosOrganisasjon,
                    mottakerRolle: EBrevmottakerRolle.VERGE,
                },
            ]);
        } else {
            settFeilmelding('Organisasjonen er allerede lagt til');
        }

        settFeilmelding('');
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
                                    autoComplete="off"
                                />
                            </Søkeresultat>
                            {feilmelding && <AlertError size="small">{feilmelding}</AlertError>}
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
