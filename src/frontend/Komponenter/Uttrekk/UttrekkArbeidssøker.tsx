import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formaterIsoMånedÅr } from '../../App/utils/formatter';
import {
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
    prevState: IUttrekkArbeidssøkere,
    oppdatertUttrekkArbeidssøkere: IUttrekkArbeidssøker
): IUttrekkArbeidssøkere => {
    return {
        ...prevState,
        arbeidssøkere: prevState.arbeidssøkere.map((arbeidssøker) =>
            arbeidssøker.id === oppdatertUttrekkArbeidssøkere.id
                ? oppdatertUttrekkArbeidssøkere
                : arbeidssøker
        ),
    };
};

const UttrekkArbeidssøker: React.FC = () => {
    const { axiosRequest } = useApp();
    const [arbeidssøkere, settArbeidssøkere] = useState<Ressurs<IUttrekkArbeidssøkere>>(
        byggTomRessurs()
    );
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

    useEffect(() => {
        hentUttrekk(visKontrollerte);
    }, [hentUttrekk, visKontrollerte]);

    const toggleVisKontrollerte = useCallback(() => {
        settVisKontrollerte((prevState) => !prevState);
    }, [settVisKontrollerte]);

    return (
        <UttrekkArbeidssøkerContent>
            <Sidetittel>Uttrekk arbeidssøkere (P43)</Sidetittel>
            <DataViewer response={{ arbeidssøkere }}>
                {({ arbeidssøkere }) => (
                    <UttrekkArbeidssøkerMedMetadata
                        initState={arbeidssøkere}
                        visKontrollerte={visKontrollerte}
                        toggleVisKontrollerte={toggleVisKontrollerte}
                    />
                )}
            </DataViewer>
        </UttrekkArbeidssøkerContent>
    );
};

const UttrekkArbeidssøkerMedMetadata: React.FC<{
    initState: IUttrekkArbeidssøkere;
    visKontrollerte: boolean;
    toggleVisKontrollerte: () => void;
}> = ({ initState, visKontrollerte, toggleVisKontrollerte }) => {
    const { axiosRequest, gåTilUrl } = useApp();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [uttrekkArbeidssøkere, settUttrekkArbeidssøkere] =
        useState<IUttrekkArbeidssøkere>(initState);

    useEffect(() => {
        settUttrekkArbeidssøkere(initState);
    }, [settUttrekkArbeidssøkere, initState]);

    const settKontrollert = useCallback(
        (id: string, kontrollert: boolean): void => {
            settFeilmelding(undefined);
            const kontrollertQuery = kontrollert ? '' : '?kontrollert=false';
            axiosRequest<IUttrekkArbeidssøker, null>({
                method: 'POST',
                url: `${URL_ARBEIDSSØKER}/${id}/kontrollert${kontrollertQuery}`,
            }).then((respons: RessursSuksess<IUttrekkArbeidssøker> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settUttrekkArbeidssøkere((prevState) =>
                        settArbeidssøkereTilKontrollert(prevState, respons.data)
                    );
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            });
        },
        [axiosRequest, settFeilmelding]
    );

    return (
        <>
            {feilmelding && <div style={{ color: 'red' }}>Feilmelding: {feilmelding}</div>}
            <Systemtittel>{formaterIsoMånedÅr(uttrekkArbeidssøkere.årMåned)}</Systemtittel>
            <Infoboks uttrekkArbeidssøkere={uttrekkArbeidssøkere} />
            <Checkbox
                label={'Vis kontrollerte'}
                onChange={() => toggleVisKontrollerte()}
                checked={visKontrollerte}
            />
            <UttrekkArbeidssøkerTabell
                arbeidssøkere={uttrekkArbeidssøkere.arbeidssøkere}
                settKontrollert={settKontrollert}
                gåTilUrl={gåTilUrl}
            />
        </>
    );
};

const Infoboks: React.FC<{
    uttrekkArbeidssøkere: IUttrekkArbeidssøkere;
}> = ({ uttrekkArbeidssøkere }) => {
    const antallManglerKontroll =
        uttrekkArbeidssøkere.antallTotalt - uttrekkArbeidssøkere.antallKontrollert;
    const rødMarkertTekst = (antall: number) => (antall > 0 ? { color: 'red' } : {});
    return (
        <div>
            <div>Disse tallene blir ikke oppdatert før man laster om siden på nytt</div>
            <div>Antall totalt: {uttrekkArbeidssøkere.antallTotalt}</div>
            <div style={rødMarkertTekst(antallManglerKontroll)}>
                Antall mangler kontroll: {antallManglerKontroll}
            </div>
            <div style={rødMarkertTekst(uttrekkArbeidssøkere.antallManglerKontrollUtenTilgang)}>
                Antall mangler kontroll - mangler tilgang:{' '}
                {uttrekkArbeidssøkere.antallManglerKontrollUtenTilgang}
            </div>
        </div>
    );
};

export default UttrekkArbeidssøker;
