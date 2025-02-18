import React, { FC, useState } from 'react';
import { Button, Heading, Table } from '@navikt/ds-react';
import { formaterIsoDato, formaterIsoSisteDagIMåneden } from '../../../App/utils/formatter';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { UtestengelseModal } from './UtestengelseModal';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IUtestengelse } from '../../../App/typer/utestengelse';
import { Ressurs } from '../../../App/typer/ressurs';
import { Hamburgermeny } from '../../../Felles/Hamburgermeny/Hamburgermeny';
import { SlettUtestengelseModal } from './SlettUtestengelseModal';

const StyledTable = styled(Table)`
    width: 18rem;
    margin-left: 1rem;
`;

const UtestengelseContainer = styled.div`
    margin-top: 4rem;
`;

const Knapp = styled(Button)`
    margin-top: 0.5rem;
`;

const UtestengelseTabell: FC<{
    utestengelser: Ressurs<IUtestengelse[]>;
    settUtestengelseTilSletting: (utestengelse: IUtestengelse) => void;
    erSaksbehandler: boolean;
}> = ({ utestengelser, settUtestengelseTilSletting, erSaksbehandler }) => {
    return (
        <DataViewer response={{ utestengelser }}>
            {({ utestengelser }) => {
                if (!utestengelser.length) {
                    return null;
                }
                return (
                    <StyledTable size={'small'}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Fra</Table.ColumnHeader>
                                <Table.ColumnHeader>Til</Table.ColumnHeader>
                                <Table.ColumnHeader>Aksjon</Table.ColumnHeader>
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
                                            {formaterIsoSisteDagIMåneden(utestengelse.periode.tom)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {erSaksbehandler && (
                                                <Hamburgermeny
                                                    type={'ellipsisV'}
                                                    items={[
                                                        {
                                                            tekst: 'Slett',
                                                            onClick: () =>
                                                                settUtestengelseTilSletting(
                                                                    utestengelse
                                                                ),
                                                        },
                                                    ]}
                                                    plasseringItems="right"
                                                />
                                            )}
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

const Utestengelse: FC<{
    fagsakPersonId: string;
    utestengelser: Ressurs<IUtestengelse[]>;
    hentUtestengelser: (fagsakPersonId: string) => void;
}> = ({ fagsakPersonId, utestengelser, hentUtestengelser }) => {
    const { erSaksbehandler, settVisUtestengModal } = useApp();

    const [utestengelseTilSletting, settUtestengelseTilSletting] = useState<IUtestengelse>();

    return (
        <UtestengelseContainer>
            <Heading level="3" size="medium">
                Utestengelser
            </Heading>
            <UtestengelseTabell
                utestengelser={utestengelser}
                erSaksbehandler={erSaksbehandler}
                settUtestengelseTilSletting={settUtestengelseTilSletting}
            />

            {erSaksbehandler && (
                <Knapp
                    variant={'secondary'}
                    onClick={() => settVisUtestengModal(true)}
                    type={'button'}
                >
                    Legg til utestengelse
                </Knapp>
            )}
            <UtestengelseModal
                fagsakPersonId={fagsakPersonId}
                hentUtestengelser={hentUtestengelser}
            />
            <SlettUtestengelseModal
                fagsakPersonId={fagsakPersonId}
                utestengelseTilSletting={utestengelseTilSletting}
                fjernUtestengelseTilSletting={() => settUtestengelseTilSletting(undefined)}
                hentUtestengelser={hentUtestengelser}
            />
        </UtestengelseContainer>
    );
};

export default Utestengelse;
