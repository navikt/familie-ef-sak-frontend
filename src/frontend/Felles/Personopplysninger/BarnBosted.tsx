import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import { BodyShort, Popover, Table } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import styled from 'styled-components';
import { Information } from '@navikt/ds-icons';

const FlexBox = styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
`;

const InformationIcon = styled(Information)`
    &:hover {
        cursor: pointer;
    }
`;

export const StyledDiv = styled.div`
    margin-right: 1rem;
`;

const bostedStatus = (barn: IBarn) => {
    if (barn.harDeltBostedNå) {
        return 'Delt bosted';
    }
    if (barn.borHosSøker) {
        return 'Ja';
    }
    return '-'; // TODO : "Nei" vs "-" ?
};

const historiskTekst = (historisk: boolean) => {
    if (historisk) {
        return 'Ja';
    }
    return 'Nei';
};
const popoverContent = (barn: IBarn) => (
    <Popover.Content>
        <BodyShort>Delt bosted:</BodyShort>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Historisk</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {barn.deltBostedPerioder.map((deltBostedPeriode) => {
                    return (
                        <Table.Row key={deltBostedPeriode.startdatoForKontrakt}>
                            <Table.DataCell>
                                <StyledDiv>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.startdatoForKontrakt
                                    )}
                                </StyledDiv>
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(deltBostedPeriode.sluttdatoForKontrakt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {historiskTekst(deltBostedPeriode.historisk)}
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
        <FlexBox>
            <BodyShort>{bostedStatus(barn)}</BodyShort>
            {barn.deltBostedPerioder.length > 0 && (
                <InformationIcon ref={iconRef} onClick={() => setOpenState(true)}>
                    Åpne popover
                </InformationIcon>
            )}
            <Popover
                placement={'right'}
                open={openState}
                onClose={() => setOpenState(false)}
                anchorEl={iconRef.current}
                children={popoverContent(barn)}
            />
        </FlexBox>
    );
};

export default BarnBosted;
