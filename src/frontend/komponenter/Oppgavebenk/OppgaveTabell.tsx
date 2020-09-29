import React, { useState } from 'react';
import { RessursStatus, RessursSuksess } from '../../typer/ressurs';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { OppgaveResurs } from '../../sider/Oppgavebenk';
import OppgaveRad from './OppgaveRad';
import { IOppgave } from './oppgave';
import 'nav-frontend-tabell-style';
import Paginering from './Paginering';

const SIDE_STORRELSE = 15;

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

interface Props {
    oppgaveResurs: OppgaveResurs;
}

const OppgaveTabell: React.FC<Props> = ({ oppgaveResurs }) => {
    const [valgtSide, settValgtSide] = useState<number>(1);
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

    const sliceOppgaveListe = data.oppgaver.slice(
        (valgtSide - 1) * SIDE_STORRELSE,
        valgtSide * SIDE_STORRELSE
    );

    return (
        <>
            <Paginering
                antallTotalt={data.oppgaver.length}
                settValgtSide={settValgtSide}
                sideStorrelse={SIDE_STORRELSE}
                valgtSide={valgtSide}
            />
            <table className="tabell tabell--stripet">
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
                        <td>Enhetsmappe</td>
                        <td>Saksbehandler</td>
                        <td>Handlinger</td>
                    </tr>
                </thead>
                <tbody>
                    {sliceOppgaveListe.map((v) => (
                        <OppgaveRad oppgave={v} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default OppgaveTabell;
