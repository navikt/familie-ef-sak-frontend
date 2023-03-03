import React from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import LiteBarn from '../Ikoner/LiteBarn';
import { KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../Etiketter/EtikettDød';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { Table, Tag } from '@navikt/ds-react';
import BarnBosted from './BarnBosted';
import PersonopplysningerPanel from './PersonopplysningPanel';

const FlexDiv = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const titler = ['Navn', 'Fødselsnummer', 'Annen forelder', 'Fødselsnummer', 'Bor med bruker'];

const sorterBarnPåAlderInc = (a: IBarn, b: IBarn) => {
    const alderBarnA = a.fødselsdato ? (nullableDatoTilAlder(a.fødselsdato) as number) : 1000;
    const alderBarnB = b.fødselsdato ? (nullableDatoTilAlder(b.fødselsdato) as number) : 1000;
    return alderBarnA - alderBarnB;
};

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <PersonopplysningerPanel Ikon={LiteBarn} tittel={'Barn'}>
            <SmallTabelMedTilpassetBredde>
                <KolonneTitler titler={titler} />
                <Table.Body>
                    {barn.sort(sorterBarnPåAlderInc).map((barn) => {
                        return (
                            <Table.Row key={barn.personIdent}>
                                <Table.DataCell>
                                    {barn.navn}
                                    {barn.dødsdato && <EtikettDød dødsdato={barn.dødsdato} />}
                                </Table.DataCell>
                                <FødselsnummerBarn
                                    fødselsnummer={barn.personIdent}
                                    fødselsdato={barn.fødselsdato}
                                    dødsdato={barn.dødsdato}
                                />
                                {barn.annenForelder && (
                                    <>
                                        <Table.DataCell>{barn.annenForelder.navn}</Table.DataCell>
                                        <Table.DataCell>
                                            <KopierbartNullableFødselsnummer
                                                fødselsnummer={barn.annenForelder.personIdent}
                                            />
                                            {barn.annenForelder.dødsdato && (
                                                <EtikettDød
                                                    dødsdato={barn.annenForelder.dødsdato}
                                                />
                                            )}
                                        </Table.DataCell>
                                    </>
                                )}
                                <Table.DataCell>
                                    <BarnBosted barn={barn}></BarnBosted>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </SmallTabelMedTilpassetBredde>
        </PersonopplysningerPanel>
    );
};

const FødselsnummerBarn: React.FC<{
    fødselsnummer: string;
    fødselsdato?: string;
    dødsdato?: string;
}> = ({ fødselsnummer, fødselsdato, dødsdato }) => {
    const alder = nullableDatoTilAlder(fødselsdato);

    return (
        <Table.DataCell>
            <FlexDiv>
                <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                {!dødsdato &&
                    (alder !== undefined ? (
                        alder < 18 ? (
                            <Tag variant={'success'} size="small">
                                {alder} år
                            </Tag>
                        ) : (
                            <Tag variant={'info'} size="small">
                                Over 18 år
                            </Tag>
                        )
                    ) : (
                        <Tag variant={'warning'} size="small">
                            Ukjent alder
                        </Tag>
                    ))}
            </FlexDiv>
        </Table.DataCell>
    );
};

export default Barn;
