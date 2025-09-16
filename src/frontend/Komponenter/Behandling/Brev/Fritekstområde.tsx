import React, { SetStateAction } from 'react';
import {
    Box,
    Button,
    Heading,
    HStack,
    Textarea,
    TextField,
    Tooltip,
    VStack,
} from '@navikt/ds-react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { FritekstAvsnitt, Fritekstområder } from './BrevTyper';

const FritekstAvsnittContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box padding="4" borderWidth="1" borderRadius="small" borderColor="border-subtle" width={'90%'}>
        <VStack gap="1">
            <Heading size="xsmall">Avsnitt</Heading>
            {children}
        </VStack>
    </Box>
);

const FritekstområdePanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box padding="4" width="90%">
        <HStack gap="4">{children}</HStack>
    </Box>
);

const KnappeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
        }}
    >
        {children}
    </div>
);

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
