import React, { FC } from 'react';
import { IAktivitet } from '../../../../typer/overgangsstønad';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';

interface Props {
    aktivitet: IAktivitet;
    vilkårStatus: VilkårStatus;
}
const AktivitetVisning: FC<Props> = ({ aktivitet, vilkårStatus }) => {
    const { arbeidssituasjon, selvstendig } = aktivitet;
    console.log(aktivitet);
    return (
        <>
            <StyledTabell kolonner={3}>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                <div className="tittel fjernSpacing">
                    <Undertittel>Aktivitet</Undertittel>
                </div>
            </StyledTabell>
            <StyledTabell kolonner={3}>
                {arbeidssituasjon.includes(EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr) && (
                    <>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr]}
                        </Element>
                    </>
                )}
            </StyledTabell>
            <StyledTabell kolonner={3}>
                {arbeidssituasjon.includes(
                    EArbeidssituasjon.erSelvstendigNæringsdriveneEllerFrilanser
                ) &&
                    selvstendig &&
                    selvstendig.map((firma) => (
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
                            <Normaltekst className={'førsteDataKolonne'}>
                                Organisasjonsnummer
                            </Normaltekst>
                            <Normaltekst>{firma.organisasjonsnummer}</Normaltekst>
                            <Normaltekst className={'førsteDataKolonne'}>
                                Etableringsdato
                            </Normaltekst>
                            <Normaltekst>{firma.etableringsdato}</Normaltekst>
                            <Normaltekst className={'førsteDataKolonne'}>
                                Stillingsprosent
                            </Normaltekst>
                            <Normaltekst>{firma.arbeidsmengde + ' %'}</Normaltekst>
                            <Normaltekst className={'førsteDataKolonne'}>
                                Beskrivelse av arbeidsuke
                            </Normaltekst>
                            <Normaltekst>{firma.hvordanSerArbeidsukenUt}</Normaltekst>
                        </>
                    ))}
            </StyledTabell>
        </>
    );
};

export default AktivitetVisning;
