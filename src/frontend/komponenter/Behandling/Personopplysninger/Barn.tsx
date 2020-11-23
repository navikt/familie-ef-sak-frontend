import React from 'react';
import { IBarn } from '../../../typer/personopplysninger';
import TabellOverskrift from './TabellOverskrift';
import LiteBarn from '../../../ikoner/LiteBarn';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { EtikettLiten } from 'nav-frontend-typografi';
import { formaterFødselsnummer } from '../../../utils/formatter';
import styled from 'styled-components';
import { differenceInYears } from 'date-fns';

const SpanMedVenstreMargin = styled.span`
    margin-left: 15%;
`;

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={LiteBarn} tittel={'Barn'} />
            <table className="tabell">
                <KolonneTitler
                    titler={['Navn', 'Fødselsnummer', 'Annen forelder', 'Bor med bruker']}
                />
                <tbody>
                    {barn.map((barn) => {
                        return (
                            <tr key={barn.personIdent}>
                                <BredTd>{barn.navn}</BredTd>
                                <FødselsnummerBarn
                                    fødselsnummer={barn.personIdent}
                                    fødselsdato={barn.fødselsdato}
                                />
                                <BredTd>
                                    {barn.annenForelder &&
                                        formaterFødselsnummer(barn.annenForelder.personIdent)}
                                    {', '}
                                    {barn.annenForelder && barn.annenForelder.navn}
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

const FødselsnummerBarn: React.FC<{ fødselsnummer: string; fødselsdato?: string }> = ({
    fødselsnummer,
    fødselsdato,
}) => {
    const alder = fødselsdato ? differenceInYears(new Date(), new Date(fødselsdato)) : NaN;

    return (
        <BredTd>
            {formaterFødselsnummer(fødselsnummer)}
            <SpanMedVenstreMargin>
                {!isNaN(alder) && alder < 18 ? (
                    <EtikettSuksess>
                        <EtikettLiten>{alder} år</EtikettLiten>
                    </EtikettSuksess>
                ) : (
                    <EtikettInfo>
                        <EtikettLiten>Over 18 år</EtikettLiten>
                    </EtikettInfo>
                )}
            </SpanMedVenstreMargin>
        </BredTd>
    );
};

export default Barn;
