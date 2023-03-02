import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../App/typer/personopplysninger';
import { KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import FlyMedSky from '../Ikoner/FlyMedSky';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../App/utils/formatter';
import styled from 'styled-components';
import { HelpText, Label, Table } from '@navikt/ds-react';
import PersonopplysningerPanel from './PersonopplysningPanel';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utflyttinger: IUtflyttingFraNorge[];
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

const InnvandringUtVandring: React.FC<Props> = ({ innvandringer, utflyttinger }) => {
    const tittel = 'Innflytting og utflytting';
    if (innvandringer.length === 0 && utflyttinger.length === 0) {
        return <PersonopplysningerPanel Ikon={FlyMedSky} tittel={tittel} />;
    } else if (innvandringer.length === 0) {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={tittel}>
                <Utflytting utflyttinger={utflyttinger} />
            </PersonopplysningerPanel>
        );
    } else if (utflyttinger.length === 0) {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={tittel}>
                <Innvandring innvandringer={innvandringer} />
            </PersonopplysningerPanel>
        );
    } else {
        return (
            <PersonopplysningerPanel Ikon={FlyMedSky} tittel={tittel}>
                <Innvandring innvandringer={innvandringer} />
                <Utflytting utflyttinger={utflyttinger} />
            </PersonopplysningerPanel>
        );
    }
};

const Innvandring: React.FC<{ innvandringer: IInnflyttingTilNorge[] }> = ({ innvandringer }) => {
    return (
        <SmallTabelMedTilpassetBredde>
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
        </SmallTabelMedTilpassetBredde>
    );
};

const Utflytting: React.FC<{ utflyttinger: IUtflyttingFraNorge[] }> = ({ utflyttinger }) => {
    return (
        <SmallTabelMedTilpassetBredde>
            <KolonneTitler titler={['Utvandret til', 'Utflyttingsdato', '', '']} />
            <Table.Body>
                {utflyttinger.map((utflytting, indeks) => {
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
        </SmallTabelMedTilpassetBredde>
    );
};

export default InnvandringUtVandring;
