import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { BodyShort, Button, HStack } from '@navikt/ds-react';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

type Props =
    | {
          valgtePersonMottakere: IBrevmottaker[];
          settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
          oppdaterPerson?: never;
      }
    | {
          valgtePersonMottakere?: never;
          settValgteMottakere?: never;
          oppdaterPerson: (personIdent: string, navn: string) => void;
      };

export interface PersonSøk {
    personIdent: string;
    navn: string;
}

export const SøkPerson: React.FC<Props> = ({
    settValgteMottakere,
    valgtePersonMottakere,
    oppdaterPerson,
}) => {
    const { axiosRequest } = useApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());
    const [feilmelding, settFeilmelding] = useState('');

    useEffect(() => {
        if (søkIdent && søkIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string }>({
                method: 'POST',
                url: 'familie-ef-sak/api/sok/person/uten-fagsak',
                data: {
                    personIdent: søkIdent,
                },
            }).then((resp: Ressurs<PersonSøk>) => {
                settSøkRessurs(resp);
            });
        }
    }, [axiosRequest, søkIdent]);

    const leggTilBrevmottaker = (personIdent: string, navn: string) => {
        const finnesAllerede = valgtePersonMottakere?.some(
            (mottaker) => mottaker.personIdent === personIdent
        );

        if (!finnesAllerede && settValgteMottakere) {
            settValgteMottakere((prevState) => [
                ...prevState,
                { navn, personIdent, mottakerRolle: EBrevmottakerRolle.VERGE },
            ]);
            settFeilmelding('');
        } else {
            settFeilmelding('Personen er allerede lagt til');
        }
    };

    const håndterLeggTilBrevmottakerEllerPersonIdent = (personIdent: string, navn: string) =>
        settValgteMottakere !== undefined
            ? leggTilBrevmottaker(personIdent, navn)
            : oppdaterPerson(personIdent, navn);

    return (
        <>
            <Søkefelt
                label={'Personident'}
                htmlSize={26}
                placeholder={
                    settValgteMottakere !== undefined
                        ? 'Personen som skal ha brevet'
                        : 'Fnr til bruker'
                }
                value={søkIdent}
                onChange={(e) => settSøkIdent(e.target.value)}
                autoComplete="off"
            />
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return (
                        <>
                            <Søkeresultat>
                                <div>
                                    <BodyShort>{søkRessurs.navn}</BodyShort>
                                    {søkRessurs.personIdent}
                                </div>
                                <HStack align="center">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={() =>
                                            håndterLeggTilBrevmottakerEllerPersonIdent(
                                                søkRessurs.personIdent,
                                                søkRessurs.navn
                                            )
                                        }
                                    >
                                        Legg til
                                    </Button>
                                </HStack>
                            </Søkeresultat>
                            {feilmelding && <AlertError size="small">{feilmelding}</AlertError>}
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};
