import React from 'react';
import { RessursStatus, RessursSuksess } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { OppgaveResurs } from '../../sider/Oppgavebenk';

interface IOppgave {
    id: number;
    identer: any[];
    tildeltEnhetsnr?: string;
    endretAvEnhetsnr?: string;
    eksisterendeOppgaveId?: string;
    opprettetAvEnhetsnr?: string;
    journalpostId?: string;
    journalpostkilde?: string;
    behandlesAvApplikasjon?: string;
    saksreferanse?: string;
    bnr?: string;
    samhandlernr?: string;
    aktoerId?: string;
    orgnr?: string;
    tilordnetRessurs?: string;
    beskrivelse?: string;
    temagruppe?: string;
    tema?: string; // TEMA???
    behandlingstema?: string;
    oppgavetype?: string;
    behandlingstype?: string;
    versjon?: number;
    mappeId?: string;
    fristFerdigstillelse?: string;
    aktivDato?: string;
    opprettetTidspunkt?: string;
    opprettetAv?: string;
    endretAv?: string;
    ferdigstiltTidspunkt?: string;
    endretTidspunkt?: string;
    prioritet?: string; //OppgavePrioritet
    status?: string; //StatusEnum
}

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResurs: OppgaveResurs;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveResurs }) => {
    const { status } = oppgaveResurs;
    if (status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (status === RessursStatus.IKKE_HENTET) {
        return <Normaltekst> Du må gjøre ett søk før att få opp træff!!!</Normaltekst>; //TODO FIKS TEKST
    }

    const { data } = oppgaveResurs as RessursSuksess<IOppgaverResponse>;
    return (
        <table>
            <thead>
                <tr>
                    <td>Reg.dato</td>
                    <td>Oppgavetype</td>
                    <td>Gjelder</td>
                    <td>Frist</td>
                    <td>Prioritet</td>
                    <td>Beskrivelse</td>
                    <td>Bruker</td>
                    <td>Enhet</td>
                    <td>Saksbehandler</td>
                    <td>Handlinger</td>
                </tr>
            </thead>
            <tbody>
                {data.oppgaver.map((v) => (
                    <tr>
                        {Object.values(v).map((value) => (
                            <td>{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OppgaveTabell;
