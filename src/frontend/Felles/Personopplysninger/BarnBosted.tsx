import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import { BodyShort, Popover, Table } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import styled from 'styled-components';
import { Information } from '@navikt/ds-icons';

const InformationIcon = styled(Information)`
    margin-left: 0.5rem;
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

const FlexBox = styled.div`
    display: flex;
    align-items: baseline;
`;

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
                                <StyledDiv>
                                    {formaterNullableIsoDato(periode.startdatoForKontrakt)}
                                </StyledDiv>
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
        <FlexBox>
            <BodyShort>{bostedStatus(barn)}</BodyShort>
            {barn.deltBosted.length > 0 && (
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
