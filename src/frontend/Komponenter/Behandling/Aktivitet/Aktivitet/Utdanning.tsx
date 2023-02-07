import React, { FC } from 'react';
import { ITidligereUtdanning, IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    ArbeidssituasjonTilTekst,
    EArbeidssituasjon,
    StudieandelTilTekst,
    UtdanningsformTilTekst,
} from './typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { formaterIsoMånedÅr, formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';
import TabellVisning from '../../Tabell/TabellVisning';

export const UnderUtdanning: FC<{
    underUtdanning: IUnderUtdanning;
}> = ({ underUtdanning }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <SmallTextLabel className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.tarUtdanning]}
            </SmallTextLabel>

            <BodyShortSmall className={'førsteDataKolonne'}>Skole/Utdanningssted</BodyShortSmall>
            <BodyShortSmall> {underUtdanning.skoleUtdanningssted}</BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne'}>Linje/Kurs/Grad</BodyShortSmall>
            <BodyShortSmall> {underUtdanning.linjeKursGrad}</BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne'}>Offentlig eller privat</BodyShortSmall>
            <BodyShortSmall>
                {UtdanningsformTilTekst[underUtdanning.offentligEllerPrivat]}
            </BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne'}>Studiets tidsperiode</BodyShortSmall>
            <BodyShortSmall>{`${formaterNullableIsoDato(
                underUtdanning.fra
            )} - ${formaterNullableIsoDato(underUtdanning.til)}`}</BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne'}>Heltid eller deltid</BodyShortSmall>
            <BodyShortSmall>
                {' '}
                {StudieandelTilTekst[underUtdanning.heltidEllerDeltid]}
            </BodyShortSmall>

            {underUtdanning.hvorMyeSkalDuStudere && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        Hvor mye skal søker studere
                    </BodyShortSmall>
                    <BodyShortSmall> {underUtdanning.hvorMyeSkalDuStudere + ' %'}</BodyShortSmall>
                </>
            )}

            <BodyShortSmall className={'førsteDataKolonne'}>Målet for utdanningen</BodyShortSmall>
            <BodyShortSmall> {underUtdanning.hvaErMåletMedUtdanningen}</BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne  leggTilSpacing'}>
                Har søker utdanning etter grunnskolen
            </BodyShortSmall>
            <BooleanTekst value={underUtdanning.utdanningEtterGrunnskolen} />
        </>
    );
};

export const TidligereUtdanninger: FC<{ tidligereUtdanninger?: ITidligereUtdanning[] }> = ({
    tidligereUtdanninger,
}) => {
    return tidligereUtdanninger ? (
        <TabellVisning
            ikonVisning={true}
            verdier={tidligereUtdanninger}
            kolonner={[
                {
                    overskrift: 'Linje/kurs/grad',
                    tekstVerdi: (d) => d.linjeKursGrad,
                },
                {
                    overskrift: 'Tidsperiode',
                    tekstVerdi: (d) =>
                        `${formaterIsoMånedÅr(d.fra)} - ${formaterIsoMånedÅr(d.til)}`,
                },
            ]}
        />
    ) : null;
};
