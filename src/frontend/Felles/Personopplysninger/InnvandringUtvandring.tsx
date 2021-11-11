import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../App/typer/personopplysninger';
import { BredTd, IngenData, KolonneTitler, TabellWrapper } from './TabellWrapper';
import TabellOverskrift from './TabellOverskrift';
import FlyMedSky from '../Ikoner/FlyMedSky';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../App/utils/formatter';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import styled from 'styled-components';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utvandringer: IUtflyttingFraNorge[];
}

const StyledInnflyttetÅrHeader = styled.div`
    padding-right: 1rem;
`;

const StyledHjelpetekst = styled(Hjelpetekst)`
    .hjelpetekst__innhold {
        max-width: 30rem;
    }
`;

export const headerForInnflyttingTabell: React.ReactNode = (
    <div style={{ display: 'flex' }}>
        <StyledInnflyttetÅrHeader>Innflyttet år</StyledInnflyttetÅrHeader>
        <StyledHjelpetekst>
            Innflyttet år er basert på Folkeregisteret sitt gyldighetstidspunktet for innflytting.
            Denne har nødvendigvis ikke noen sammenheng med når innflyttingen skjedde i
            virkeligheten. Dersom man skal finne ut når en innflytting gjelder fra må man se på
            andre opplysninger, f.eks. den norske bostedsadressens fra-dato.
        </StyledHjelpetekst>
    </div>
);

const InnvandringUtVandring: React.FC<Props> = ({ innvandringer, utvandringer }) => {
    if (innvandringer.length === 0 && utvandringer.length === 0) {
        return (
            <TabellWrapper>
                <TabellOverskrift Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <IngenData />
            </TabellWrapper>
        );
    } else if (innvandringer.length === 0) {
        return (
            <TabellWrapper>
                <TabellOverskrift Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Utvandring utvandringer={utvandringer} />
            </TabellWrapper>
        );
    } else if (utvandringer.length === 0) {
        return (
            <TabellWrapper>
                <TabellOverskrift Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Innvandring innvandringer={innvandringer} />
            </TabellWrapper>
        );
    } else {
        return (
            <TabellWrapper erDobbelTabell>
                <TabellOverskrift Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Innvandring innvandringer={innvandringer} dobbelTabell />
                <Utvandring utvandringer={utvandringer} dobbelTabell />
            </TabellWrapper>
        );
    }
};

const Innvandring: React.FC<{ innvandringer: IInnflyttingTilNorge[]; dobbelTabell?: boolean }> = ({
    innvandringer,
    dobbelTabell,
}) => {
    return (
        <table className={dobbelTabell ? 'tabell første-tabell' : 'tabell'}>
            <KolonneTitler titler={['Innvandret fra', headerForInnflyttingTabell, '', '']} />
            <tbody>
                {innvandringer.map((innflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <BredTd>
                                {innflytting.fraflyttingsland +
                                    (innflytting.fraflyttingssted
                                        ? ', ' + innflytting.fraflyttingssted
                                        : '')}
                            </BredTd>
                            <BredTd>{formaterNullableIsoÅr(innflytting.dato)}</BredTd>
                            <BredTd />
                            <BredTd />
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const Utvandring: React.FC<{ utvandringer: IUtflyttingFraNorge[]; dobbelTabell?: boolean }> = ({
    utvandringer,
    dobbelTabell,
}) => {
    return (
        <table className={dobbelTabell ? 'tabell andre-tabell' : 'tabell'}>
            <KolonneTitler titler={['Utvandret til', 'Utflyttingsdato', '', '']} />
            <tbody>
                {utvandringer.map((utflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <BredTd>
                                {utflytting.tilflyttingsland +
                                    (utflytting.tilflyttingssted
                                        ? ', ' + utflytting.tilflyttingssted
                                        : '')}
                            </BredTd>
                            <BredTd>{formaterNullableIsoDato(utflytting.dato)}</BredTd>
                            <BredTd />
                            <BredTd />
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default InnvandringUtVandring;
