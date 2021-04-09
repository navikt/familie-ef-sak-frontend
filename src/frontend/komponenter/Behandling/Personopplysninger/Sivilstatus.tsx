import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import Hjerte from '../../../ikoner/Hjerte';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand } from '../../../typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../../Felleskomponenter/KopierbartNullableFødselsnummer';

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
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={sivilstand.relatertVedSivilstand}
                                    />
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
