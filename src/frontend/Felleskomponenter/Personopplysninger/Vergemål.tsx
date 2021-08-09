import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import SkrivendeBlyant from '../../ikoner/SkrivendeBlyant';
import { BredTd, IngenData, KolonneTitler, TabellWrapper } from './TabellWrapper';
import {
    IVergemål,
    vergemålOmfangTilTekst,
    vergemålTypeTilTekst,
} from '../../typer/personopplysninger';
import { tekstMapping } from '../../utils/tekstmapping';

const Vergemål: React.FC<{ vergemål: IVergemål[] }> = ({ vergemål }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={SkrivendeBlyant} tittel={'Vergemål'} />
            {(vergemål.length !== 0 && (
                <table className="tabell">
                    <KolonneTitler
                        titler={['Type', 'Omfang', 'Verge', 'Fødselsnummer', 'Embete']}
                    />
                    <tbody>
                        {vergemål.map((vergemål, indeks) => {
                            return (
                                <tr key={indeks}>
                                    <BredTd>
                                        {tekstMapping(vergemål.type, vergemålTypeTilTekst)}
                                    </BredTd>
                                    <BredTd>
                                        {tekstMapping(vergemål.omfang, vergemålOmfangTilTekst)}
                                    </BredTd>
                                    <BredTd>{vergemål.navn}</BredTd>
                                    <BredTd>{vergemål.motpartsPersonident}</BredTd>
                                    <BredTd>{vergemål.embete}</BredTd>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )) || <IngenData />}
        </TabellWrapper>
    );
};

export default Vergemål;
