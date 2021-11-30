import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formaterIsoMånedÅr, formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import {
    byggFeiletRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PartialRecord } from '../../App/typer/common';
import { Element, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Pagination from 'paginering';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { Checkbox } from 'nav-frontend-skjema';

const UttrekkArbeidssøkerContent = styled.div`
    padding: 1rem;
`;

const StyledTable = styled.table`
    width: 60%;
    padding: 2rem;
    margin-left: 1rem;
`;

const StyledPagination = styled(Pagination)`
    padding: 1rem;
`;

interface UttrekkArbeidssøkere {
    årMåned: string;
    side: number;
    antallTotalt: number;
    antallKontrollert: number;
    arbeidssøkere: UttrekkArbeidsssøker[];
}

interface UttrekkArbeidsssøker {
    id: string;
    fagsakId: string;
    behandlingIdForVedtak: string;
    kontrollert: boolean;
    kontrollertTid?: string;
    kontrollertAv?: string;
}

const URL_ARBEIDSSØKER = '/familie-ef-sak/api/uttrekk/arbeidssoker';

const settArbeidssøkereTilKontrollert = (
    prevState: RessursSuksess<UttrekkArbeidssøkere>,
    id: string,
    kontrollert: boolean
) => {
    return {
        ...prevState,
        data: {
            ...prevState.data,
            arbeidssøkere: prevState.data.arbeidssøkere.map((arbeidssøker) =>
                arbeidssøker.id === id ? { ...arbeidssøker, kontrollert } : arbeidssøker
            ),
        },
    };
};

const ANTALL_PER_SIDE = 20;
const QUERY_PARAM_SIDE = 'side';
const QUERY_PARAM_KONTROLLERTE = 'kontrollerte';

const UttrekkArbeidssøker: React.FC = () => {
    const query = useQueryParams();
    const history = useHistory();

    const side = query.get(QUERY_PARAM_SIDE) || 1;
    const visKontrollerte = query.get(QUERY_PARAM_KONTROLLERTE) === 'true';

    const [arbeidssøkere, settArbeidssøkere] = useState<Ressurs<UttrekkArbeidssøkere>>(
        byggTomRessurs()
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest, gåTilUrl } = useApp();

    const hentUttrekk = useCallback(
        (side, visKontrollerte: boolean) => {
            return axiosRequest<UttrekkArbeidssøkere, null>({
                method: 'GET',
                url: URL_ARBEIDSSØKER,
                params: {
                    side,
                    visKontrollerte,
                },
            }).then((respons: RessursSuksess<UttrekkArbeidssøkere> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settArbeidssøkere(respons);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    const settKontrollert = useCallback(
        (id: string, kontrollert: boolean): void => {
            settFeilmelding(undefined);
            const kontrollertQuery = kontrollert ? '' : '?kontrollert=false';
            axiosRequest<UttrekkArbeidssøkere, null>({
                method: 'POST',
                url: `${URL_ARBEIDSSØKER}/${id}/kontrollert${kontrollertQuery}`,
            }).then((respons: RessursSuksess<UttrekkArbeidssøkere> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settArbeidssøkere((prevState) => {
                        if (prevState.status !== RessursStatus.SUKSESS) {
                            const kanIkkeSetteArbeidssøkereFeilmelding =
                                'Kan ikke oppdatere siden, last om siden på nytt';
                            settFeilmelding(kanIkkeSetteArbeidssøkereFeilmelding);
                            return byggFeiletRessurs(kanIkkeSetteArbeidssøkereFeilmelding);
                        } else {
                            return settArbeidssøkereTilKontrollert(prevState, id, kontrollert);
                        }
                    });
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        hentUttrekk(side, visKontrollerte);
    }, [hentUttrekk, side, visKontrollerte]);

    return (
        <UttrekkArbeidssøkerContent>
            <Sidetittel>Uttrekk arbeidssøkere (P43)</Sidetittel>
            <div>{feilmelding}</div>
            <DataViewer response={{ arbeidssøkere }}>
                {({ arbeidssøkere }) => (
                    <>
                        <Systemtittel>{formaterIsoMånedÅr(arbeidssøkere.årMåned)}</Systemtittel>
                        <Checkbox
                            label={'Vis kontrollerte'}
                            onChange={() => {
                                query.set(QUERY_PARAM_KONTROLLERTE, String(!visKontrollerte));
                                query.set(QUERY_PARAM_SIDE, String(1));
                                history.push(`${window.location.pathname}?${query.toString()}`);
                            }}
                            checked={visKontrollerte}
                        />
                        <UttrekkArbeidssøkerTabell
                            arbeidssøkere={arbeidssøkere.arbeidssøkere}
                            settKontrollert={settKontrollert}
                            gåTilUrl={gåTilUrl}
                        />
                        <StyledPagination
                            numberOfItems={arbeidssøkere.antallTotalt}
                            onChange={(side: number) => {
                                query.set(QUERY_PARAM_SIDE, String(side));
                                history.push(`${window.location.pathname}?${query.toString()}`);
                            }}
                            itemsPerPage={ANTALL_PER_SIDE}
                            currentPage={arbeidssøkere.side}
                        />
                    </>
                )}
            </DataViewer>
        </UttrekkArbeidssøkerContent>
    );
};

const TabellData: PartialRecord<keyof UttrekkArbeidsssøker, string> = {
    fagsakId: 'Fagsak',
    kontrollertTid: 'Tid kontrollert',
    kontrollertAv: 'Kontrollert av',
    kontrollert: 'Kontrollert',
};

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: UttrekkArbeidsssøker[];
    settKontrollert: (id: string, kontrollert: boolean) => void;
    gåTilUrl: (url: string) => void;
}> = ({ arbeidssøkere, settKontrollert, gåTilUrl }) => {
    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([field, tekst]) => (
                        <th key={field}>{tekst}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {arbeidssøkere.map((arbeidssøker) => {
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
                            <td>{formaterNullableIsoDatoTid(arbeidssøker.kontrollertTid)}</td>
                            <td>{arbeidssøker.kontrollertAv}</td>
                            <td>
                                <Checkbox
                                    label={<span>&nbsp;</span>} // hack for å ikke vise noen tekst, men beholde styling
                                    onChange={() =>
                                        settKontrollert(arbeidssøker.id, !arbeidssøker.kontrollert)
                                    }
                                    checked={arbeidssøker.kontrollert}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default UttrekkArbeidssøker;
