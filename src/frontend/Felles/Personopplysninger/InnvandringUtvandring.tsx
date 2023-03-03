import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../App/typer/personopplysninger';
import { KolonneTitler, SmallTable } from './TabellWrapper';
import FlyMedSky from '../Ikoner/FlyMedSky';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../App/utils/formatter';
import styled from 'styled-components';
import { HelpText, Label, Table } from '@navikt/ds-react';
import PersonopplysningerPanel from './PersonopplysningPanel';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utvandringer: IUtflyttingFraNorge[];
}

const InnflyttetÅrHeader = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const headerForInnflyttingTabell: React.ReactNode = (
    <InnflyttetÅrHeader>
        <Label size="small">Innflyttet år</Label>
        <HelpText>
            Innflyttet år er basert på Folkeregisteret sitt gyldighetstidspunktet for innflytting.
            Denne har nødvendigvis ikke noen sammenheng med når innflyttingen skjedde i
            virkeligheten. Dersom man skal finne ut når en innflytting gjelder fra må man se på
            andre opplysninger, f.eks. den norske bostedsadressens fra-dato.
        </HelpText>
    </InnflyttetÅrHeader>
);

const InnvandringUtVandring: React.FC<Props> = ({ innvandringer, utvandringer }) => {
    if (innvandringer.length === 0 && utvandringer.length === 0) {
        return <PersonopplysningerPanel Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />;
    } else if (innvandringer.length === 0) {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={'Innvandring og utvandring'}>
                <Utvandring utvandringer={utvandringer} />
            </PersonopplysningerPanel>
        );
    } else if (utvandringer.length === 0) {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={'Innvandring og utvandring'}>
                <Innvandring innvandringer={innvandringer} />
            </PersonopplysningerPanel>
        );
    } else {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={'Innvandring og utvandring'}>
                <Innvandring innvandringer={innvandringer} />
                <Utvandring utvandringer={utvandringer} />
            </PersonopplysningerPanel>
        );
    }
};

const Innvandring: React.FC<{ innvandringer: IInnflyttingTilNorge[] }> = ({ innvandringer }) => {
    return (
        <SmallTable>
            <KolonneTitler titler={['Innvandret fra', headerForInnflyttingTabell, '', '']} />
            <Table.Body>
                {innvandringer.map((innflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <Table.DataCell>
                                {innflytting.fraflyttingsland +
                                    (innflytting.fraflyttingssted
                                        ? ', ' + innflytting.fraflyttingssted
                                        : '')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoÅr(innflytting.dato)}
                            </Table.DataCell>
                            <Table.DataCell />
                            <Table.DataCell />
                        </tr>
                    );
                })}
            </Table.Body>
        </SmallTable>
    );
};

const Utvandring: React.FC<{ utvandringer: IUtflyttingFraNorge[] }> = ({ utvandringer }) => {
    return (
        <SmallTable>
            <KolonneTitler titler={['Utvandret til', 'Utflyttingsdato', '', '']} />
            <Table.Body>
                {utvandringer.map((utflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <Table.DataCell>
                                {utflytting.tilflyttingsland +
                                    (utflytting.tilflyttingssted
                                        ? ', ' + utflytting.tilflyttingssted
                                        : '')}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(utflytting.dato)}
                            </Table.DataCell>
                            <Table.DataCell />
                            <Table.DataCell />
                        </tr>
                    );
                })}
            </Table.Body>
        </SmallTable>
    );
};

export default InnvandringUtVandring;
