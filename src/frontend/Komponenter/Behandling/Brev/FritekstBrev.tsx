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
    FrittståendeBrevStønadOgBrevType,
    FrittståendeBrevStønadType,
    FrittståendeBrevType,
    IAvsnitt,
    IFritekstBrev,
    IFrittståendeBrev,
} from './BrevTyper';

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
};

const FritekstBrev: React.FC<Props> = ({ oppdaterBrevressurs, behandlingId, fagsakId }) => {
    const førsteRad = [
        {
            deloverskrift: '',
            innhold: '',
            id: uuidv4(),
        },
    ];

    const infobrevTittel = 'Vi vil informere deg om...';
    const mangelbrevTittel = 'Vi trenger mer informasjon fra deg';

    const [stønadType, settStønadType] = useState<FrittståendeBrevStønadType>(
        FrittståendeBrevStønadType.OVERGANGSSTØNAD
    );
    const [brevType, settBrevType] = useState<FrittståendeBrevType>(FrittståendeBrevType.INFOBREV);

    const [stønadOgBrevType, settStønadOgBrevType] = useState<FrittståendeBrevStønadOgBrevType>();

    const [overskrift, settOverskrift] = useState(infobrevTittel);
    const [avsnitt, settAvsnitt] = useState<IAvsnitt[]>(førsteRad);
    const [feilmelding, settFeilmelding] = useState('');
    const [utsendingSuksess, setUtsendingSuksess] = useState(false);

    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (!(stønadType && brevType)) return;

        const stønadOgBrev = `${brevType}_${stønadType}` as FrittståendeBrevStønadOgBrevType;

        settStønadOgBrevType(stønadOgBrev);
    }, [stønadType, brevType]);

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
                    brevType: stønadOgBrevType,
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
        if (!(fagsakId && stønadType && stønadOgBrevType)) return;

        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev/send`,
            data: {
                overskrift,
                avsnitt,
                fagsakId,
                stønadType,
                brevType: stønadOgBrevType,
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

    const forhåndsfyllBrevoverskrift = (brevType: FrittståendeBrevType) => {
        switch (brevType) {
            case FrittståendeBrevType.MANGELBREV:
                if (overskrift === infobrevTittel || overskrift === '')
                    settOverskrift(mangelbrevTittel);
                break;
            case FrittståendeBrevType.INFOBREV:
                if (overskrift === mangelbrevTittel || overskrift === '')
                    settOverskrift(infobrevTittel);
                break;
        }
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
            <h1>Fritekstbrev</h1>
            <BrevKolonner>
                <StyledSelect
                    label="Stønadtype"
                    defaultValue={FrittståendeBrevStønadType.OVERGANGSSTØNAD}
                    onChange={(e) => {
                        settStønadType(e.target.value as FrittståendeBrevStønadType);
                    }}
                    value={stønadType}
                >
                    <option value={FrittståendeBrevStønadType.OVERGANGSSTØNAD}>
                        Overgangsstønad
                    </option>
                    <option value={FrittståendeBrevStønadType.BARNETILSYN}>Barnetilsyn</option>
                    <option value={FrittståendeBrevStønadType.SKOLEPENGER}>Skolepenger</option>
                </StyledSelect>

                <StyledSelect
                    label="Brevtype"
                    defaultValue={FrittståendeBrevType.INFOBREV}
                    onChange={(e) => {
                        const nyBrevType = e.target.value as FrittståendeBrevType;
                        settBrevType(nyBrevType);
                        forhåndsfyllBrevoverskrift(nyBrevType);
                    }}
                    value={brevType}
                >
                    <option value={FrittståendeBrevType.INFOBREV}>Infobrev</option>
                    <option value={FrittståendeBrevType.MANGELBREV}>Mangelbrev</option>
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
