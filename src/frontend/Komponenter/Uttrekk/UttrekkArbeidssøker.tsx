import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formaterIsoMånedÅr } from '../../App/utils/formatter';
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
import { Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Adressebeskyttelse } from '../../App/typer/personopplysninger';
import UttrekkArbeidssøkerTabell from './UttrekkArbeidssøkerTabell';

const UttrekkArbeidssøkerContent = styled.div`
    padding: 1rem;
`;

export interface IUttrekkArbeidssøkere {
    årMåned: string;
    side: number;
    antallTotalt: number;
    antallKontrollert: number;
    antallManglerKontrollUtenTilgang: number;
    arbeidssøkere: IUttrekkArbeidssøker[];
}

export interface IUttrekkArbeidssøker {
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
    prevState: RessursSuksess<IUttrekkArbeidssøkere>,
    oppdatertUttrekkArbeidssøkere: IUttrekkArbeidssøker
): RessursSuksess<IUttrekkArbeidssøkere> => {
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

const UttrekkArbeidssøker: React.FC = () => {
    const { axiosRequest } = useApp();
    const [arbeidssøkere, settArbeidssøkere] = useState<Ressurs<IUttrekkArbeidssøkere>>(
        byggTomRessurs()
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visKontrollerte, settVisKontrollerte] = useState<boolean>(false);

    const hentUttrekk = useCallback(
        (visKontrollerte: boolean) => {
            return axiosRequest<IUttrekkArbeidssøkere, null>({
                method: 'GET',
                url: URL_ARBEIDSSØKER,
                params: { visKontrollerte: visKontrollerte },
            }).then((respons: RessursSuksess<IUttrekkArbeidssøkere> | RessursFeilet) =>
                settArbeidssøkere(respons)
            );
        },
        [axiosRequest]
    );

    const settKontrollert = useCallback(
        (id: string, kontrollert: boolean): void => {
            settFeilmelding(undefined);
            const kontrollertQuery = kontrollert ? '' : '?kontrollert=false';
            axiosRequest<IUttrekkArbeidssøker, null>({
                method: 'POST',
                url: `${URL_ARBEIDSSØKER}/${id}/kontrollert${kontrollertQuery}`,
            }).then((respons: RessursSuksess<IUttrekkArbeidssøker> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settArbeidssøkere((prevState) => {
                        if (prevState.status !== RessursStatus.SUKSESS) {
                            const kanIkkeSetteArbeidssøkereFeilmelding =
                                'Kan ikke oppdatere siden, last om siden på nytt';
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
        [axiosRequest, settFeilmelding]
    );

    useEffect(() => {
        hentUttrekk(visKontrollerte);
    }, [hentUttrekk, visKontrollerte]);

    const toggleVisKontrollerte = useCallback(() => {
        settVisKontrollerte((prevState) => !prevState);
    }, [settVisKontrollerte]);

    return (
        <UttrekkArbeidssøkerContent>
            <Sidetittel>Uttrekk arbeidssøkere (P43)</Sidetittel>
            {feilmelding && <div style={{ color: 'red' }}>Feilmelding: {feilmelding}</div>}
            <DataViewer response={{ arbeidssøkere }}>
                {({ arbeidssøkere }) => (
                    <UttrekkArbeidssøkerMedMetadata
                        arbeidssøkere={arbeidssøkere}
                        settKontrollert={settKontrollert}
                        visKontrollerte={visKontrollerte}
                        toggleVisKontrollerte={toggleVisKontrollerte}
                    />
                )}
            </DataViewer>
        </UttrekkArbeidssøkerContent>
    );
};

const UttrekkArbeidssøkerMedMetadata: React.FC<{
    arbeidssøkere: IUttrekkArbeidssøkere;
    settKontrollert: (id: string, kontrolllert: boolean) => void;
    visKontrollerte: boolean;
    toggleVisKontrollerte: () => void;
}> = ({ arbeidssøkere, settKontrollert, visKontrollerte, toggleVisKontrollerte }) => {
    return (
        <>
            <Systemtittel>{formaterIsoMånedÅr(arbeidssøkere.årMåned)}</Systemtittel>
            <Infoboks arbeidssøkere={arbeidssøkere} />
            <Checkbox
                label={'Vis kontrollerte'}
                onChange={() => toggleVisKontrollerte()}
                checked={visKontrollerte}
            />
            <UttrekkArbeidssøkerTabell
                arbeidssøkere={arbeidssøkere.arbeidssøkere}
                settKontrollert={settKontrollert}
            />
        </>
    );
};

const Infoboks: React.FC<{
    arbeidssøkere: IUttrekkArbeidssøkere;
}> = ({ arbeidssøkere }) => {
    const antallManglerKontroll = arbeidssøkere.antallTotalt - arbeidssøkere.antallKontrollert;
    const rødMarkertTekst = (antall: number) => (antall > 0 ? { color: 'red' } : {});
    return (
        <div>
            <div>Disse tallene blir ikke oppdatert før man laster om siden på nytt</div>
            <div>Antall totalt: {arbeidssøkere.antallTotalt}</div>
            <div style={rødMarkertTekst(antallManglerKontroll)}>
                Antall mangler kontroll: {antallManglerKontroll}
            </div>
            <div style={rødMarkertTekst(arbeidssøkere.antallManglerKontrollUtenTilgang)}>
                Antall mangler kontroll - mangler tilgang:{' '}
                {arbeidssøkere.antallManglerKontrollUtenTilgang}
            </div>
        </div>
    );
};

export default UttrekkArbeidssøker;
