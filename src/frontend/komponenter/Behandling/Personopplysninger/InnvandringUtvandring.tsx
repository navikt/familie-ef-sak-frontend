import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../typer/personopplysninger';
import { BredTd, IngenData, KolonneTitler, TabellWrapper } from './TabellWrapper';
import TabellOverskrift from './TabellOverskrift';
import FlyMedSky from '../../../ikoner/FlyMedSky';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utvandringer: IUtflyttingFraNorge[];
}

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
            <KolonneTitler titler={['Innvandret fra', '', '', '']} />
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
                            <BredTd />
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
            <KolonneTitler titler={['Utvandret til', '', '', '']} />
            <tbody>
                {utvandringer.map((utflytting, indeks) => {
                    console.log(utflytting.tilflyttingssted);
                    return (
                        <tr key={indeks}>
                            <BredTd>
                                {utflytting.tilflyttingsland +
                                    (utflytting.tilflyttingssted
                                        ? ', ' + utflytting.tilflyttingssted
                                        : '')}
                            </BredTd>
                            <BredTd />
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
