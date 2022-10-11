import React, { FC, useEffect } from 'react';
import { Button, Heading, Table } from '@navikt/ds-react';
import { formaterIsoDato } from '../../App/utils/formatter';
import styled from 'styled-components';
import { ToggleName } from '../../App/context/toggles';
import { Normaltekst } from 'nav-frontend-typografi';
import { useApp } from '../../App/context/AppContext';
import { useToggles } from '../../App/context/TogglesContext';
import { UtestengelseModal } from './Modal/UtestengelseModal';
import { useHentUtestengelser } from '../../App/hooks/useHentUtestengelser';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { IUtestengelse } from '../../App/typer/utestengelse';
import { Ressurs } from '../../App/typer/ressurs';

const StyledTable = styled(Table)`
    width: 18rem;
    margin-left: 1rem;
`;

const UtestengelseContainer = styled.div`
    margin-top: 1.5rem;
`;

const StyledButton = styled(Button)`
    margin-top: 1rem;
`;

const UtestengelseTabell: FC<{ utestengelser: Ressurs<IUtestengelse[]> }> = ({ utestengelser }) => {
    return (
        <DataViewer response={{ utestengelser }}>
            {({ utestengelser }) => {
                if (!utestengelser.length) {
                    return null;
                }
                return (
                    <StyledTable>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Fra</Table.ColumnHeader>
                                <Table.ColumnHeader>Til</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {utestengelser.map((utestengelse) => {
                                return (
                                    <Table.Row key={utestengelse.id}>
                                        <Table.DataCell>
                                            {formaterIsoDato(utestengelse.periode.fom)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterIsoDato(utestengelse.periode.tom)}
                                        </Table.DataCell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </StyledTable>
                );
            }}
        </DataViewer>
    );
};

const Utestengelse: FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentUtestengelser, utestengelser } = useHentUtestengelser();
    const { erSaksbehandler, settVisUtestengModal } = useApp();
    const { toggles } = useToggles();

    useEffect(() => {
        hentUtestengelser(fagsakPersonId);
    }, [fagsakPersonId, hentUtestengelser]);

    return (
        <UtestengelseContainer>
            <Heading level="3" size="medium">
                Utestengelser
            </Heading>
            <UtestengelseTabell utestengelser={utestengelser} />

            {erSaksbehandler && toggles[ToggleName.visUtestengelse] && (
                <StyledButton variant={'secondary'} onClick={() => settVisUtestengModal(true)}>
                    <Normaltekst>Legg til utestengelse</Normaltekst>
                </StyledButton>
            )}
            <UtestengelseModal
                fagsakPersonId={fagsakPersonId}
                hentUtestengelser={hentUtestengelser}
            />
        </UtestengelseContainer>
    );
};

export default Utestengelse;
