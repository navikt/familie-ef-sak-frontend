import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, Select, Textarea } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import Panel from 'nav-frontend-paneler';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { v4 as uuidv4 } from 'uuid';
import { useDebouncedCallback } from 'use-debounce';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import {
    BrevtyperTilDeloverskriftTekst,
    BrevtyperTilInnholdTekst,
    BrevtyperTilOverskrift,
    BrevtyperTilSelectNavn,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IAvsnitt,
    IFritekstBrev,
    IFrittståendeBrev,
} from './BrevTyper';
import { Stønadstype } from '../../../App/typer/behandlingstema';

const StyledFrittståendeBrev = styled.div`
    margin-bottom: 10rem;
    width: inherit;
`;

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Overskrift = styled(Input)`
    margin-top: 1rem;
`;

const LeggTilKnappWrapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-start;
`;

const BrevKolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

const ModalKnapper = styled.div`
    margin-top: 1rem;

    width: 70%;

    display: flex;
    justify-content: space-between;
`;

type Props = {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId?: string;
    fagsakId?: string;
    context: FritekstBrevContext;
};

const FritekstBrev: React.FC<Props> = ({
    oppdaterBrevressurs,
    behandlingId,
    fagsakId,
    context,
}) => {
    const initiellBrevtype =
        context === FritekstBrevContext.FRITTSTÅENDE
            ? FrittståendeBrevtype.INFORMASJONSBREV
            : FritekstBrevtype.VEDTAK_INVILGELSE;
    const førsteRad = [
        {
            deloverskrift: BrevtyperTilDeloverskriftTekst[initiellBrevtype],
            innhold: BrevtyperTilInnholdTekst[initiellBrevtype],
            id: uuidv4(),
        },
    ];
    const [stønadType, settStønadType] = useState<Stønadstype>(Stønadstype.OVERGANGSSTØNAD);
    const [brevType, settBrevType] = useState<FrittståendeBrevtype | FritekstBrevtype>(
        initiellBrevtype
    );
    const [overskrift, settOverskrift] = useState(BrevtyperTilOverskrift[brevType]);
    const [avsnitt, settAvsnitt] = useState<IAvsnitt[]>(førsteRad);
    const [feilmelding, settFeilmelding] = useState('');
    const [utsendingSuksess, setUtsendingSuksess] = useState(false);

    const [visModal, settVisModal] = useState<boolean>(false);
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

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
        setUtsendingSuksess(false);
    };

    const sendBrev = () => {
        setUtsendingSuksess(false);
        settFeilmelding('');
        if (!(fagsakId && stønadType)) return;

        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev/send`,
            data: {
                overskrift,
                avsnitt,
                fagsakId,
                stønadType,
                brevType,
            },
        }).then((respons: Ressurs<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                setUtsendingSuksess(true);
            } else if (
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL ||
                respons.status === RessursStatus.IKKE_TILGANG
            ) {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
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

    const lagAvsnitt = (deloverskrfit?: string, innhold?: string): IAvsnitt => ({
        deloverskrift: deloverskrfit || '',
        innhold: innhold || '',
        id: uuidv4(),
    });

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    return (
        <StyledFrittståendeBrev>
            <h1>Fritekstbrev</h1>
            <BrevKolonner>
                <StyledSelect
                    label="Stønadtype"
                    defaultValue={Stønadstype.OVERGANGSSTØNAD}
                    onChange={(e) => {
                        settStønadType(e.target.value as Stønadstype);
                    }}
                    value={stønadType}
                >
                    <option value={Stønadstype.OVERGANGSSTØNAD}>Overgangsstønad</option>
                    <option value={Stønadstype.BARNETILSYN}>Barnetilsyn</option>
                    <option value={Stønadstype.SKOLEPENGER}>Skolepenger</option>
                </StyledSelect>

                <StyledSelect
                    label="Brevtype"
                    defaultValue={FrittståendeBrevtype.INFORMASJONSBREV}
                    onChange={(e) => {
                        const nyBrevType = e.target.value as
                            | FritekstBrevtype
                            | FrittståendeBrevtype;
                        settBrevType(nyBrevType);
                        settOverskrift(BrevtyperTilOverskrift[nyBrevType]);
                        settAvsnitt(() => {
                            return [
                                lagAvsnitt(
                                    BrevtyperTilDeloverskriftTekst[nyBrevType],
                                    BrevtyperTilInnholdTekst[nyBrevType]
                                ),
                            ];
                        });
                    }}
                    value={brevType}
                >
                    {Object.values(
                        context === FritekstBrevContext.FRITTSTÅENDE
                            ? FrittståendeBrevtype
                            : FritekstBrevtype
                    ).map((brevType: FrittståendeBrevtype | FritekstBrevtype) => (
                        <option value={brevType}>{BrevtyperTilSelectNavn[brevType]}</option>
                    ))}
                </StyledSelect>
                <Overskrift
                    label="Overskrift"
                    value={overskrift}
                    onChange={(e) => {
                        settOverskrift(e.target.value);
                    }}
                />
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
                            <Textarea
                                onChange={endreInnholdAvsnitt(rad.id)}
                                defaultValue=""
                                label="Innhold"
                                id={innholdId}
                                value={rad.innhold}
                                maxLength={0}
                            />
                            <LenkeKnapp onClick={fjernRad(rad.id)}>
                                <SlettSøppelkasse withDefaultStroke={false} />
                                Slett avsnitt
                            </LenkeKnapp>
                        </Innholdsrad>
                    );
                })}

                <LeggTilKnappWrapper>
                    <LeggTilKnapp onClick={leggTilRad} knappetekst="Legg til avsnitt" />
                </LeggTilKnappWrapper>
                {fagsakId && <Hovedknapp onClick={() => settVisModal(true)}>Send brev</Hovedknapp>}
            </BrevKolonner>

            {visModal && (
                <UIModalWrapper
                    modal={{
                        tittel: 'Bekreft utsending av brev',
                        lukkKnapp: true,
                        visModal: true,
                        onClose: () => {
                            lukkModal();
                        },
                    }}
                >
                    {feilmelding && (
                        <AlertStripeFeil>Utsending feilet. {feilmelding}</AlertStripeFeil>
                    )}
                    {utsendingSuksess && (
                        <AlertStripeSuksess>Brevet er nå sendt.</AlertStripeSuksess>
                    )}
                    <ModalKnapper>
                        <Knapp onClick={lukkModal} disabled={utsendingSuksess}>
                            Avbryt
                        </Knapp>
                        <Hovedknapp onClick={sendBrev} disabled={utsendingSuksess}>
                            Send brev
                        </Hovedknapp>
                    </ModalKnapper>
                </UIModalWrapper>
            )}
        </StyledFrittståendeBrev>
    );
};

export default FritekstBrev;
