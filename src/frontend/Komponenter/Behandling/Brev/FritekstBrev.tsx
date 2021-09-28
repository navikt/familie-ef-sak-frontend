import React, { useMemo, useState, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import Panel from 'nav-frontend-paneler';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IFritekstBrev, IAvsnitt } from '../../../App/typer/brev';
import { v4 as uuidv4 } from 'uuid';

const StyledFrittståendeBrev = styled.div`
    width: 50%;
    margin-bottom: 10rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
`;

const Knapper = styled.div`
    margin-top: 2rem;

    display: flex;
    justify-content: space-between;
`;

const BrevKolonner = styled.div`
    display: flex;
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
                url: `/familie-ef-sak/api/brev/frittstående`,
                data: {
                    overskrift,
                    avsnitt,
                    fagsakId,
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

    const endreAvsnitt = (e: SyntheticEvent<HTMLInputElement>) => {
        const oppdaterteAvsnitt: IAvsnitt[] = [...avsnitt];

        // @ts-ignore
        const t: keyof IAvsnitt = e.target.dataset.type;

        // @ts-ignore
        oppdaterteAvsnitt[e.target.dataset.id][t] = (e.target as HTMLInputElement).value;

        settAvsnitt(oppdaterteAvsnitt);
    };

    return (
        <StyledFrittståendeBrev>
            <h1>Frittstående brev</h1>
            <BrevKolonner>
                <div>
                    <Input
                        label="Overskrift"
                        value={overskrift}
                        onChange={(e) => {
                            settOverskrift(e.target.value);
                        }}
                    />

                    {avsnitt.map((rad, i) => {
                        const deloverskriftId = `deloverskrift-${rad.id}`;
                        const innholdId = `innhold-${rad.id}`;

                        return (
                            <Innholdsrad key={rad.id} border>
                                <Input
                                    onChange={endreAvsnitt}
                                    label="Deloverskrift (valgfri)"
                                    id={deloverskriftId}
                                    data-id={i}
                                    data-type="deloverskrift"
                                    value={rad.deloverskrift}
                                />
                                <Textarea
                                    // @ts-ignore
                                    onChange={endreAvsnitt}
                                    defaultValue=""
                                    label="Innhold"
                                    id={innholdId}
                                    data-id={i}
                                    data-type="innhold"
                                    value={rad.innhold}
                                    maxLength={0}
                                />
                            </Innholdsrad>
                        );
                    })}

                    <Knapper>
                        <Knapp onClick={leggTilRad}>Legg til nytt avsnitt </Knapp>
                        <Hovedknapp onClick={genererBrev}>Generer brev</Hovedknapp>
                    </Knapper>
                </div>
            </BrevKolonner>
        </StyledFrittståendeBrev>
    );
};

export default FritekstBrev;
