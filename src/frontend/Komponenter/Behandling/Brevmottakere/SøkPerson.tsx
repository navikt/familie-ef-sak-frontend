import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { BodyShort, Button, HStack } from '@navikt/ds-react';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';

interface Props {
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
}

interface PersonSøk {
    personIdent: string;
    navn: string;
}

export const SøkPerson: React.FC<Props> = ({ settValgteMottakere }) => {
    const { axiosRequest } = useApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());

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

    const leggTilBrevmottaker = (personIdent: string, navn: string) => () => {
        settValgteMottakere((prevState) => [
            ...prevState,
            { navn, personIdent, mottakerRolle: EBrevmottakerRolle.VERGE },
        ]);
    };

    return (
        <>
            <Søkefelt
                label={'Personident'}
                htmlSize={26}
                placeholder={'Personen som skal ha brevet'}
                value={søkIdent}
                onChange={(e) => settSøkIdent(e.target.value)}
                autoComplete="off"
            />
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return (
                        <Søkeresultat>
                            <div>
                                <BodyShort>{søkRessurs.navn}</BodyShort>
                                {søkRessurs.personIdent}
                            </div>
                            <HStack align="center">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={leggTilBrevmottaker(
                                        søkRessurs.personIdent,
                                        søkRessurs.navn
                                    )}
                                >
                                    Legg til
                                </Button>
                            </HStack>
                        </Søkeresultat>
                    );
                }}
            </DataViewer>
        </>
    );
};
