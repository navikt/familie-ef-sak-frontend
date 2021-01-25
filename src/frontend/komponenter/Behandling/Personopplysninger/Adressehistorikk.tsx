import React, { useState } from 'react';
import TabellOverskrift from './TabellOverskrift';
import Bygning from '../../../ikoner/Bygning';
import { AdresseType, IAdresse } from '../../../typer/personopplysninger';
import UIModalWrapper from '../../Felleskomponenter/Modal/UIModalWrapper';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import Lesmerpanel from 'nav-frontend-lesmerpanel';

const StyledKnapp = styled(Knapp)`
    margin-left: 1rem;
`;

const StyledFlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledLesmer = styled(Lesmerpanel)`
    .lesMerPanel__mer {
        padding-top: 0rem;
    }
`;

const StyledTabellWrapper = styled(TabellWrapper)`
    padding-top: 0rem;
`;

const MAX_LENGDE_ADRESSER = 5;

const Adressehistorikk: React.FC<{ adresser: IAdresse[] }> = ({ adresser }) => {
    if (adresser.length <= MAX_LENGDE_ADRESSER) {
        return <Adresser adresser={adresser} />;
    } else {
        const introAdresser = adresser.slice(0, MAX_LENGDE_ADRESSER);
        const visMerAdresser = adresser.slice(MAX_LENGDE_ADRESSER, adresser.length);
        return (
            <StyledLesmer
                className={'adresser'}
                intro={<Adresser adresser={introAdresser} />}
                apneTekst={'Vis flere adresser'}
                lukkTekst={'Skjul adresser'}
            >
                <StyledTabellWrapper>
                    <table className="tabell" style={{ borderTopStyle: 'hidden' }}>
                        <Innhold adresser={visMerAdresser} />
                    </table>
                </StyledTabellWrapper>
            </StyledLesmer>
        );
    }
};

const Adresser: React.FC<{ adresser: IAdresse[] }> = ({ adresser }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Bygning} tittel={'Adressehistorikk'} />
            <table className="tabell">
                <KolonneTitler titler={['Adresse', 'Adressetype', 'Fra', 'Til']} />
                <Innhold adresser={adresser} />
            </table>
        </TabellWrapper>
    );
};

const Innhold: React.FC<{ adresser: IAdresse[] }> = ({ adresser }) => {
    const [visBeboereModal, settVisBeboereModal] = useState(false);
    return (
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
                                    <StyledKnapp onClick={() => settVisBeboereModal(true)} mini>
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
    );
};

export default Adressehistorikk;
