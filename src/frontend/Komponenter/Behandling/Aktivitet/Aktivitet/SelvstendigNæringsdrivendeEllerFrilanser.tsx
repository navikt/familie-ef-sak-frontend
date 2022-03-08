import React, { FC } from 'react';
import { ISelvstendig } from '../../../../App/typer/overgangsstønad';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const SelvstendigNæringsdrivendeEllerFrilanser: FC<{
    firma: ISelvstendig;
    stønadstype: Stønadstype;
}> = ({ firma, stønadstype }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {
                    ArbeidssituasjonTilTekst[
                        EArbeidssituasjon.erSelvstendigNæringsdriveneEllerFrilanser
                    ]
                }
            </Element>
            <Normaltekst className={'førsteDataKolonne'}> Firma</Normaltekst>
            <Normaltekst> {firma.firmanavn}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Organisasjonsnummer</Normaltekst>
            <Normaltekst>{firma.organisasjonsnummer}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Etableringsdato</Normaltekst>
            <Normaltekst>{formaterNullableIsoDato(firma.etableringsdato)}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Stillingsprosent</Normaltekst>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Normaltekst>{firma.arbeidsmengde + ' %'}</Normaltekst>
            )}
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Normaltekst className={'førsteDataKolonne'}>Beskrivelse av arbeidsuke</Normaltekst>
            )}
            <Normaltekst>{firma.hvordanSerArbeidsukenUt}</Normaltekst>
        </>
    );
};

export default SelvstendigNæringsdrivendeEllerFrilanser;
