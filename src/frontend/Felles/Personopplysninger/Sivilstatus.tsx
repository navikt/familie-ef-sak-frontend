import React from 'react';
import Hjerte from '../Ikoner/Hjerte';
import { KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../App/typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import EtikettDød from '../Etiketter/EtikettDød';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';

const titler = ['Status', 'Dato', 'Navn partner', 'Fødselsnummer'];

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <PersonopplysningerPanel tittel="Sivilstatus" Ikon={Hjerte}>
            <SmallTabelMedTilpassetBredde>
                <KolonneTitler titler={titler} />
                <Table.Body>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <Table.Row key={indeks}>
                                <Table.DataCell>
                                    {sivilstandTilTekst[sivilstand.type]}{' '}
                                    {sivilstand.erGjeldende ? '(gjeldende)' : ''}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(sivilstand.gyldigFraOgMed)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sivilstand.navn}
                                    {sivilstand.dødsdato && (
                                        <EtikettDød dødsdato={sivilstand.dødsdato} />
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sivilstand.relatertVedSivilstand ? (
                                        <KopierbartNullableFødselsnummer
                                            fødselsnummer={sivilstand.relatertVedSivilstand}
                                        />
                                    ) : (
                                        <BodyShortSmall>-</BodyShortSmall>
                                    )}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </SmallTabelMedTilpassetBredde>
        </PersonopplysningerPanel>
    );
};

export default Sivilstatus;
