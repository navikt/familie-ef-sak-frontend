import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import Panel from 'nav-frontend-paneler';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { dagensDatoFormatert } from '../../../App/utils/formatter';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IManueltBrev, IAvsnitt } from '../../../App/typer/brev';

const StyledManueltBrev = styled.div`
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

const BrevWrapper = styled.div`
    margin-left: 4rem;
`;

interface Props {
    fagsakId: string;
}

const ManueltBrev: React.FC<Props> = ({ fagsakId }) => {
    const førsteRad = [
        {
            deloverskrift: '',
            innhold: '',
        },
    ];

    const [overskrift, settOverskrift] = useState('');
    const [avsnitt, settAvsnitt] = useState<IAvsnitt[]>(førsteRad);
    const [brev, settBrev] = useState<Ressurs<string>>(byggTomRessurs());
    const { axiosRequest, innloggetSaksbehandler } = useApp();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const genererBrev = () => {
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;

        const brevdato = dagensDatoFormatert();

        axiosRequest<string, IManueltBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/manueltbrev`,
            data: {
                overskrift,
                avsnitt,
                saksbehandlersignatur: innloggetSaksbehandler?.displayName || 'Ukjent',
                brevdato,
                ident: personopplysninger.data.personIdent,
                navn: personopplysninger.data.navn.visningsnavn,
            },
        }).then((respons: Ressurs<string>) => {
            settBrev(respons);
        });
    };

    const leggTilRad = () => {
        settAvsnitt((eksisterendeAvsnitt: IAvsnitt[]) => {
            return [
                ...eksisterendeAvsnitt,
                {
                    deloverskrift: '',
                    innhold: '',
                },
            ];
        });
    };

    const endreDeloverskrift = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const index = parseInt(e.target.id, 10);

        settAvsnitt((eksisterendeAvsnitt: IAvsnitt[]) => {
            const oppdatertAvsnitt = eksisterendeAvsnitt.slice();

            oppdatertAvsnitt[index].deloverskrift = e.target.value;

            return oppdatertAvsnitt;
        });
    };

    const endreInnhold = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const index = parseInt(e.target.id, 10);

        settAvsnitt((eksisterendeAvsnitt: IAvsnitt[]) => {
            const oppdatertAvsnitt = eksisterendeAvsnitt.slice();

            oppdatertAvsnitt[index].innhold = e.target.value;

            return oppdatertAvsnitt;
        });
    };

    return (
        <StyledManueltBrev>
            <h1>Manuelt brev</h1>
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
                        return (
                            <Innholdsrad border>
                                <Input
                                    onChange={endreDeloverskrift}
                                    label="Deloverskrift (valgfri)"
                                    id={i.toString()}
                                    value={rad.deloverskrift}
                                />
                                <Textarea
                                    onChange={endreInnhold}
                                    defaultValue=""
                                    label="Innhold"
                                    id={i.toString()}
                                    value={rad.innhold}
                                />
                            </Innholdsrad>
                        );
                    })}

                    <Knapper>
                        <Knapp onClick={leggTilRad}>Legg til nytt avsnitt </Knapp>
                        <Hovedknapp onClick={genererBrev}>Generer brev</Hovedknapp>
                    </Knapper>
                </div>

                {brev && (
                    <BrevWrapper>
                        <PdfVisning pdfFilInnhold={brev} />
                    </BrevWrapper>
                )}
            </BrevKolonner>
        </StyledManueltBrev>
    );
};

export default ManueltBrev;
