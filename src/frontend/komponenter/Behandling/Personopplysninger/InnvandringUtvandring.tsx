import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../typer/personopplysninger';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
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
            </TabellWrapper>
        );
    }

    return (
        <TabellWrapper erDobbelTabell>
            <TabellHeader Ikon={FlyMedSky} tittel={'Innvandring og utvandring'} />
            {innvandringer.length == 0 && utvandringer.length == 0}
            <table className="tabell" id={'første-tabell'}>
                <KolonneTitler titler={['Innvandret fra', 'Dato', '', '']} />
                <tbody>
                    {innvandringer.map((innflytting, indeks) => {
                        return (
                            <tr key={indeks}>
                                <BredTd>{innflytting.fraflyttingsland}</BredTd>
                                <BredTd>
                                    {innflytting.folkeregistermetadata.gyldighetstidspunkt}
                                </BredTd>
                                <BredTd />
                                <BredTd />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <table className="tabell" id={'andre-tabell'}>
                <KolonneTitler titler={['Utvandret til', 'Dato', '', '']} />
                <tbody>
                    {utvandringer.map((utflytting, indeks) => {
                        return (
                            <tr key={indeks}>
                                <BredTd>{utflytting.tilflyttingsland}</BredTd>
                                <BredTd>
                                    {utflytting.folkeregistermetadata.gyldighetstidspunkt}
                                </BredTd>
                                <BredTd />
                                <BredTd />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default InnvandringUtVandring;
