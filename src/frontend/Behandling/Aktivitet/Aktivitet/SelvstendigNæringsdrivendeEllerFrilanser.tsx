import React, { FC } from 'react';
import { ISelvstendig } from '../../../typer/overgangsstønad';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../utils/formatter';

const SelvstendigNæringsdrivendeEllerFrilanser: FC<{ firma: ISelvstendig }> = ({ firma }) => {
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
            <Normaltekst>{firma.arbeidsmengde + ' %'}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Beskrivelse av arbeidsuke</Normaltekst>
            <Normaltekst>{firma.hvordanSerArbeidsukenUt}</Normaltekst>
        </>
    );
};

export default SelvstendigNæringsdrivendeEllerFrilanser;
