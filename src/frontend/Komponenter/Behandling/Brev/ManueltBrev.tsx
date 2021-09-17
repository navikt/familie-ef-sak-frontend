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

const VenstreKolonne = styled.div``;

interface Props {
    fagsakId: string;
}

const ManueltBrev = ({ fagsakId }: Props) => {
    const førsteRad = [
        {
            id: 1,
            deloverskrift: '',
            innhold: '',
        },
    ];

    const [overskrift, settOverskrift] = useState('');
    const [avsnitt, settAvsnitt] = useState(førsteRad);
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

        const avsnittUtenId = avsnitt.map((rad) => {
            return { deloverskrift: rad.deloverskrift, innhold: rad.innhold };
        });

        const brevdato = dagensDatoFormatert();

        axiosRequest<
            any,
            {
                overskrift: string;
                avsnitt: any;
                saksbehandlersignatur: string;
                brevdato: string;
                ident: string;
                navn: string;
            }
        >({
            method: 'POST',
            url: `/familie-ef-sak/api/manueltbrev`,
            data: {
                overskrift,
                avsnitt: avsnittUtenId,
                saksbehandlersignatur: innloggetSaksbehandler?.displayName || 'Ukjent',
                brevdato: brevdato,
                ident: personopplysninger.data.personIdent,
                navn: personopplysninger.data.navn.visningsnavn,
            },
        }).then((respons: Ressurs<string>) => {
            settBrev(respons);
        });
    };

    const leggTilRad = () => {
        settAvsnitt((s: any) => {
            return [
                ...s,
                {
                    deloverskrift: '',
                    innhold: '',
                },
            ];
        });
    };

    const endreDeloverskrift = (e: any) => {
        e.preventDefault();

        const index = e.target.id;

        settAvsnitt((s) => {
            const newArr = s.slice();
            newArr[index].deloverskrift = e.target.value;

            return newArr;
        });
    };

    const endreInnhold = (e: any) => {
        e.preventDefault();

        const index = e.target.id;

        settAvsnitt((s) => {
            const newArr = s.slice();
            newArr[index].innhold = e.target.value;

            return newArr;
        });
    };

    return (
        <StyledManueltBrev>
            <h1>Manuelt brev</h1>
            <BrevKolonner>
                <VenstreKolonne>
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
                </VenstreKolonne>

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
