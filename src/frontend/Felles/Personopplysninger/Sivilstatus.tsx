import React from 'react';
import Hjerte from '../Ikoner/Hjerte';
import { KolonneTitler, SmallTable } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../App/typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import EtikettDød from '../Etiketter/EtikettDød';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';
import { LenkeTilPersonopplysningsside } from '../Lenker/LenkeTilPersonopplysningsside';

const titler = ['Status', 'Dato', 'Navn partner', 'Fødselsnummer'];

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[]; harFagsak: boolean }> = ({
    sivilstander,
    harFagsak,
}) => {
    return (
        <PersonopplysningerPanel tittel="Sivilstatus" Ikon={Hjerte}>
            <SmallTable>
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
                                    {harFagsak && (
                                        <LenkeTilPersonopplysningsside
                                            personIdent={sivilstand.relatertVedSivilstand}
                                        >
                                            {sivilstand.navn}
                                        </LenkeTilPersonopplysningsside>
                                    )}
                                    {!harFagsak && sivilstand.navn}
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
            </SmallTable>
        </PersonopplysningerPanel>
    );
};

export default Sivilstatus;
