import React from 'react';
import TabellHeader from './TabellHeader';
import SkrivendeBlyant from '../../../ikoner/SkrivendeBlyant';
import { BredTd, KolonneTitler, IngenData, TabellWrapper } from './TabellWrapper';
import { IFullmakt } from '../../../typer/personopplysninger';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] }> = ({ fullmakter }) => {
    return (
        <TabellWrapper>
            <TabellHeader Ikon={SkrivendeBlyant} tittel={'Fullmakter'} />
            {(fullmakter.length != 0 && (
                <table className="tabell">
                    <KolonneTitler titler={['Fullmektig', 'Fødselsnummer', 'Fra', 'Til']} />
                    <tbody>
                        {fullmakter.map((fullmakt, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>{fullmakt.navn}</BredTd>
                                    <BredTd>{fullmakt.motpartsPersonident}</BredTd>
                                    <BredTd>{fullmakt.gyldigFraOgMed}</BredTd>
                                    <BredTd>{fullmakt.gyldigFraOgMed}</BredTd>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )) || <IngenData />}
        </TabellWrapper>
    );
};

export default Fullmakter;
