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
import { Adressebeskyttelse } from '../../App/typer/personopplysninger';
import UttrekkArbeidssøkerTabell from './UttrekkArbeidssøkerTabell';
import { Checkbox, Heading } from '@navikt/ds-react';

const Container = styled.div`
    padding: 1rem;
`;

interface UttrekkArbeidssøkere {
    årMåned: string;
    side: number;
    antallTotalt: number;
    antallKontrollert: number;
    antallManglerKontrollUtenTilgang: number;
    arbeidssøkere: UttrekkArbeidssøker[];
}

export interface UttrekkArbeidssøker {
    id: string;
    fagsakId: string;
    behandlingIdForVedtak: string;
    personIdent: string;
    navn: string;
    registrertArbeidssøker?: boolean;
    adressebeskyttelse?: Adressebeskyttelse;
    kontrollert: boolean;
    kontrollertTid?: string;
    kontrollertAv?: string;
}

const URL_ARBEIDSSØKER = '/familie-ef-sak/api/uttrekk/arbeidssoker';

export const UttrekkArbeidssøkerSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const [arbeidssøkere, settArbeidssøkere] =
        useState<Ressurs<UttrekkArbeidssøkere>>(byggTomRessurs());
    const [feilmelding, settFeilmelding] = useState<string>();
    const [visKontrollerte, settVisKontrollerte] = useState<boolean>(false);

    const hentUttrekk = useCallback(
        (visKontrollerte: boolean) => {
            return axiosRequest<UttrekkArbeidssøkere, null>({
                method: 'GET',
                url: URL_ARBEIDSSØKER,
                params: { visKontrollerte: visKontrollerte },
            }).then((respons: RessursSuksess<UttrekkArbeidssøkere> | RessursFeilet) =>
                settArbeidssøkere(respons)
            );
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

    useEffect(() => {
        document.title = 'Uttrekk arbeidssøkere';
    }, []);

    return (
        <Container>
            <Heading size={'large'} level={'1'}>
                Uttrekk arbeidssøkere
            </Heading>
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
        </Container>
    );
};

const UttrekkArbeidssøkerMedMetadata: React.FC<{
    arbeidssøkere: UttrekkArbeidssøkere;
    settKontrollert: (id: string, kontrolllert: boolean) => void;
    visKontrollerte: boolean;
    toggleVisKontrollerte: () => void;
}> = ({ arbeidssøkere, settKontrollert, visKontrollerte, toggleVisKontrollerte }) => {
    return (
        <>
            <Heading size={'small'} level={'3'}>
                {formaterIsoMånedÅr(arbeidssøkere.årMåned)}
            </Heading>
            <Infoboks arbeidssøkere={arbeidssøkere} />
            <Checkbox onChange={() => toggleVisKontrollerte()} checked={visKontrollerte}>
                Vis kontrollerte
            </Checkbox>
            <UttrekkArbeidssøkerTabell
                arbeidssøkere={arbeidssøkere.arbeidssøkere}
                settKontrollert={settKontrollert}
            />
        </>
    );
};

/**
 * Brukes for å ikke laste all data på nytt i det att man endrer til/sletter kontrollert
 */
const settArbeidssøkereTilKontrollert = (
    prevState: RessursSuksess<UttrekkArbeidssøkere>,
    oppdatertUttrekkArbeidssøkere: UttrekkArbeidssøker
): RessursSuksess<UttrekkArbeidssøkere> => {
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

const Infoboks: React.FC<{
    arbeidssøkere: UttrekkArbeidssøkere;
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
