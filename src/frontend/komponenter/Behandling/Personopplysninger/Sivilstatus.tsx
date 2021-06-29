import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import Hjerte from '../../../ikoner/Hjerte';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../../typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../utils/formatter';
import { Normaltekst } from 'nav-frontend-typografi';
import { EtikettDød } from '../../etiketter/EtikettDød';

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Hjerte} tittel={'Sivilstatus'} />
            <table className="tabell">
                <KolonneTitler titler={['Status', 'Dato', 'Navn', 'Fødselsnummer', 'Dødsdato']} />
                <tbody>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <tr key={indeks}>
                                <td>{sivilstandTilTekst[sivilstand.type]}</td>
                                <td>{formaterNullableIsoDato(sivilstand.gyldigFraOgMed)}</td>
                                <td>
                                    {sivilstand.navn}
                                    {sivilstand.dødsdato && <EtikettDød />}
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
                                <td>{sivilstand.dødsdato}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default Sivilstatus;
