import React, { SetStateAction } from 'react';
import { Button, Heading, Panel, Textarea, TextField, Tooltip } from '@navikt/ds-react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
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

const KnappeWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
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

    const flyttAvsnittOpp = (indeks: number) => {
        if (indeks === 0) return;

        settFritekstområder((prevState) => ({
            ...prevState,
            [id]: [
                ...prevState[id].slice(0, indeks - 1),
                prevState[id][indeks],
                prevState[id][indeks - 1],
                ...prevState[id].slice(indeks + 1),
            ],
        }));
    };

    const flyttAvsnittNed = (indeks: number) => {
        if (indeks === fritekstområder[id].length - 1) return;

        settFritekstområder((prevState) => ({
            ...prevState,
            [id]: [
                ...prevState[id].slice(0, indeks),
                prevState[id][indeks + 1],
                prevState[id][indeks],
                ...prevState[id].slice(indeks + 2),
            ],
        }));
    };

    return (
        <FritekstområdePanel>
            <Heading size={'small'}>Fritekstområde</Heading>
            {fritekstområder[id] &&
                fritekstområder[id].length !== 0 &&
                fritekstområder[id].map((avsnitt, indeks) => {
                    return (
                        <FritekstAvsnittContainer key={indeks}>
                            <TextField
                                size={'small'}
                                value={avsnitt.deloverskrift || ''}
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
                            <KnappeWrapper>
                                <Tooltip content="Slett avsnitt">
                                    <Button
                                        icon={<TrashIcon />}
                                        variant={'tertiary'}
                                        size={'small'}
                                        onClick={() => fjernAvsnitt(indeks)}
                                    />
                                </Tooltip>
                                <Tooltip content="Flytt avsnitt ned">
                                    <Button
                                        size={'small'}
                                        variant={'tertiary'}
                                        icon={<ArrowDownIcon />}
                                        onClick={() => flyttAvsnittNed(indeks)}
                                    />
                                </Tooltip>
                                <Tooltip content="Flytt avsnitt opp">
                                    <Button
                                        size={'small'}
                                        variant={'tertiary'}
                                        icon={<ArrowUpIcon />}
                                        onClick={() => flyttAvsnittOpp(indeks)}
                                    />
                                </Tooltip>
                            </KnappeWrapper>
                        </FritekstAvsnittContainer>
                    );
                })}
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<PlusIcon fontSize="1.5rem" />}
                onClick={leggTilNyttAvsnitt}
            >
                Legg til fritekst
            </Button>
        </FritekstområdePanel>
    );
};
