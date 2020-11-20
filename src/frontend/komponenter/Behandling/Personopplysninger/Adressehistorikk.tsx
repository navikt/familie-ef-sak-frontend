import React, { useState } from 'react';
import TabellOverskrift from './TabellOverskrift';
import Bygning from '../../../ikoner/Bygning';
import { AdresseType, IAdresse } from '../../../typer/personopplysninger';
import UIModalWrapper from '../../Felleskomponenter/Modal/UIModalWrapper';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';

const StyledKnapp = styled(Knapp)`
    margin-left: 1rem;
`;

const StyledFlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Adressehistorikk: React.FC<{ adresser: IAdresse[] }> = ({ adresser }) => {
    const [visBeboereModal, settVisBeboereModal] = useState(false);
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Bygning} tittel={'Adressehistorikk'} />
            <table className="tabell">
                <KolonneTitler titler={['Adresse', 'Adressetype', 'Fra', 'Til']} />
                <tbody>
                    {adresser.map((adresse, indeks) => {
                        return (
                            <tr key={indeks}>
                                <BredTd>{adresse.visningsadresse}</BredTd>
                                <BredTd>{adresse.type}</BredTd>
                                <BredTd>{adresse.gyldigFraOgMed}</BredTd>
                                <BredTd>
                                    <StyledFlexDiv>
                                        <div>{adresse.gyldigTilOgMed}</div>
                                        {adresse.type === AdresseType.BOSTEDADRESSE && (
                                            <StyledKnapp
                                                onClick={() => settVisBeboereModal(true)}
                                                mini
                                            >
                                                Se Beboere
                                            </StyledKnapp>
                                        )}
                                        <UIModalWrapper
                                            modal={{
                                                tittel: 'Beboere',
                                                lukkKnapp: true,
                                                visModal: visBeboereModal,
                                                onClose: () => settVisBeboereModal(false),
                                            }}
                                        >
                                            *Ikke implementert. Venter på adressesøk i PDL*
                                        </UIModalWrapper>
                                    </StyledFlexDiv>
                                </BredTd>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default Adressehistorikk;
