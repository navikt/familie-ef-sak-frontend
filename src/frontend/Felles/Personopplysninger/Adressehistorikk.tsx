import React, { useState } from 'react';
import TabellOverskrift from './TabellOverskrift';
import Bygning from '../Ikoner/Bygning';
import { AdresseType, IAdresse } from '../../App/typer/personopplysninger';
import { IngenData, TabellWrapper, Td } from './TabellWrapper';
import styled from 'styled-components';
import Beboere from './Beboere';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { ModalWrapper } from '../Modal/ModalWrapper';
import UtvidPanel from '../UtvidPanel/UtvidPanel';
import { Button, HelpText, Label } from '@navikt/ds-react';

const StyledFlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Knapp = styled(Button)`
    padding-left: 1.25rem;
    padding-right: 1.25rem;
`;

const MAX_LENGDE_ADRESSER = 5;

const Adressehistorikk: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string }> = ({
    adresser,
    fagsakPersonId,
}) => {
    return (
        <>
            <AdressehistorikkMedLesMerKnapp
                fagsakPersonId={fagsakPersonId}
                adresser={adresser.filter((adresse) => adresse.type === AdresseType.BOSTEDADRESSE)}
                type={AdresseType.BOSTEDADRESSE}
            />
            <AdressehistorikkMedLesMerKnapp
                fagsakPersonId={fagsakPersonId}
                adresser={adresser.filter((adresse) => adresse.type !== AdresseType.BOSTEDADRESSE)}
            />
        </>
    );
};

const AdressehistorikkMedLesMerKnapp: React.FC<{
    adresser: IAdresse[];
    fagsakPersonId: string;
    type?: AdresseType;
}> = ({ adresser, fagsakPersonId, type }) => {
    const [isClosed, setIsClosed] = useState<boolean>(true);
    if (adresser.length <= MAX_LENGDE_ADRESSER) {
        return <Adresser adresser={adresser} fagsakPersonId={fagsakPersonId} type={type} />;
    } else {
        const introAdresser = adresser.slice(0, MAX_LENGDE_ADRESSER);
        return (
            <UtvidPanel
                åpen={!isClosed}
                onClick={() => setIsClosed(!isClosed)}
                intro={
                    isClosed && (
                        <Adresser
                            adresser={introAdresser}
                            fagsakPersonId={fagsakPersonId}
                            type={type}
                        />
                    )
                }
                knappTekst={isClosed ? 'Vis flere adresser' : 'Skjul adresser'}
            >
                <Adresser adresser={adresser} fagsakPersonId={fagsakPersonId} type={type} />
            </UtvidPanel>
        );
    }
};

const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
    <Td width={`${width}%`}>
        <Label as={'p'}>{text}</Label>
    </Td>
);

const TittelbeskrivelseBostedsadresser: React.ReactElement = (
    <HelpText title="Gjeldende" placement={'right'}>
        En person skal til enhver tid ha kun en folkeregistrert bostedsadresse. I EF Sak er denne
        adressen markert med "(gjeldende)". Vær oppmerksom på at det i noen tilfeller ikke vil være
        adressen med den nyeste fra-datoen som er gjeldende.
    </HelpText>
);

const Adresser: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string; type?: AdresseType }> = ({
    adresser,
    fagsakPersonId,
    type,
}) => {
    return (
        <TabellWrapper>
            <TabellOverskrift
                Ikon={Bygning}
                tittel={type === AdresseType.BOSTEDADRESSE ? 'Bostedsadresser' : 'Andre adresser'}
                tittelbeskrivelse={
                    type === AdresseType.BOSTEDADRESSE
                        ? TittelbeskrivelseBostedsadresser
                        : undefined
                }
            />
            {(adresser.length !== 0 && (
                <table className="tabell">
                    <thead>
                        <tr>
                            <Kolonnetittel text={'Adresse'} width={35} />
                            <Kolonnetittel
                                text={type === AdresseType.BOSTEDADRESSE ? '' : 'Adressetype'}
                                width={15}
                            />
                            <Kolonnetittel text={'Fra'} width={15} />
                            <Kolonnetittel text={'Til'} width={20} />
                        </tr>
                    </thead>
                    <Innhold adresser={adresser} fagsakPersonId={fagsakPersonId} />
                </table>
            )) || <IngenData />}
        </TabellWrapper>
    );
};

const Innhold: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string }> = ({
    adresser,
    fagsakPersonId,
}) => {
    const [beboereAdresseIModal, settBeboereAdresseIModal] = useState<IAdresse>();
    return (
        <>
            <tbody>
                {adresser.map((adresse, indeks) => {
                    return (
                        <tr key={indeks}>
                            <Td>
                                {adresse.visningsadresse}
                                {adresse.erGjeldende ? ' (gjeldende)' : ''}
                            </Td>
                            <Td>{adresse.type !== AdresseType.BOSTEDADRESSE && adresse.type}</Td>
                            <Td>
                                {formaterNullableIsoDato(
                                    adresse.type === AdresseType.BOSTEDADRESSE
                                        ? adresse.angittFlyttedato || adresse.gyldigFraOgMed
                                        : adresse.gyldigFraOgMed
                                )}
                            </Td>
                            <Td>
                                <StyledFlexDiv>
                                    <div style={{ margin: 'auto 0' }}>
                                        {formaterNullableIsoDato(adresse.gyldigTilOgMed)}
                                    </div>
                                    {adresse.type === AdresseType.BOSTEDADRESSE &&
                                        adresse.erGjeldende && (
                                            <Knapp
                                                onClick={() => settBeboereAdresseIModal(adresse)}
                                                variant={'secondary'}
                                                size={'small'}
                                                type={'button'}
                                            >
                                                Se Beboere
                                            </Knapp>
                                        )}
                                </StyledFlexDiv>
                            </Td>
                        </tr>
                    );
                })}
            </tbody>
            <ModalWrapper
                tittel={'Beboere'}
                visModal={beboereAdresseIModal != undefined}
                onClose={() => settBeboereAdresseIModal(undefined)}
                ariaLabel={'Tabell over beboere på bostedsadresse.'}
            >
                <Beboere fagsakPersonId={fagsakPersonId} />
            </ModalWrapper>
        </>
    );
};

export default Adressehistorikk;
