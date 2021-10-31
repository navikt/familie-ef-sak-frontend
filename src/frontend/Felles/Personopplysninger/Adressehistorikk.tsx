import React, { useState } from 'react';
import TabellOverskrift from './TabellOverskrift';
import Bygning from '../Ikoner/Bygning';
import { AdresseType, IAdresse } from '../../App/typer/personopplysninger';
import UIModalWrapper from '../Modal/UIModalWrapper';
import { Element } from 'nav-frontend-typografi';
import { TabellWrapper, Td } from './TabellWrapper';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { datoErEtterDagensDato } from '../../App/utils/utils';
import Beboere from './Beboere';
import { formaterNullableIsoDato } from '../../App/utils/formatter';

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

const MAX_LENGDE_ADRESSER = 5;

const Adressehistorikk: React.FC<{ adresser: IAdresse[]; fagsakId: string }> = ({
    adresser,
    fagsakId,
}) => {
    const [isClosed, setIsClosed] = useState<boolean>(true);
    if (adresser.length <= MAX_LENGDE_ADRESSER) {
        return <Adresser adresser={adresser} fagsakId={fagsakId} />;
    } else {
        const introAdresser = adresser.slice(0, MAX_LENGDE_ADRESSER);
        return (
            <StyledLesmer
                onOpen={() => setIsClosed(false)}
                onClose={() => setIsClosed(true)}
                className={'adresser'}
                intro={isClosed && <Adresser adresser={introAdresser} fagsakId={fagsakId} />}
                apneTekst={'Vis flere adresser'}
                lukkTekst={'Skjul adresser'}
            >
                <Adresser adresser={adresser} fagsakId={fagsakId} />
            </StyledLesmer>
        );
    }
};

const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
    <Td width={`${width}%`}>
        <Element>{text}</Element>
    </Td>
);

const Adresser: React.FC<{ adresser: IAdresse[]; fagsakId: string }> = ({ adresser, fagsakId }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Bygning} tittel={'Adressehistorikk'} />
            <table className="tabell">
                <thead>
                    <tr>
                        <Kolonnetittel text={'Adresse'} width={35} />
                        <Kolonnetittel text={'Adressetype'} width={15} />
                        <Kolonnetittel text={'Angitt flyttedato'} width={15} />
                        <Kolonnetittel text={'Fra'} width={15} />
                        <Kolonnetittel text={'Til'} width={20} />
                    </tr>
                </thead>
                <Innhold adresser={adresser} fagsakId={fagsakId} />
            </table>
        </TabellWrapper>
    );
};

const gyldigTilOgMedErNullEllerFremITid = (adresse: IAdresse) =>
    !adresse.gyldigTilOgMed || datoErEtterDagensDato(adresse.gyldigTilOgMed);

const Innhold: React.FC<{ adresser: IAdresse[]; fagsakId: string }> = ({ adresser, fagsakId }) => {
    const [beboereAdresseIModal, settBeboereAdresseIModal] = useState<IAdresse>();
    return (
        <>
            <tbody>
                {adresser.map((adresse, indeks) => {
                    return (
                        <tr key={indeks}>
                            <Td>{adresse.visningsadresse}</Td>
                            <Td>{adresse.type}</Td>
                            <Td>{formaterNullableIsoDato(adresse.angittFlyttedato)}</Td>
                            <Td>{formaterNullableIsoDato(adresse.gyldigFraOgMed)}</Td>
                            <Td>
                                <StyledFlexDiv>
                                    <div style={{ margin: 'auto 0' }}>
                                        {formaterNullableIsoDato(adresse.gyldigTilOgMed)}
                                    </div>
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
                            </Td>
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
                    <Beboere fagsakId={fagsakId} />
                </UIModalWrapper>
            )}
        </>
    );
};

export default Adressehistorikk;
