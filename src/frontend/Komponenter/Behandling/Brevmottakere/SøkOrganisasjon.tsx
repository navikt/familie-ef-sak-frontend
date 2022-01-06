import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Element } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { IOrganisasjonMottaker } from './typer';
import { StyledSøkInput, StyledSøkResultat } from './brevmottakereStyling';

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

    const leggTilOrganisasjon = (organisasjonsnummer: string, organisasjonsnavn: string) => () => {
        if (!navnHosOrganisasjon) {
            settFeil('Oppgi kontaktperson hos organisasjonen');
            return;
        }
        settFeil('');
        settValgteMottakere([
            {
                organisasjonsnummer,
                organisasjonsnavn,
                navnHosOrganisasjon: navnHosOrganisasjon,
                mottakerRolle: 'VERGE',
            },
        ]);
    };

    return (
        <>
            <StyledSøkInput
                label={'Organisasjonsnummer'}
                placeholder={'Søk'}
                value={organisasjonsnummer}
                onChange={(e) => settOrganisasjonsnummer(e.target.value)}
            />
            <DataViewer response={{ organisasjonRessurs }}>
                {({ organisasjonRessurs }) => {
                    return (
                        <>
                            <StyledSøkResultat>
                                <div>
                                    <Element>{organisasjonRessurs.navn}</Element>
                                    {organisasjonRessurs.organisasjonsnummer}
                                </div>
                                <Knapp
                                    onClick={leggTilOrganisasjon(
                                        organisasjonRessurs.organisasjonsnummer,
                                        organisasjonRessurs.navn
                                    )}
                                >
                                    Legg til
                                </Knapp>
                                <Input
                                    bredde={'M'}
                                    label={'Ved'}
                                    placeholder={'Personen brevet skal til'}
                                    value={navnHosOrganisasjon}
                                    onChange={(e) => settNavnHosOrganisasjon(e.target.value)}
                                    feil={feil}
                                />
                            </StyledSøkResultat>
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
