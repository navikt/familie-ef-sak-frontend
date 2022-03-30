import React from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import TabellOverskrift from './TabellOverskrift';
import LiteBarn from '../Ikoner/LiteBarn';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import { EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../Etiketter/EtikettDød';
import { nullableDatoTilAlder } from '../../App/utils/dato';

const SpanMedVenstreMargin = styled.span`
    margin-left: 15%;
`;

const FlexDiv = styled.div`
    display: flex;
`;

const titler = ['Navn', 'Fødselsnummer', 'Annen forelder', 'Bor med bruker'];

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={LiteBarn} tittel={'Barn'} />
            <table className="tabell">
                <KolonneTitler titler={titler} />
                <tbody>
                    {barn.map((barn) => {
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
                                <BredTd>{barn.borHosSøker ? 'Ja' : '-'}</BredTd>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
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
                        {alder ? (
                            alder < 18 ? (
                                <EtikettSuksess>{alder} år</EtikettSuksess>
                            ) : (
                                <EtikettInfo>Over 18 år</EtikettInfo>
                            )
                        ) : (
                            <EtikettFokus>Ukjent alder</EtikettFokus>
                        )}
                    </SpanMedVenstreMargin>
                )}
            </FlexDiv>
        </BredTd>
    );
};

export default Barn;
