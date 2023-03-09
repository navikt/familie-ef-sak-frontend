import React, { SetStateAction } from 'react';
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
    fritekstområder: Fritekstområder;
    settFritekstområder: React.Dispatch<SetStateAction<Fritekstområder>>;
}> = ({ id, fritekstområder, settFritekstområder }) => {
    const oppdaterAvsnitt = (indeks: number, oppdatertAvsnitt: FritekstAvsnitt) => {
        settFritekstområder((prevState) => ({
            ...prevState,
            [id]: prevState[id].map((avsnitt, i) => {
                if (i === indeks) {
                    return oppdatertAvsnitt;
                }
                return avsnitt;
            }),
        }));
    };

    const fjernAvsnitt = (indeks: number) =>
        settFritekstområder((prevState) => ({
            ...prevState,
            [id]: prevState[id].filter((_, i) => indeks !== i),
        }));

    const leggTilNyttAvsnitt = () =>
        settFritekstområder((prevState) => ({
            ...prevState,
            [id]: prevState[id] ? [...prevState[id], { innhold: '' }] : [{ innhold: '' }],
        }));

    return (
        <FritekstområdePanel>
            <Heading size={'small'}>Fritekstområde</Heading>
            {fritekstområder[id] &&
                fritekstområder[id].length !== 0 &&
                fritekstområder[id].map((avsnitt, indeks) => {
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
                onClick={leggTilNyttAvsnitt}
            >
                Legg til fritekst
            </Button>
        </FritekstområdePanel>
    );
};
