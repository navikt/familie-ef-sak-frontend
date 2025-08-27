import React, { useState } from 'react';
import Bygning from '../Ikoner/Bygning';
import { AdresseType, IAdresse } from '../../App/typer/personopplysninger';
import { KolonneTitler, SmallTable } from './TabellWrapper';
import Beboere from './Beboere';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { ModalWrapper } from '../Modal/ModalWrapper';
import UtvidPanel from '../UtvidPanel/UtvidPanel';
import { BodyShort, Button, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import PersonopplysningerPanel from './PersonopplysningPanel';

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
    <VStack gap="4">
        <HStack>
            <BodyShort weight={'semibold'} size={'small'}>
                Gjeldende adresse:{' '}
            </BodyShort>

            <BodyShort size={'small'}>
                En person skal til enhver tid ha kun én folkeregistrert bostedsadresse. I EF Sak er
                denne adressen markert med "(gjeldende)". Vær oppmerksom på at det i noen tilfeller
                ikke vil være adressen med den nyeste fra-datoen som er gjeldende
            </BodyShort>
        </HStack>
        <HStack>
            <BodyShort weight={'semibold'} size={'small'}>
                Angitt flyttedato:{' '}
            </BodyShort>
            <BodyShort size={'small'}>
                Datoen personen selv har oppgitt for flytting til ny bolig
            </BodyShort>
        </HStack>
        <HStack>
            <BodyShort weight={'semibold'} size={'small'}>
                Fra og med:{' '}
            </BodyShort>
            <BodyShort size={'small'}>
                Folkeregisterets vedtaksdato for gyldighet på bostedsregistreringen
            </BodyShort>
        </HStack>
        <HStack>
            <BodyShort weight={'semibold'} size={'small'}>
                Til og med:{' '}
            </BodyShort>
            <BodyShort size={'small'}>
                Folkeregisterets opphørsdato (dersom den er kjent). Personen er ikke registrert
                bosatt på adressen iht Folkeregisteret
            </BodyShort>
        </HStack>
    </VStack>
);

const Adresser: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string; type?: AdresseType }> = ({
    adresser,
    fagsakPersonId,
    type,
}) => {
    const tittelBeskrivelse =
        type === AdresseType.BOSTEDADRESSE
            ? { header: 'Adresseforklaring ', innhold: TittelbeskrivelseBostedsadresser }
            : undefined;

    const kolonneTitler = [
        'Adresse',
        type === AdresseType.BOSTEDADRESSE ? 'Angitt flyttedato' : 'Type',
        'Fra og med',
        'Til og med',
        '',
    ];

    return (
        <PersonopplysningerPanel
            Ikon={Bygning}
            tittel={type === AdresseType.BOSTEDADRESSE ? 'Bostedsadresser' : 'Andre adresser'}
            tittelBeskrivelse={tittelBeskrivelse}
        >
            {adresser.length !== 0 && (
                <SmallTable>
                    <KolonneTitler titler={kolonneTitler} />
                    <Innhold adresser={adresser} fagsakPersonId={fagsakPersonId} />
                </SmallTable>
            )}
        </PersonopplysningerPanel>
    );
};

const Innhold: React.FC<{ adresser: IAdresse[]; fagsakPersonId: string }> = ({
    adresser,
    fagsakPersonId,
}) => {
    const [beboereAdresseIModal, settBeboereAdresseIModal] = useState<IAdresse>();
    const [henterBeboere, settHenterBeboere] = useState<boolean>(false);
    return (
        <>
            <Table.Body>
                {adresser.map((adresse, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <Table.DataCell>
                                <HStack gap="2" align="center">
                                    {adresse.visningsadresse}
                                    {adresse.erGjeldende && (
                                        <Tag variant="success" size="small">
                                            Gjeldende
                                        </Tag>
                                    )}
                                </HStack>
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
                                {formaterNullableIsoDato(adresse.gyldigTilOgMed)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {adresse.type === AdresseType.BOSTEDADRESSE &&
                                    adresse.erGjeldende && (
                                        <Button
                                            onClick={() => settBeboereAdresseIModal(adresse)}
                                            variant={'secondary'}
                                            size={'xsmall'}
                                            type={'button'}
                                            disabled={henterBeboere}
                                        >
                                            {henterBeboere ? 'Henter beboere...' : 'Se Beboere'}
                                        </Button>
                                    )}
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
                <Beboere fagsakPersonId={fagsakPersonId} settHenterBeboere={settHenterBeboere} />
            </ModalWrapper>
        </>
    );
};

export default Adressehistorikk;
