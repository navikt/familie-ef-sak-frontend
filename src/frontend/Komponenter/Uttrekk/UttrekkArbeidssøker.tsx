import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formaterIsoMånedÅr, formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PartialRecord } from '../../App/typer/common';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const UttrekkArbeidssøkerContent = styled.div`
    padding: 1rem;
`;

const StyledTable = styled.table`
    width: 60%;
    padding: 2rem;
    margin-left: 1rem;
`;

const KnappMedMargin = styled(Knapp)`
    margin-top: 0.25rem;
`;

interface UttrekkArbeidssøkere {
    årMåned: string;
    antallTotalt: number;
    antallKontrollert: number;
    arbeidssøkere: UttrekkArbeidsssøker[];
}

interface UttrekkArbeidsssøker {
    id: string;
    fagsakId: string;
    behandlingIdForVedtak: string;
    kontrollert: boolean;
    tidKontrollert?: string;
}

const URL_ARBEIDSSØKER = '/familie-ef-sak/api/uttrekk/arbeidssoker';

const settArbeidssøkereTilKontrollert = (
    prevState: RessursSuksess<UttrekkArbeidssøkere>,
    id: string
) => {
    return {
        ...prevState,
        data: {
            ...prevState.data,
            arbeidssøkere: prevState.data.arbeidssøkere.map((arbeidssøker) =>
                arbeidssøker.id === id ? { ...arbeidssøker, kontrollert: true } : arbeidssøker
            ),
        },
    };
};

const UttrekkArbeidssøker: React.FC = () => {
    const [arbeidssøkere, settArbeidssøkere] = useState<Ressurs<UttrekkArbeidssøkere>>(
        byggTomRessurs()
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest, gåTilUrl } = useApp();

    const hentUttrekk = () =>
        axiosRequest<UttrekkArbeidssøkere, null>({
            method: 'GET',
            url: URL_ARBEIDSSØKER,
        }).then((respons: RessursSuksess<UttrekkArbeidssøkere> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settArbeidssøkere(respons);
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });

    const settKontrollert = (id: string): void => {
        axiosRequest<UttrekkArbeidssøkere, null>({
            method: 'POST',
            url: `${URL_ARBEIDSSØKER}/${id}/kontrollert`,
        }).then((respons: RessursSuksess<UttrekkArbeidssøkere> | RessursFeilet) => {
            settFeilmelding(undefined);
            if (respons.status === RessursStatus.SUKSESS) {
                settArbeidssøkere((prevState) => {
                    if (prevState.status !== RessursStatus.SUKSESS) {
                        throw Error('Kan ikke oppdatere prevstate som ikke har status suksess');
                    }
                    return settArbeidssøkereTilKontrollert(prevState, id);
                });
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };

    useEffect(() => {
        hentUttrekk();
        // eslint-disable-next-line
    }, []);

    return (
        <UttrekkArbeidssøkerContent>
            <Sidetittel>Uttrekk arbeidssøkere (P43)</Sidetittel>
            <div>{feilmelding}</div>
            <DataViewer response={{ arbeidssøkere }}>
                {({ arbeidssøkere }) => (
                    <>
                        <Systemtittel>{formaterIsoMånedÅr(arbeidssøkere.årMåned)}</Systemtittel>
                        <UttrekkArbeidssøkerTabell
                            arbeidssøkere={arbeidssøkere.arbeidssøkere}
                            settKontrollert={settKontrollert}
                            gåTilUrl={gåTilUrl}
                        />
                    </>
                )}
            </DataViewer>
        </UttrekkArbeidssøkerContent>
    );
};

const TabellData: PartialRecord<keyof UttrekkArbeidsssøker, string> = {
    fagsakId: 'Fagsak',
    kontrollert: 'Kontrollert',
    tidKontrollert: 'Tid kontrollert',
};

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: UttrekkArbeidsssøker[];
    settKontrollert: (id: string) => void;
    gåTilUrl: (url: string) => void;
}> = ({ arbeidssøkere, settKontrollert, gåTilUrl }) => {
    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([_, tekst]) => (
                        <th>{tekst}</th>
                    ))}
                    <th>Sett til kontrollert</th>
                </tr>
            </thead>
            <tbody>
                {arbeidssøkere.map((arbeidssøker) => {
                    const settTilKontrollertKnapp = (
                        <KnappMedMargin
                            onClick={() => settKontrollert(arbeidssøker.id)}
                            disabled={arbeidssøker.kontrollert}
                        >
                            Sett til kontrollert
                        </KnappMedMargin>
                    );
                    return (
                        <tr key={arbeidssøker.id}>
                            <td>
                                <Lenke
                                    role={'link'}
                                    href={'#'}
                                    onClick={() => {
                                        gåTilUrl(`/fagsak/${arbeidssøker.fagsakId}`);
                                    }}
                                >
                                    <Element>{arbeidssøker.id}</Element>
                                </Lenke>
                            </td>
                            <td>{arbeidssøker.kontrollert ? 'Ja' : 'Nei'}</td>
                            <td>{formaterNullableIsoDatoTid(arbeidssøker.tidKontrollert)}</td>
                            <td>{settTilKontrollertKnapp}</td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default UttrekkArbeidssøker;
