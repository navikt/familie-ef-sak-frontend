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
import { Element, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { Checkbox } from 'nav-frontend-skjema';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import AdressebeskyttelseVarsel from '../../Felles/Varsel/AdressebeskyttelseVarsel';
import { Adressebeskyttelse } from '../../App/typer/personopplysninger';

const UttrekkArbeidssøkerContent = styled.div`
    padding: 1rem;
`;

const StyledTable = styled.table`
    width: 70%;
    padding: 2rem;
    margin-left: 1rem;
    td {
        padding: 0.75rem;
    }
`;

interface UttrekkArbeidssøkere {
    årMåned: string;
    side: number;
    antallTotalt: number;
    antallKontrollert: number;
    antallManglerTilgang: number;
    arbeidssøkere: UttrekkArbeidssøker[];
}

interface UttrekkArbeidssøker {
    id: string;
    fagsakId: string;
    behandlingIdForVedtak: string;
    personIdent: string;
    navn: string;
    adressebeskyttelse?: Adressebeskyttelse;
    kontrollert: boolean;
    kontrollertTid?: string;
    kontrollertAv?: string;
}

const URL_ARBEIDSSØKER = '/familie-ef-sak/api/uttrekk/arbeidssoker';

/**
 * Brukes for å ikke laste all data på nytt i det att man endrer til/sletter kontrollert
 */
const settArbeidssøkereTilKontrollert = (
    prevState: RessursSuksess<UttrekkArbeidssøkere>,
    oppdatertUttrekkArbeidssøkere: UttrekkArbeidssøker
) => {
    return {
        ...prevState,
        data: {
            ...prevState.data,
            arbeidssøkere: prevState.data.arbeidssøkere.map((arbeidssøker) =>
                arbeidssøker.id === oppdatertUttrekkArbeidssøkere.id
                    ? oppdatertUttrekkArbeidssøkere
                    : arbeidssøker
            ),
        },
    };
};

const QUERY_PARAM_KONTROLLERTE = 'kontrollerte';

const UttrekkArbeidssøker: React.FC = () => {
    const query = useQueryParams();
    const history = useHistory();

    const visKontrollerte = query.get(QUERY_PARAM_KONTROLLERTE) === 'true';

    const [arbeidssøkere, settArbeidssøkere] = useState<Ressurs<UttrekkArbeidssøkere>>(
        byggTomRessurs()
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest, gåTilUrl } = useApp();

    const hentUttrekk = useCallback(
        (visKontrollerte: boolean) => {
            return axiosRequest<UttrekkArbeidssøkere, null>({
                method: 'GET',
                url: URL_ARBEIDSSØKER,
                params: {
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
            axiosRequest<UttrekkArbeidssøker, null>({
                method: 'POST',
                url: `${URL_ARBEIDSSØKER}/${id}/kontrollert${kontrollertQuery}`,
            }).then((respons: RessursSuksess<UttrekkArbeidssøker> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settArbeidssøkere((prevState) => {
                        if (prevState.status !== RessursStatus.SUKSESS) {
                            const kanIkkeSetteArbeidssøkereFeilmelding =
                                'Kan ikke oppdatere siden, last om siden på nytt';
                            settFeilmelding(kanIkkeSetteArbeidssøkereFeilmelding);
                            return byggFeiletRessurs(kanIkkeSetteArbeidssøkereFeilmelding);
                        } else {
                            return settArbeidssøkereTilKontrollert(prevState, respons.data);
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
        hentUttrekk(visKontrollerte);
    }, [hentUttrekk, visKontrollerte]);

    return (
        <UttrekkArbeidssøkerContent>
            <Sidetittel>Uttrekk arbeidssøkere (P43)</Sidetittel>
            <div>{feilmelding}</div>
            <DataViewer response={{ arbeidssøkere }}>
                {({ arbeidssøkere }) => {
                    return (
                        <>
                            <Systemtittel>{formaterIsoMånedÅr(arbeidssøkere.årMåned)}</Systemtittel>
                            <Infoboks
                                visKontrollerte={visKontrollerte}
                                arbeidssøkere={arbeidssøkere}
                            />
                            <Checkbox
                                label={'Vis kontrollerte'}
                                onChange={() => {
                                    query.set(QUERY_PARAM_KONTROLLERTE, String(!visKontrollerte));
                                    history.push(`${window.location.pathname}?${query.toString()}`);
                                }}
                                checked={visKontrollerte}
                            />
                            <UttrekkArbeidssøkerTabell
                                arbeidssøkere={arbeidssøkere.arbeidssøkere}
                                settKontrollert={settKontrollert}
                                gåTilUrl={gåTilUrl}
                            />
                        </>
                    );
                }}
            </DataViewer>
        </UttrekkArbeidssøkerContent>
    );
};

const Infoboks: React.FC<{ visKontrollerte: boolean; arbeidssøkere: UttrekkArbeidssøkere }> = ({
    visKontrollerte,
    arbeidssøkere,
}) => {
    const antallTotalt = visKontrollerte
        ? arbeidssøkere.antallTotalt
        : arbeidssøkere.antallTotalt + arbeidssøkere.antallKontrollert;
    const antallManglerKontroll = antallTotalt - arbeidssøkere.antallKontrollert;
    const rødMarkertTekst = arbeidssøkere.antallManglerTilgang > 0 ? { color: 'red' } : {};
    return (
        <div>
            <div>Disse tallene blir ikke oppdatert før man laster om siden på nytt</div>
            <div>Antall mangler kontroll: {antallManglerKontroll}</div>
            <div style={rødMarkertTekst}>
                Antall mangler tilgang: {arbeidssøkere.antallManglerTilgang}
            </div>
        </div>
    );
};

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: UttrekkArbeidssøker[];
    settKontrollert: (id: string, kontrollert: boolean) => void;
    gåTilUrl: (url: string) => void;
}> = ({ arbeidssøkere, settKontrollert, gåTilUrl }) => {
    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    <th>Person</th>
                    <th>Kontrollert</th>
                </tr>
            </thead>
            <tbody>
                {arbeidssøkere.map((arbeidssøker) => {
                    return (
                        <tr key={arbeidssøker.id}>
                            <td>
                                <div style={{ display: 'flex' }}>
                                    <Lenke
                                        role={'link'}
                                        href={'#'}
                                        onClick={() => {
                                            gåTilUrl(`/fagsak/${arbeidssøker.fagsakId}`);
                                        }}
                                        style={{ marginRight: '1rem' }}
                                    >
                                        <Element>{arbeidssøker.navn}</Element>
                                    </Lenke>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={arbeidssøker.personIdent}
                                    />
                                    {arbeidssøker.adressebeskyttelse && (
                                        <AdressebeskyttelseVarsel
                                            adressebeskyttelse={arbeidssøker.adressebeskyttelse}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                {!arbeidssøker.kontrollert ? (
                                    <Knapp
                                        onClick={() =>
                                            settKontrollert(
                                                arbeidssøker.id,
                                                !arbeidssøker.kontrollert
                                            )
                                        }
                                    >
                                        Sett kontrollert
                                    </Knapp>
                                ) : (
                                    <>
                                        {formaterNullableIsoDatoTid(arbeidssøker.kontrollertTid)} (
                                        {arbeidssøker.kontrollertAv})
                                        <Flatknapp
                                            mini
                                            style={{ marginLeft: '1rem' }}
                                            onClick={() =>
                                                settKontrollert(
                                                    arbeidssøker.id,
                                                    !arbeidssøker.kontrollert
                                                )
                                            }
                                        >
                                            Tilbakestill
                                        </Flatknapp>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default UttrekkArbeidssøker;
