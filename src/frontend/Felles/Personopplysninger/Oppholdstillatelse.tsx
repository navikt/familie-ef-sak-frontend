import React from 'react';
import { BredTd, IngenData, KolonneTitler } from './TabellWrapper';
import { IOppholdstillatelse, oppholdTilTekst } from '../../App/typer/personopplysninger';
import Pass from '../Ikoner/Pass';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';

const Oppholdstillatelse: React.FC<{ oppholdstillatelser: IOppholdstillatelse[] }> = ({
    oppholdstillatelser,
}) => {
    return (
        <PersonopplysningerPanel Ikon={Pass} tittel={'Oppholdstillatelse'}>
            {(oppholdstillatelser.length !== 0 && (
                <table className="tabell">
                    <KolonneTitler titler={['Type', 'Fra', 'Til', '']} />
                    <tbody>
                        {oppholdstillatelser.map((oppholdstillatelse, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>
                                        {oppholdTilTekst[oppholdstillatelse.oppholdstillatelse]}
                                    </BredTd>
                                    <BredTd>
                                        {formaterNullableIsoDato(oppholdstillatelse.fraDato)}
                                    </BredTd>
                                    <BredTd>
                                        {formaterNullableIsoDato(oppholdstillatelse.tilDato)}
                                    </BredTd>
                                    <BredTd />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )) || <IngenData />}
        </PersonopplysningerPanel>
    );
};

export default Oppholdstillatelse;
