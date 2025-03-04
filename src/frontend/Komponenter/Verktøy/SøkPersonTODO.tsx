import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import { Søkefelt, Søkeresultat } from '../Behandling/Brevmottakere/brevmottakereStyling';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, HStack } from '@navikt/ds-react';
import { FinnNavnHer } from './SamværskalkulatorSide';

interface Props {
    valgtPerson: FinnNavnHer;
    settValgtPerson: Dispatch<SetStateAction<FinnNavnHer>>;
}

interface PersonSøk {
    personIdent: string;
    navn: string;
}

export const SøkPersonTODO: React.FC<Props> = ({ settValgtPerson, valgtPerson }) => {
    const { axiosRequest } = useApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());
    console.log(valgtPerson.navn);

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

    const velgPerson = (personIdent: string, navn: string) => () => {
        settValgtPerson({ personIdent: personIdent, navn: navn });
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
                                        onClick={velgPerson(
                                            søkRessurs.personIdent,
                                            søkRessurs.navn
                                        )}
                                    >
                                        Legg til
                                    </Button>
                                </HStack>
                            </Søkeresultat>
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};
