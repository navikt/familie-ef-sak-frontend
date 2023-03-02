import React from 'react';
import { KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import { Folkeregisterpersonstatus, IStatsborgerskap } from '../../App/typer/personopplysninger';
import Pass from '../Ikoner/Pass';
import {
    formaterNullableIsoDato,
    formaterStrengMedStorForbokstav,
} from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';

const Statsborgerskap: React.FC<{
    statsborgerskap: IStatsborgerskap[];
    folkeregisterPersonstatus?: Folkeregisterpersonstatus;
}> = ({ statsborgerskap, folkeregisterPersonstatus }) => {
    return (
        <PersonopplysningerPanel Ikon={Pass} tittel={'Statsborgerskap'}>
            <SmallTabelMedTilpassetBredde>
                <KolonneTitler titler={['Land', 'Fra', 'Til', 'Personstatus']} />
                <Table.Body>
                    {statsborgerskap.map((statsborgerskap, indeks) => {
                        return (
                            <Table.Row key={indeks}>
                                <Table.DataCell>{statsborgerskap.land}</Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(statsborgerskap.gyldigFraOgMedDato)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(statsborgerskap.gyldigTilOgMedDato)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {statsborgerskap.land.toLowerCase() === 'norge' &&
                                        folkeregisterPersonstatus &&
                                        formaterStrengMedStorForbokstav(folkeregisterPersonstatus)}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </SmallTabelMedTilpassetBredde>
        </PersonopplysningerPanel>
    );
};

export default Statsborgerskap;
