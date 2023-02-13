import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import TabellOverskrift from './TabellOverskrift';
import LiteBarn from '../Ikoner/LiteBarn';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../Etiketter/EtikettDød';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { Popover, Table, Tag } from '@navikt/ds-react';
import { Information } from '@navikt/ds-icons';
import { formaterNullableIsoDato } from '../../App/utils/formatter';

const SpanMedVenstreMargin = styled.span`
    margin-left: 15%;
`;

const StyledInformation = styled(Information)`
    margin: 0.5rem 0.5rem 0 0.5rem;
    &:hover {
        cursor: pointer;
    }
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
const bostedStatus = (barn: IBarn) => {
    if (barn.harDeltBostedNå) {
        return 'Delt bosted';
    }
    if (barn.borHosSøker) {
        return 'Ja';
    }
    return '-'; // TODO : "Nei" vs "-" ?
};

const popoverContent = (barn: IBarn) => (
    <Popover.Content>
        <div>Delt bosted:</div>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {barn.deltBosted.map((periode) => {
                    return (
                        <Table.Row key={periode.startdatoForKontrakt}>
                            <Table.DataCell>
                                {formaterNullableIsoDato(periode.startdatoForKontrakt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(periode.sluttdatoForKontrakt)}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    </Popover.Content>
);

const BarnBosted: React.FC<{ barn: IBarn }> = ({ barn }) => {
    const iconRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);

    return (
        <>
            {bostedStatus(barn)}
            {barn.deltBosted.length > 0 && (
                <StyledInformation ref={iconRef} onClick={() => setOpenState(true)}>
                    Åpne popover
                </StyledInformation>
            )}
            <Popover
                placement={'right'}
                open={openState}
                onClose={() => setOpenState(false)}
                anchorEl={iconRef.current}
                children={popoverContent(barn)}
            />
        </>
    );
};

const Barn: React.FC<{ barn: IBarn[] }> = ({ barn }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={LiteBarn} tittel={'Barn'} />
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
