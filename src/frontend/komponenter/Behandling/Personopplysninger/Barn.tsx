import React from 'react';
import { IBarn } from '../../../typer/personopplysninger';
import TabellHeader from './TabellHeader';
import LiteBarn from '../../../ikoner/LiteBarn';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { EtikettLiten } from 'nav-frontend-typografi';
import { formatertFødselsnummer } from '../../../utils/formatter';
import styled from 'styled-components';

const SpanMedVenstreMargin = styled.span`
    margin-left: 4rem;
`;

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <TabellWrapper>
            <TabellHeader Ikon={LiteBarn} tittel={'Barn'} />
            <table className="tabell">
                <KolonneTitler
                    titler={['Navn', 'Fødselsnummer', 'Annen forelder', 'Bor med bruker']}
                />
                <tbody>
                    {barn.map((barn) => {
                        return (
                            <tr key={barn.personIdent}>
                                <BredTd>{barn.navn}</BredTd>
                                <FødselsnummerBarn fødelsnummer={barn.personIdent} />
                                <BredTd>
                                    {barn.annenForelder &&
                                        formatertFødselsnummer(barn.annenForelder.personIdent)}
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

const FødselsnummerBarn: React.FC<{ fødelsnummer: string }> = ({ fødelsnummer }) => {
    const alder = Math.floor(
        Math.abs(
            Date.now() -
                new Date(
                    parseInt('20' + fødelsnummer.substring(4, 6)),
                    parseInt(fødelsnummer.substring(2, 4)),
                    parseInt(fødelsnummer.substring(0, 2))
                ).getTime()
        ) /
            (1000 * 3600 * 24) /
            365.25
    );
    return (
        <BredTd>
            {formatertFødselsnummer(fødelsnummer)}
            <SpanMedVenstreMargin>
                {alder < 18 ? (
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
