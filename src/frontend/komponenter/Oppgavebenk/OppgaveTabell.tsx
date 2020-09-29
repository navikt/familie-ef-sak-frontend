import React from 'react';
import { RessursStatus, RessursSuksess } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { OppgaveResurs } from '../../sider/Oppgavebenk';
import OppgaveRad from './OppgaveRad';
import Lenke from 'nav-frontend-lenker';
import { IOppgave } from './oppgave';
import 'nav-frontend-tabell-style';

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
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Reg.dato</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Oppgavetype</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Gjelder</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Frist</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Prioritet</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Beskrivelse</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Bruker</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Enhet</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Saksbehandler</Lenke>
                    </th>
                    <th role="columnheader" aria-sort="none">
                        <Lenke href="#">Handlinger</Lenke>
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.oppgaver.map((v) => (
                    <OppgaveRad oppgave={v} />
                ))}
            </tbody>
        </table>
    );
};

export default OppgaveTabell;
