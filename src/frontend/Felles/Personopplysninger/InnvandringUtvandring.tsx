import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../App/typer/personopplysninger';
import { IngenData, KolonneTitler } from './TabellWrapper';
import FlyMedSky from '../Ikoner/FlyMedSky';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../App/utils/formatter';
import styled from 'styled-components';
import { HelpText, Table } from '@navikt/ds-react';
import PersonopplysningerPanel from './PersonopplysningPanel';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utvandringer: IUtflyttingFraNorge[];
}

const StyledInnflyttetÅrHeader = styled.div`
    padding-right: 1rem;
`;

export const headerForInnflyttingTabell: React.ReactNode = (
    <div style={{ display: 'flex' }}>
        <StyledInnflyttetÅrHeader>Innflyttet år</StyledInnflyttetÅrHeader>
        <HelpText>
            Innflyttet år er basert på Folkeregisteret sitt gyldighetstidspunktet for innflytting.
            Denne har nødvendigvis ikke noen sammenheng med når innflyttingen skjedde i
            virkeligheten. Dersom man skal finne ut når en innflytting gjelder fra må man se på
            andre opplysninger, f.eks. den norske bostedsadressens fra-dato.
        </HelpText>
    </div>
);

const InnvandringUtVandring: React.FC<Props> = ({ innvandringer, utvandringer }) => {
    if (innvandringer.length === 0 && utvandringer.length === 0) {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={'Innvandring og utvandring'}>
                <IngenData />
            </PersonopplysningerPanel>
        );
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
        <Table className={'innhold'} size="small">
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
        </Table>
    );
};

const Utvandring: React.FC<{ utvandringer: IUtflyttingFraNorge[] }> = ({ utvandringer }) => {
    return (
        <Table className={'innhold'} size="small">
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
        </Table>
    );
};

export default InnvandringUtVandring;
