import React from 'react';
import { BredTd, KolonneTitler } from './TabellWrapper';
import { Folkeregisterpersonstatus, IStatsborgerskap } from '../../App/typer/personopplysninger';
import Pass from '../Ikoner/Pass';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';

const Statsborgerskap: React.FC<{
    statsborgerskap: IStatsborgerskap[];
    folkeregisterPersonstatus?: Folkeregisterpersonstatus;
}> = ({ statsborgerskap, folkeregisterPersonstatus }) => {
    return (
        <PersonopplysningerPanel Ikon={Pass} tittel={'Statsborgerskap'}>
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
        </PersonopplysningerPanel>
    );
};

export default Statsborgerskap;
