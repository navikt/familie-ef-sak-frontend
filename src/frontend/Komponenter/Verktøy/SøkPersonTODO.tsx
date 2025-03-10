import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import styled from 'styled-components';
import { Søkeresultat } from '../Behandling/Brevmottakere/brevmottakereStyling';

interface Props {
    settPersonIdent: Dispatch<SetStateAction<string>>;
    settVisEndrePersonModal: Dispatch<React.SetStateAction<boolean>>;
}

interface PersonSøk {
    personIdent: string;
    navn: string;
}

export const StyledVStack = styled(VStack)`
    padding: 10px;
`;

export const SøkPersonTODO: React.FC<Props> = ({ settPersonIdent, settVisEndrePersonModal }) => {
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

    const velgPerson = (personIdent: string) => () => {
        settPersonIdent(personIdent);
        settVisEndrePersonModal(false);
    };

    return (
        <>
            <TextField
                label={'Fødselsnummer'}
                htmlSize={26}
                placeholder={'Skriv inn fødselsnummer'}
                value={søkIdent}
                onChange={(e) => settSøkIdent(e.target.value)}
                autoComplete="off"
            />
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return (
                        <>
                            <Søkeresultat>
                                <StyledVStack>
                                    <BodyShort>{søkRessurs.navn}</BodyShort>
                                    {søkRessurs.personIdent}
                                </StyledVStack>
                                <HStack align="center">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={velgPerson(søkRessurs.personIdent)}
                                    >
                                        Velg person
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
