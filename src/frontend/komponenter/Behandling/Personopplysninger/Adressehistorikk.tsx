import React, { useEffect, useState } from 'react';
import TabellOverskrift from './TabellOverskrift';
import Bygning from '../../../ikoner/Bygning';
import { AdresseType, IAdresse, ISøkeresultatPerson } from '../../../typer/personopplysninger';
import UIModalWrapper from '../../Felleskomponenter/Modal/UIModalWrapper';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../typer/ressurs';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { datoErEtterDagensDato } from '../../../utils/utils';

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

const gyldigTilOgMedErNullEllerFremITid = (adresse: IAdresse) =>
    !adresse.gyldigTilOgMed || datoErEtterDagensDato(adresse.gyldigTilOgMed);

const Innhold: React.FC<{ adresser: IAdresse[] }> = ({ adresser }) => {
    const [beboereAdresseIModal, settBeboereAdresseIModal] = useState<IAdresse>();

    return (
        <>
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
                                    {adresse.type === AdresseType.BOSTEDADRESSE &&
                                        gyldigTilOgMedErNullEllerFremITid(adresse) && (
                                            <StyledKnapp
                                                onClick={() => settBeboereAdresseIModal(adresse)}
                                                mini
                                            >
                                                Se Beboere
                                            </StyledKnapp>
                                        )}
                                </StyledFlexDiv>
                            </BredTd>
                        </tr>
                    );
                })}
            </tbody>
            {beboereAdresseIModal && (
                <UIModalWrapper
                    modal={{
                        tittel: 'Beboere',
                        lukkKnapp: true,
                        visModal: true,
                        onClose: () => settBeboereAdresseIModal(undefined),
                    }}
                >
                    <Beboere adresse={beboereAdresseIModal} />
                </UIModalWrapper>
            )}
        </>
    );
};

const Beboere: React.FC<{ adresse: IAdresse }> = ({ adresse }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    useEffect(() => {
        sokPerson();
    }, []);

    const sokPerson = () => {
        axiosRequest<ISøkeresultatPerson, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/sok/person/adresse`,
            data: adresse.bostedsadresse,
        }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
            settSøkResultat(respons);
        });
    };

    return (
        <DataViewer response={{ søkResultat }}>
            {({ søkResultat }) => {
                return (
                    <>
                        <TabellWrapper>
                            <table className="tabell">
                                <KolonneTitler titler={['Navn', 'Fødselsnummer', 'Adresse']} />
                                {søkResultat.hits.map((beboer, indeks) => {
                                    return (
                                        <tr key={indeks}>
                                            <BredTd>{beboer.visningsnavn}</BredTd>
                                            <BredTd>{beboer.personIdent}</BredTd>
                                            <BredTd>{beboer.visningsadresse}</BredTd>
                                        </tr>
                                    );
                                })}
                            </table>
                        </TabellWrapper>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Adressehistorikk;
