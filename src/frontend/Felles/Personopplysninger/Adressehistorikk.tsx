import React, { useState } from 'react';
import Bygning from '../Ikoner/Bygning';
import { AdresseType, IAdresse } from '../../App/typer/personopplysninger';
import { IngenData, KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import styled from 'styled-components';
import Beboere from './Beboere';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { ModalWrapper } from '../Modal/ModalWrapper';
import UtvidPanel from '../UtvidPanel/UtvidPanel';
import { Button, Table } from '@navikt/ds-react';
import { BodyLongSmall } from '../Visningskomponenter/Tekster';
import PersonopplysningerPanel from './PersonopplysningPanel';

const StyledFlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Knapp = styled(Button)`
    padding-left: 1.25rem;
    padding-right: 1.25rem;
`;

const FetTekst = styled.span`
    font-weight: bold;
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

const TittelbeskrivelseBostedsadresser: React.ReactElement = (
    <>
        <BodyLongSmall>
            <FetTekst>Gjeldende adresse:</FetTekst>
            En person skal til enhver tid ha kun én folkeregistrert bostedsadresse. I EF Sak er
            denne adressen markert med "(gjeldende)". Vær oppmerksom på at det i noen tilfeller ikke
            vil være adressen med den nyeste fra-datoen som er gjeldende
        </BodyLongSmall>
        <BodyLongSmall>
            <FetTekst>Angitt flyttedato:</FetTekst>Datoen personen selv har oppgitt for flytting til
            ny bolig
        </BodyLongSmall>
        <BodyLongSmall>
            <FetTekst>Fra og med:</FetTekst>
            Folkeregisterets vedtaksdato for gyldighet på bostedsregistreringen
        </BodyLongSmall>
        <BodyLongSmall>
            <FetTekst>Til og med:</FetTekst>
            Folkeregisterets opphørsdato (dersom den er kjent). Personen er ikke registrert bosatt
            på adressen iht Folkeregisteret
        </BodyLongSmall>
    </>
);

const Adresser: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string; type?: AdresseType }> = ({
    adresser,
    fagsakPersonId,
    type,
}) => {
    return (
        <PersonopplysningerPanel
            Ikon={Bygning}
            tittel={type === AdresseType.BOSTEDADRESSE ? 'Bostedsadresser' : 'Andre adresser'}
            tittelBeskrivelse={
                type === AdresseType.BOSTEDADRESSE
                    ? { header: 'Adresseforklaring ', innhold: TittelbeskrivelseBostedsadresser }
                    : undefined
            }
        >
            {(adresser.length !== 0 && (
                <SmallTabelMedTilpassetBredde>
                    <KolonneTitler
                        titler={[
                            'Adresse',
                            type === AdresseType.BOSTEDADRESSE
                                ? 'Angitt flyttedato'
                                : 'Adressetype',
                            'Fra og med',
                            'Til og med',
                        ]}
                    />

                    <Innhold adresser={adresser} fagsakPersonId={fagsakPersonId} />
                </SmallTabelMedTilpassetBredde>
            )) || <IngenData />}
        </PersonopplysningerPanel>
    );
};

const Innhold: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string }> = ({
    adresser,
    fagsakPersonId,
}) => {
    const [beboereAdresseIModal, settBeboereAdresseIModal] = useState<IAdresse>();
    return (
        <>
            <Table.Body>
                {adresser.map((adresse, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <Table.DataCell>
                                {adresse.visningsadresse}
                                {adresse.erGjeldende ? ' (gjeldende)' : ''}
                            </Table.DataCell>
                            <Table.DataCell>
                                {adresse.type === AdresseType.BOSTEDADRESSE
                                    ? formaterNullableIsoDato(adresse.angittFlyttedato)
                                    : adresse.type}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(adresse.gyldigFraOgMed)}
                            </Table.DataCell>
                            <Table.DataCell>
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
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
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
