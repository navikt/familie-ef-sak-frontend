import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import Hjerte from '../../../ikoner/Hjerte';
import { formaterFødselsnummer } from '../../../utils/formatter';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand } from '../../../typer/personopplysninger';

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Hjerte} tittel={'Sivilstatus'} />
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
                                        formaterFødselsnummer(sivilstand.relatertVedSivilstand)}
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
