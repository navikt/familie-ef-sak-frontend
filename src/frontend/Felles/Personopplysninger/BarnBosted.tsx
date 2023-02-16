import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import { Popover, Table } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import styled from 'styled-components';
import { Information } from '@navikt/ds-icons';

const StyledInformationIcon = styled(Information)`
    margin: 0.5rem 0.5rem 0 0.5rem;
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
        <>
            {bostedStatus(barn)}
            {barn.deltBosted.length > 0 && (
                <StyledInformationIcon ref={iconRef} onClick={() => setOpenState(true)}>
                    Åpne popover
                </StyledInformationIcon>
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

export default BarnBosted;
