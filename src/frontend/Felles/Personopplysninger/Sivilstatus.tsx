import React from 'react';
import Hjerte from '../Ikoner/Hjerte';
import { KolonneTitler } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../App/typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import EtikettDød from '../Etiketter/EtikettDød';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import PersonopplysningerPanel from './PersonopplysningPanel';

const titler = ['Status', 'Dato', 'Navn partner', 'Fødselsnummer'];

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <PersonopplysningerPanel tittel="Sivilstatus" Ikon={Hjerte}>
            <table className="tabell">
                <KolonneTitler titler={titler} />
                <tbody>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <tr key={indeks}>
                                <td>
                                    {sivilstandTilTekst[sivilstand.type]}{' '}
                                    {sivilstand.erGjeldende ? '(gjeldende)' : ''}
                                </td>
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
                                        <BodyShortSmall>-</BodyShortSmall>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </PersonopplysningerPanel>
    );
};

export default Sivilstatus;
