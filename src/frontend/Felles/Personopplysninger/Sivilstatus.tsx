import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import Hjerte from '../Ikoner/Hjerte';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../App/typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { Normaltekst } from 'nav-frontend-typografi';
import EtikettDød from '../Etiketter/EtikettDød';

const titler = ['Status', 'Dato', 'Navn partner', 'Fødselsnummer'];

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Hjerte} tittel={'Sivilstatus'} />
            <table className="tabell">
                <KolonneTitler titler={titler} />
                <tbody>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <tr key={indeks}>
                                <td>{sivilstandTilTekst[sivilstand.type]}</td>
                                <td>{formaterNullableIsoDato(sivilstand.gyldigFraOgMed)}</td>
                                <td>
                                    {sivilstand.navn}
                                    {sivilstand.dødsdato && (
                                        <EtikettDød dødsdato={sivilstand.dødsdato} />
                                    )}
                                </td>
                                <td>
                                    {sivilstand.relatertVedSivilstand ? (
                                        <KopierbartNullableFødselsnummer
                                            fødselsnummer={sivilstand.relatertVedSivilstand}
                                        />
                                    ) : (
                                        <Normaltekst>-</Normaltekst>
                                    )}
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
