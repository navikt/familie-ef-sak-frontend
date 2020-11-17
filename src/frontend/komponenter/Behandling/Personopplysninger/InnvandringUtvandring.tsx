import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../typer/personopplysninger';
import { BredTd, IngenData, KolonneTitler, TabellWrapper } from './TabellWrapper';
import TabellHeader from './TabellHeader';
import FlyMedSky from '../../../ikoner/FlyMedSky';

interface Props {
    innvandringer: IInnflyttingTilNorge[];
    utvandringer: IUtflyttingFraNorge[];
}

const InnvandringUtVandring: React.FC<Props> = ({ innvandringer, utvandringer }) => {
    if (innvandringer.length == 0 && utvandringer.length == 0) {
        return (
            <TabellWrapper>
                <TabellHeader Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <IngenData />
            </TabellWrapper>
        );
    } else if (innvandringer.length == 0) {
        return (
            <TabellWrapper>
                <TabellHeader Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Utvandring utvandringer={utvandringer} />
            </TabellWrapper>
        );
    } else if (utvandringer.length == 0) {
        return (
            <TabellWrapper>
                <TabellHeader Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Innvandring innvandringer={innvandringer} />
            </TabellWrapper>
        );
    } else {
        return (
            <TabellWrapper erDobbelTabell>
                <TabellHeader Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
                <Innvandring innvandringer={innvandringer} />
                <Utvandring utvandringer={utvandringer} />
            </TabellWrapper>
        );
    }
};

const Innvandring: React.FC<{ innvandringer: IInnflyttingTilNorge[] }> = ({ innvandringer }) => {
    return (
        <table className="tabell første-tabell">
            <KolonneTitler titler={['Innvandret fra', 'Dato', '', '']} />
            <tbody>
                {innvandringer.map((innflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <BredTd>{innflytting.fraflyttingsland}</BredTd>
                            <BredTd>{innflytting.folkeregistermetadata.gyldighetstidspunkt}</BredTd>
                            <BredTd />
                            <BredTd />
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const Utvandring: React.FC<{ utvandringer: IUtflyttingFraNorge[] }> = ({ utvandringer }) => {
    return (
        <table className="tabell andre-tabell">
            <KolonneTitler titler={['Utvandret til', 'Dato', '', '']} />
            <tbody>
                {utvandringer.map((utflytting, indeks) => {
                    return (
                        <tr key={indeks}>
                            <BredTd>{utflytting.tilflyttingsland}</BredTd>
                            <BredTd>{utflytting.folkeregistermetadata.gyldighetstidspunkt}</BredTd>
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
