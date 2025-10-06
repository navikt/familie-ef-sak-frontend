import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BrevmottakerRolleOrganisasjon, EBrevmottakerRolle, IOrganisasjonMottaker } from './typer';
import { Søkeresultat } from './brevmottakereStyling';
import { BodyShort, Radio, RadioGroup, Stack, TextField, VStack } from '@navikt/ds-react';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

interface Props {
    valgteMottakere: IOrganisasjonMottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}
export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere, valgteMottakere }) => {
    const { axiosRequest } = useApp();

    const [mottakerRolle, settMottakerRolle] = useState<BrevmottakerRolleOrganisasjon>(
        EBrevmottakerRolle.FULLMEKTIG
    );
    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [kontaktpersonHosOrganisasjon, settKontaktpersonHosOrganisasjon] = useState('');
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

    const leggTilOrganisasjon = (organisasjonsnummer: string, organisasjonsnavn: string) => () => {
        if (!kontaktpersonHosOrganisasjon) {
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
                    organisasjonsnummer: organisasjonsnummer,
                    navnHosOrganisasjon: `${organisasjonsnavn} c/o ${kontaktpersonHosOrganisasjon}`,
                    mottakerRolle: mottakerRolle,
                },
            ]);
        } else {
            settFeilmelding('Organisasjonen er allerede lagt til');
        }

        settFeilmelding('');
    };

    return (
        <>
            <TextField
                label={'Organisasjonsnummer'}
                htmlSize={26}
                placeholder={'Søk'}
                value={organisasjonsnummer}
                onChange={(e) => settOrganisasjonsnummer(e.target.value)}
                autoComplete="off"
                style={{
                    width: '50%',
                    paddingRight: '1rem',
                }}
            />
            <DataViewer response={{ organisasjonRessurs }}>
                {({ organisasjonRessurs }) => {
                    return (
                        <VStack>
                            <RadioGroup
                                legend="Velg mottakerrolle"
                                onChange={(rolle: BrevmottakerRolleOrganisasjon) =>
                                    settMottakerRolle(rolle)
                                }
                                value={mottakerRolle}
                            >
                                <Stack gap="space-0 space-24" direction={'row'} wrap={false}>
                                    <Radio value={EBrevmottakerRolle.FULLMEKTIG}>Fullmektig</Radio>
                                    <Radio value={EBrevmottakerRolle.MOTTAKER}>
                                        Annen mottaker
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                            <Søkeresultat>
                                <div>
                                    <BodyShort>{organisasjonRessurs.navn}</BodyShort>
                                    {organisasjonRessurs.organisasjonsnummer}
                                </div>
                                <LeggTilKnapp
                                    onClick={leggTilOrganisasjon(
                                        organisasjonRessurs.organisasjonsnummer,
                                        organisasjonRessurs.navn
                                    )}
                                    knappetekst={'Legg til'}
                                />
                                <TextField
                                    htmlSize={25}
                                    label={'Ved'}
                                    placeholder={'Personen brevet skal til'}
                                    value={kontaktpersonHosOrganisasjon}
                                    onChange={(e) =>
                                        settKontaktpersonHosOrganisasjon(e.target.value)
                                    }
                                    autoComplete="off"
                                />
                            </Søkeresultat>
                            {feilmelding && <AlertError size="small">{feilmelding}</AlertError>}
                        </VStack>
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
