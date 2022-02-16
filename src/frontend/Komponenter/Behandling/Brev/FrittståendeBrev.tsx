import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { useDebouncedCallback } from 'use-debounce';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import {
    AvsnittMedId,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IFrittståendeBrev,
} from './BrevTyper';
import {
    initielleAvsnittMellomlager,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
} from './BrevUtils';
import BrevInnhold from './BrevInnhold';

const StyledBrev = styled.div`
    margin-bottom: 10rem;
    width: inherit;
`;

const ModalKnapper = styled.div`
    margin-top: 1rem;
    width: 70%;
    display: flex;
    justify-content: space-between;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-top: 1rem;
`;

type Props = {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    fagsakId: string;
    mellomlagretFrittståendeBrev?: IFrittståendeBrev;
};

const FrittståendeBrev: React.FC<Props> = ({
    oppdaterBrevressurs,
    fagsakId,
    mellomlagretFrittståendeBrev,
}) => {
    const [brevType, settBrevType] = useState<FrittståendeBrevtype | undefined>(
        mellomlagretFrittståendeBrev && mellomlagretFrittståendeBrev.brevType
    );
    const [overskrift, settOverskrift] = useState(
        (mellomlagretFrittståendeBrev && mellomlagretFrittståendeBrev.overskrift) || ''
    );
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>(
        initielleAvsnittMellomlager(mellomlagretFrittståendeBrev)
    );
    const [feilmelding, settFeilmelding] = useState('');
    const [utsendingSuksess, setUtsendingSuksess] = useState(false);
    const [senderInnBrev, settSenderInnBrev] = useState(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest } = useApp();

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FrittståendeBrevtype);
    };

    const endreOverskrift = (nyOverskrift: string) => {
        settOverskrift(nyOverskrift);
    };

    const endreAvsnitt = (nyttAvsnitt: AvsnittMedId[]) => {
        settAvsnitt(nyttAvsnitt);
    };

    const oppdaterLeggTilAvsnittForan = () => {
        settAvsnitt(leggTilAvsnittFørst(avsnitt));
    };

    const oppdaterLeggAvsnittBakSisteSynligeAvsnitt = () => {
        settAvsnitt(leggAvsnittBakSisteSynligeAvsnitt(avsnitt));
    };

    const endreDeloverskriftAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, deloverskrift: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const endreInnholdAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLTextAreaElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, innhold: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const fjernRad = (radId: string) => {
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) => {
            return eksisterendeAvsnitt.filter((rad) => radId !== rad.id);
        });
    };

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const mellomlagreFrittståendeBrev = (brev: IFrittståendeBrev): void => {
        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/mellomlager/frittstaende`,
            data: brev,
        });
    };

    const genererBrev = () => {
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;
        if (!brevType) return;

        const brev: IFrittståendeBrev = {
            overskrift,
            avsnitt,
            fagsakId: fagsakId as string,
            brevType: brevType as FrittståendeBrevtype,
        };
        mellomlagreFrittståendeBrev(brev);
        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
        setUtsendingSuksess(false);
    };

    const nulstillBrev = () => {
        settAvsnitt([]);
        settOverskrift('');
        settBrevType(FrittståendeBrevtype.INFORMASJONSBREV);
    };

    const sendBrev = () => {
        if (senderInnBrev) return;
        if (!brevType) return;
        if (!fagsakId) return;
        settSenderInnBrev(true);
        setUtsendingSuksess(false);
        settFeilmelding('');

        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev/send`,
            data: {
                overskrift,
                avsnitt,
                fagsakId,
                brevType,
            } as IFrittståendeBrev,
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                setUtsendingSuksess(true);
                nulstillBrev();
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
            settSenderInnBrev(false);
        });
    };

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    return (
        <StyledBrev>
            <h1>Fritekstbrev for overgangsstønad</h1>
            <BrevInnhold
                brevType={brevType}
                endreBrevType={endreBrevType}
                overskrift={overskrift}
                endreOverskrift={endreOverskrift}
                avsnitt={avsnitt}
                endreAvsnitt={endreAvsnitt}
                endreDeloverskriftAvsnitt={endreDeloverskriftAvsnitt}
                endreInnholdAvsnitt={endreInnholdAvsnitt}
                fjernRad={fjernRad}
                leggTilAvsnittForan={oppdaterLeggTilAvsnittForan}
                leggAvsnittBakSisteSynligeAvsnitt={oppdaterLeggAvsnittBakSisteSynligeAvsnitt}
                context={FritekstBrevContext.FRITTSTÅENDE}
            />
            <StyledHovedKnapp disabled={!brevType} onClick={() => settVisModal(true)}>
                Send brev
            </StyledHovedKnapp>
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
                        <Hovedknapp onClick={sendBrev} disabled={senderInnBrev || utsendingSuksess}>
                            Send brev
                        </Hovedknapp>
                    </ModalKnapper>
                </UIModalWrapper>
            )}
        </StyledBrev>
    );
};

export default FrittståendeBrev;
