import { IBarn } from '../../App/typer/personopplysninger';
import { Popover, Table } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Information } from '@navikt/ds-icons';

const StyledInformation = styled(Information)`
    margin: 0.5rem 0.5rem 0 0.5rem;
    &:hover {
        cursor: pointer;
    }
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

export default BarnBosted;
