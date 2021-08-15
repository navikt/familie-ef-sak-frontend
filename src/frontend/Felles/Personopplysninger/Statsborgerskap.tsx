import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import { Folkeregisterpersonstatus, IStatsborgerskap } from '../../App/typer/personopplysninger';
import Pass from '../Ikoner/Pass';
import { formaterNullableIsoDato } from '../../App/utils/formatter';

const Statsborgerskap: React.FC<{
    statsborgerskap: IStatsborgerskap[];
    folkeregisterPersonstatus?: Folkeregisterpersonstatus;
}> = ({ statsborgerskap, folkeregisterPersonstatus }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Pass} tittel={'Statsborgerskap'} />
            <table className="tabell">
                <KolonneTitler titler={['Land', 'Fra', 'Til', 'Personstatus']} />
                <tbody>
                    {statsborgerskap.map((statsborgerskap, indeks) => {
                        return (
                            <tr key={indeks}>
                                <BredTd>{statsborgerskap.land}</BredTd>
                                <BredTd>
                                    {formaterNullableIsoDato(statsborgerskap.gyldigFraOgMedDato)}
                                </BredTd>
                                <BredTd>
                                    {formaterNullableIsoDato(statsborgerskap.gyldigTilOgMedDato)}
                                </BredTd>
                                <BredTd>
                                    {statsborgerskap.land.toLowerCase() === 'norge' &&
                                        folkeregisterPersonstatus}
                                </BredTd>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default Statsborgerskap;
