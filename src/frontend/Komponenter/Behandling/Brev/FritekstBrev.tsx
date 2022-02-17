import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { useDebouncedCallback } from 'use-debounce';
import {
    AvsnittMedId,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IFritekstBrev,
    IMellomlagretBrevFritekst,
} from './BrevTyper';
import {
    flyttAvsnittNedover,
    flyttAvsnittOppover,
    initielleAvsnittMellomlager,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
} from './BrevUtils';
import BrevInnhold from './BrevInnhold';

const StyledBrev = styled.div`
    margin-bottom: 10rem;
    width: inherit;
`;

type Props = {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    mellomlagretFritekstbrev?: IMellomlagretBrevFritekst;
};

const FritekstBrev: React.FC<Props> = ({
    oppdaterBrevressurs,
    behandlingId,
    mellomlagretFritekstbrev,
}) => {
    const [brevType, settBrevType] = useState<FritekstBrevtype | undefined>(
        mellomlagretFritekstbrev?.brevType
    );
    const [overskrift, settOverskrift] = useState(
        (mellomlagretFritekstbrev && mellomlagretFritekstbrev?.brev?.overskrift) || ''
    );
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>(
        initielleAvsnittMellomlager(mellomlagretFritekstbrev?.brev)
    );

    const { axiosRequest } = useApp();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/behandling/${behandlingId}`,
        }),
        [behandlingId]
    );

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FritekstBrevtype);
    };

    const endreOverskrift = (nyOverskrift: string) => {
        settOverskrift(nyOverskrift);
    };

    const endreAvsnitt = (nyttAvsnitt: AvsnittMedId[]) => {
        settAvsnitt(nyttAvsnitt);
    };

    const oppdaterFlyttAvsnittOppover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittOppover(avsnittId, avsnitt));
    };

    const oppdaterFlyttAvsnittNedover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittNedover(avsnittId, avsnitt));
    };

    const oppdaterLeggTilAvsnittFørst = () => {
        settAvsnitt(leggTilAvsnittFørst(avsnitt));
    };

    const oppdaterLeggAvsnittBakSisteSynligeAvsnitt = () => {
        settAvsnitt(leggAvsnittBakSisteSynligeAvsnitt(avsnitt));
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

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const mellomlagreFritekstbrev = (brev: IFritekstBrev): void => {
        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/mellomlager/fritekst`,
            data: brev,
        });
    };

    const genererBrev = () => {
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;
        if (!brevType) return;

        const brev: IFritekstBrev = {
            overskrift: overskrift,
            avsnitt: avsnitt,
            behandlingId: behandlingId,
            brevType: brevType,
        };
        mellomlagreFritekstbrev(brev);
        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/fritekst`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
        });
    };

    const fjernRad = (radId: string) => {
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) => {
            return eksisterendeAvsnitt.filter((rad) => radId !== rad.id);
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
                leggTilAvsnittFørst={oppdaterLeggTilAvsnittFørst}
                leggAvsnittBakSisteSynligeAvsnitt={oppdaterLeggAvsnittBakSisteSynligeAvsnitt}
                flyttAvsnittOpp={oppdaterFlyttAvsnittOppover}
                flyttAvsnittNed={oppdaterFlyttAvsnittNedover}
                context={FritekstBrevContext.BEHANDLING}
            />
        </StyledBrev>
    );
};

export default FritekstBrev;
