import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, Textarea } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import Panel from 'nav-frontend-paneler';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IAvsnitt, IFritekstBrev } from '../../../App/typer/brev';
import { v4 as uuidv4 } from 'uuid';
import { Select } from 'nav-frontend-skjema';
import { useDebouncedCallback } from 'use-debounce';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';

const StyledFrittståendeBrev = styled.div`
    margin-bottom: 10rem;
    margin-right: 2rem;
    width: 50%;
`;

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 90% 10%;
`;

const Knapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-start;
`;

const BrevKolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

type Props = {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId?: string;
    fagsakId?: string;
};

const FritekstBrev: React.FC<Props> = ({ oppdaterBrevressurs, behandlingId, fagsakId }) => {
    const førsteRad = [
        {
            deloverskrift: '',
            innhold: '',
            id: uuidv4(),
        },
    ];

    const [stønadType, settStønadType] = useState<string>();
    const [brevType, settBrevType] = useState<string>();

    const [overskrift, settOverskrift] = useState('');
    const [avsnitt, settAvsnitt] = useState<IAvsnitt[]>(førsteRad);
    const { axiosRequest } = useApp();

    const personopplysningerFagsakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const personopplysningerBehandlingConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/behandling/${behandlingId}`,
        }),
        [behandlingId]
    );

    const personopplysningerConfig = fagsakId
        ? personopplysningerFagsakConfig
        : personopplysningerBehandlingConfig;

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const genererBrev = () => {
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;

        if (fagsakId) {
            axiosRequest<string, IFritekstBrev>({
                method: 'POST',
                url: `/familie-ef-sak/api/frittstaende-brev`,
                data: {
                    overskrift,
                    avsnitt,
                    fagsakId,
                    stønadType,
                    brevType,
                },
            }).then((respons: Ressurs<string>) => {
                if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
            });
        } else if (behandlingId) {
            axiosRequest<string, IFritekstBrev>({
                method: 'POST',
                url: `/familie-ef-sak/api/brev/fritekst`,
                data: {
                    overskrift,
                    avsnitt,
                    behandlingId,
                },
            }).then((respons: Ressurs<string>) => {
                if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
            });
        }
    };

    const leggTilRad = () => {
        settAvsnitt((eksisterendeAvsnitt: IAvsnitt[]) => {
            return [
                ...eksisterendeAvsnitt,
                {
                    deloverskrift: '',
                    innhold: '',
                    id: uuidv4(),
                },
            ];
        });
    };

    const fjernRad = (radId: string) => {
        return () =>
            settAvsnitt((eksisterendeAvsnitt: IAvsnitt[]) => {
                return eksisterendeAvsnitt.filter((rad) => radId !== rad.id);
            });
    };

    const endreInnholdAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLTextAreaElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, innhold: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const endreDeloverskriftAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, deloverskrift: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    return (
        <StyledFrittståendeBrev>
            <h1>Frittstående brev</h1>
            <BrevKolonner>
                <Input
                    label="Overskrift"
                    value={overskrift}
                    onChange={(e) => {
                        settOverskrift(e.target.value);
                    }}
                />

                <StyledSelect
                    label="Stønadtype"
                    defaultValue="overgangsstonad"
                    onChange={(e) => {
                        settStønadType(e.target.value);
                    }}
                    value={stønadType}
                >
                    <option value={'overgangsstonad'}>Overgangsstønad</option>
                    <option value={'barnetilsyn'}>Barnetilsyn</option>
                    <option value={'skolepenger'}>Skolepenger</option>
                </StyledSelect>

                <StyledSelect
                    label="Brevtype"
                    defaultValue="infobrev"
                    onChange={(e) => {
                        settBrevType(e.target.value);
                    }}
                    value={brevType}
                >
                    <option value={'infobrev'}>Infobrev</option>
                    <option value={'mangelbrev'}>Mangelbrev</option>
                </StyledSelect>

                {avsnitt.map((rad) => {
                    const deloverskriftId = `deloverskrift-${rad.id}`;
                    const innholdId = `innhold-${rad.id}`;

                    return (
                        <Innholdsrad key={rad.id} border>
                            <Input
                                onChange={endreDeloverskriftAvsnitt(rad.id)}
                                label="Deloverskrift (valgfri)"
                                id={deloverskriftId}
                                value={rad.deloverskrift}
                            />
                            <LenkeKnapp onClick={fjernRad(rad.id)}>
                                <SlettSøppelkasse withDefaultStroke={false} />
                                Slett
                            </LenkeKnapp>
                            <Textarea
                                onChange={endreInnholdAvsnitt(rad.id)}
                                defaultValue=""
                                label="Innhold"
                                id={innholdId}
                                value={rad.innhold}
                                maxLength={0}
                            />
                        </Innholdsrad>
                    );
                })}

                <Knapper>
                    <LeggTilKnapp onClick={leggTilRad} knappetekst="Legg til seksjon" />
                </Knapper>
            </BrevKolonner>
        </StyledFrittståendeBrev>
    );
};

export default FritekstBrev;
