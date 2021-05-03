import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import SkrivendeBlyant from '../../../ikoner/SkrivendeBlyant';
import { BredTd, KolonneTitler, IngenData, TabellWrapper } from './TabellWrapper';
import { IFullmakt } from '../../../typer/personopplysninger';
import { formaterNullableIsoDato } from '../../../utils/formatter';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] }> = ({ fullmakter }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={SkrivendeBlyant} tittel={'Fullmakter'} />
            {(fullmakter.length !== 0 && (
                <table className="tabell">
                    <KolonneTitler titler={['Fullmektig', 'Fødselsnummer', 'Fra', 'Til']} />
                    <tbody>
                        {fullmakter.map((fullmakt, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>{fullmakt.navn}</BredTd>
                                    <BredTd>{fullmakt.motpartsPersonident}</BredTd>
                                    <BredTd>
                                        {formaterNullableIsoDato(fullmakt.gyldigFraOgMed)}
                                    </BredTd>
                                    <BredTd>
                                        {formaterNullableIsoDato(fullmakt.gyldigTilOgMed)}
                                    </BredTd>
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
