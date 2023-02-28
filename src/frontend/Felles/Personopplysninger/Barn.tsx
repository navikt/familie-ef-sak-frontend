import React from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import LiteBarn from '../Ikoner/LiteBarn';
import { BredTd, KolonneTitler } from './TabellWrapper';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../Etiketter/EtikettDød';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { Tag } from '@navikt/ds-react';
import BarnBosted from './BarnBosted';
import PersonopplysningerPanel from './PersonopplysningPanel';

const SpanMedVenstreMargin = styled.span`
    margin-left: 15%;
`;

const FlexDiv = styled.div`
    display: flex;
`;

const titler = ['Navn', 'Fødselsnummer', 'Annen forelder', 'Bor med bruker'];

const sorterBarnPåAlderInc = (a: IBarn, b: IBarn) => {
    const alderBarnA = a.fødselsdato ? (nullableDatoTilAlder(a.fødselsdato) as number) : 1000;
    const alderBarnB = b.fødselsdato ? (nullableDatoTilAlder(b.fødselsdato) as number) : 1000;
    return alderBarnA - alderBarnB;
};

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <PersonopplysningerPanel Ikon={LiteBarn} tittel={'Barn'}>
            <table className="tabell">
                <KolonneTitler titler={titler} />
                <tbody>
                    {barn.sort(sorterBarnPåAlderInc).map((barn) => {
                        return (
                            <tr key={barn.personIdent}>
                                <BredTd>
                                    {barn.navn}
                                    {barn.dødsdato && <EtikettDød dødsdato={barn.dødsdato} />}
                                </BredTd>
                                <FødselsnummerBarn
                                    fødselsnummer={barn.personIdent}
                                    fødselsdato={barn.fødselsdato}
                                    dødsdato={barn.dødsdato}
                                />
                                <BredTd>
                                    {barn.annenForelder && (
                                        <>
                                            <KopierbartNullableFødselsnummer
                                                fødselsnummer={barn.annenForelder.personIdent}
                                            />
                                            {barn.annenForelder.navn}
                                            {barn.annenForelder.dødsdato && (
                                                <EtikettDød
                                                    dødsdato={barn.annenForelder.dødsdato}
                                                />
                                            )}
                                        </>
                                    )}
                                </BredTd>
                                <BredTd>
                                    <BarnBosted barn={barn}></BarnBosted>
                                </BredTd>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
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
        <BredTd>
            <FlexDiv>
                <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                {!dødsdato && (
                    <SpanMedVenstreMargin>
                        {alder !== undefined ? (
                            alder < 18 ? (
                                <Tag variant={'success'}>{alder} år</Tag>
                            ) : (
                                <Tag variant={'info'}>Over 18 år</Tag>
                            )
                        ) : (
                            <Tag variant={'warning'}>Ukjent alder</Tag>
                        )}
                    </SpanMedVenstreMargin>
                )}
            </FlexDiv>
        </BredTd>
    );
};

export default Barn;
