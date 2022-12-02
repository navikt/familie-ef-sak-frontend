import React, { FC } from 'react';
import { ISelvstendig } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';

const SelvstendigNæringsdrivendeEllerFrilanser: FC<{
    firma: ISelvstendig;
    stønadstype: Stønadstype;
}> = ({ firma, stønadstype }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <SmallTextLabel className={'undertittel'}>
                {
                    ArbeidssituasjonTilTekst[
                        EArbeidssituasjon.erSelvstendigNæringsdriveneEllerFrilanser
                    ]
                }
            </SmallTextLabel>
            <BodyShortSmall className={'førsteDataKolonne'}> Firma</BodyShortSmall>
            <BodyShortSmall> {firma.firmanavn}</BodyShortSmall>
            <BodyShortSmall className={'førsteDataKolonne'}>Organisasjonsnummer</BodyShortSmall>
            <BodyShortSmall>{firma.organisasjonsnummer}</BodyShortSmall>
            <BodyShortSmall className={'førsteDataKolonne'}>Etableringsdato</BodyShortSmall>
            <BodyShortSmall>{formaterNullableIsoDato(firma.etableringsdato)}</BodyShortSmall>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        Stillingsprosent
                    </BodyShortSmall>
                    <BodyShortSmall>{firma.arbeidsmengde + ' %'}</BodyShortSmall>
                </>
            )}
            {(stønadstype === Stønadstype.OVERGANGSSTØNAD ||
                stønadstype === Stønadstype.BARNETILSYN) && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        Beskrivelse av arbeidsuke
                    </BodyShortSmall>
                    <BodyShortSmall>{firma.hvordanSerArbeidsukenUt}</BodyShortSmall>
                </>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeEllerFrilanser;
