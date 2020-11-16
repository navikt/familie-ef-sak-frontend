import React from 'react';
import TabellHeader from './TabellHeader';
import Hjerte from '../../../ikoner/Hjerte';
import { formatertFødselsnummer } from '../../../utils/formatter';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand } from '../../../typer/personopplysninger';

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <TabellWrapper>
            <TabellHeader Ikon={Hjerte} tittel={'Sivilstatus'} />
            <table className="tabell">
                <KolonneTitler titler={['Status', 'Dato', 'Navn', 'Fødselsnummer']} />
                <tbody>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <tr key={indeks}>
                                <td>{sivilstand.type}</td>
                                <td>{sivilstand.gyldigFraOgMed}</td>
                                <td>{sivilstand.navn}</td>
                                <td>
                                    {sivilstand.relatertVedSivilstand &&
                                        formatertFødselsnummer(sivilstand.relatertVedSivilstand)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default Sivilstatus;
