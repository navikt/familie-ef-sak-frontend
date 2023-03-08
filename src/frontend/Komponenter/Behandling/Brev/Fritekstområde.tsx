import React, { SetStateAction, useEffect, useState } from 'react';
import { Button, Heading, Panel, Textarea, TextField } from '@navikt/ds-react';
import { Add, Delete } from '@navikt/ds-icons';
import styled from 'styled-components';
import { FritekstAvsnitt, Fritekstområder } from './BrevTyper';

const FritekstAvsnittContainer = styled(Panel).attrs({ border: true })`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const FritekstområdePanel = styled(Panel)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const SlettKnapp = styled(Button)`
    align-self: flex-end;
`;

export const Fritekstområde: React.FC<{
    id: string;
    settFritekstområder: React.Dispatch<SetStateAction<Fritekstområder>>;
}> = ({ id, settFritekstområder }) => {
    const [fritekstAvsnitt, settFritekstAvsnitt] = useState<FritekstAvsnitt[]>([]);

    const oppdaterAvsnitt = (indeks: number, oppdatertAvsnitt: FritekstAvsnitt) => {
        settFritekstAvsnitt((prevState) =>
            prevState.map((avsnitt, i) => {
                if (i === indeks) {
                    return oppdatertAvsnitt;
                }
                return avsnitt;
            })
        );
    };

    useEffect(() => {
        settFritekstområder((prevState) => ({ ...prevState, [id]: fritekstAvsnitt }));
        // eslint-disable-next-line
    }, [fritekstAvsnitt]);

    const fjernAvsnitt = (indeks: number) =>
        settFritekstAvsnitt((prevState) => prevState.filter((_, i) => indeks !== i));

    return (
        <FritekstområdePanel>
            <Heading size={'small'}>Fritekstområde</Heading>
            {fritekstAvsnitt.length !== 0 &&
                fritekstAvsnitt.map((avsnitt, indeks) => {
                    return (
                        <FritekstAvsnittContainer>
                            <SlettKnapp
                                icon={<Delete />}
                                variant={'tertiary'}
                                size={'small'}
                                onClick={() => fjernAvsnitt(indeks)}
                            >
                                Slett avsnitt
                            </SlettKnapp>
                            <TextField
                                size={'small'}
                                value={avsnitt.deloverskrift}
                                label={'Deloverskrift'}
                                onChange={(e) =>
                                    oppdaterAvsnitt(indeks, {
                                        deloverskrift: e.target.value,
                                        innhold: avsnitt.innhold,
                                    })
                                }
                            />
                            <Textarea
                                label={'Innhold'}
                                size={'small'}
                                value={avsnitt.innhold}
                                onChange={(e) =>
                                    oppdaterAvsnitt(indeks, {
                                        deloverskrift: avsnitt.deloverskrift,
                                        innhold: e.target.value,
                                    })
                                }
                            />
                        </FritekstAvsnittContainer>
                    );
                })}
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<Add />}
                onClick={() => settFritekstAvsnitt((prevState) => [...prevState, { innhold: '' }])}
            >
                Legg til fritekst
            </Button>
        </FritekstområdePanel>
    );
};
