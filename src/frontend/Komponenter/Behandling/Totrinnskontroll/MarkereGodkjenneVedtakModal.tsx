import { Modal, Button, Checkbox, CheckboxGroup, VStack, Table, Heading } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { Divider } from '../../../Felles/Divider/Divider';
import { styled } from 'styled-components';

const StyledTableDataCell = styled(Table.DataCell)`
    padding: 12px 8px 12px 0;
`;

export const MarkereGodkjenneVedtakModal: FC<{
    open: boolean;
    setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
    const handleChange = (val: string[]) => console.info(val);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const data = [
        {
            name: 'Jakobsen, Markus',
            fnr: '03129265463',
            start: '2021-04-28T19:12:14.358Z',
        },
        {
            name: 'Halvorsen, Mari',
            fnr: '16063634134',
            start: '2022-01-29T09:51:19.833Z',
        },
        {
            name: 'Christiansen, Mathias',
            fnr: '18124441438',
            start: '2021-06-04T20:57:29.159Z',
        },
        {
            name: 'Fredriksen, Leah',
            fnr: '24089080180',
            start: '2021-08-31T15:47:36.293Z',
        },
        {
            name: 'Evensen, Jonas',
            fnr: '18106248460',
            start: '2021-07-17T11:13:26.116Z',
        },
    ];

    const format = (date: Date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${d}.${m}.${y}`;
    };

    const toggleSelectedRow = (value: string) =>
        setSelectedRows((list) =>
            list.includes(value) ? list.filter((id) => id !== value) : [...list, value]
        );

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            header={{
                heading: '',
                size: 'small',
                closeButton: false,
            }}
            width={`${55}${'rem'}`}
        >
            <Modal.Body>
                <VStack gap="4">
                    <CheckboxGroup
                        legend="Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:"
                        onChange={handleChange}
                    >
                        <Checkbox value="car">
                            Oppgave for kontroll av inntekt 1 år frem i tid
                        </Checkbox>
                        <Checkbox value="taxi">
                            Oppgave til 15.desember 2025 for kontroll av inntekt for selvstendig
                            næringsdrivende
                        </Checkbox>
                    </CheckboxGroup>
                    <Divider />
                    <>
                        <Heading size="small">
                            Bruker har følgende åpne fremleggsoppgaver. Huk av om du ønsker at noen
                            av disse automatisk skal ferdigstilles ved godkjenning av dette
                            vedtaket:
                        </Heading>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell scope="col">Oppgavetype</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Gjelder</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {data.map(({ name, fnr, start }, i) => {
                                    return (
                                        <Table.ExpandableRow
                                            key={i + fnr}
                                            content="Innhold i ekspanderbar rad"
                                            togglePlacement="right"
                                        >
                                            <StyledTableDataCell>
                                                <Checkbox
                                                    hideLabel
                                                    checked={selectedRows.includes(fnr)}
                                                    onChange={() => toggleSelectedRow(fnr)}
                                                    aria-labelledby={`id-${fnr}`}
                                                >
                                                    {' '}
                                                </Checkbox>
                                            </StyledTableDataCell>
                                            <Table.DataCell scope="row">{name}</Table.DataCell>
                                            <Table.DataCell>{fnr}</Table.DataCell>
                                            <Table.DataCell>{fnr}</Table.DataCell>
                                            <Table.DataCell>
                                                {format(new Date(start))}
                                            </Table.DataCell>
                                        </Table.ExpandableRow>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </>
                    <Divider />
                    <CheckboxGroup
                        legend="Godkjenne vedtakoppgaven skal merkes med:"
                        onChange={handleChange}
                    >
                        <Checkbox value="car">Særlig tilsynskrevende</Checkbox>
                        <Checkbox value="taxi">Selvstendig næringsdrivende</Checkbox>
                        <Checkbox value="taxi">EØS</Checkbox>
                        <Checkbox value="taxi">Oppgave må sendes til NØS</Checkbox>
                    </CheckboxGroup>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={() => setOpen(false)}>
                    Send til beslutter
                </Button>
                <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
