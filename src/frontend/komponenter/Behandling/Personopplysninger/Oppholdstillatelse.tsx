import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import { BredTd, KolonneTitler, IngenData, TabellWrapper } from './TabellWrapper';
import { IOppholdstillatelse } from '../../../typer/personopplysninger';
import Pass from '../../../ikoner/Pass';

const Oppholdstillatelse: React.FC<{ oppholdstillatelser: IOppholdstillatelse[] }> = ({
    oppholdstillatelser,
}) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Pass} tittel={'Oppholdstillatelse'} />
            {(oppholdstillatelser.length != 0 && (
                <table className="tabell">
                    <KolonneTitler titler={['Type', 'Fra', 'Til', '']} />
                    <tbody>
                        {oppholdstillatelser.map((oppholdstillatelse, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>{oppholdstillatelse.oppholdstillatelse}</BredTd>
                                    <BredTd>
                                        {oppholdstillatelse.fraDato && oppholdstillatelse.fraDato}
                                    </BredTd>
                                    <BredTd>
                                        {oppholdstillatelse.tilDato && oppholdstillatelse.tilDato}
                                    </BredTd>
                                    <BredTd />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )) || <IngenData />}
        </TabellWrapper>
    );
};

export default Oppholdstillatelse;
