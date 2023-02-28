import React from 'react';
import SkrivendeBlyant from '../Ikoner/SkrivendeBlyant';
import { BredTd, IngenData, KolonneTitler } from './TabellWrapper';
import { IFullmakt } from '../../App/typer/personopplysninger';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] }> = ({ fullmakter }) => {
    return (
        <PersonopplysningerPanel Ikon={SkrivendeBlyant} tittel={'Fullmakter'}>
            {(fullmakter.length !== 0 && (
                <table className="tabell">
                    <KolonneTitler
                        titler={['Fullmektig', 'Områder', 'Fødselsnummer', 'Fra', 'Til']}
                    />
                    <tbody>
                        {fullmakter.map((fullmakt, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>{fullmakt.navn}</BredTd>
                                    <BredTd>{fullmakt.områder.join()}</BredTd>
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
        </PersonopplysningerPanel>
    );
};

export default Fullmakter;
