import React, { FC } from 'react';
import { ITidligereUtdanning, IUnderUtdanning } from '../../../../typer/overgangsstønad';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import {
    ArbeidssituasjonTilTekst,
    EArbeidssituasjon,
    StudieandelTilTekst,
    UtdanningsformTilTekst,
} from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { StyledTabellWrapper } from '../../../Felleskomponenter/Visning/StyledTabell';
import { formaterIsoMånedÅr, formaterNullableIsoDato } from '../../../../utils/formatter';

export const UnderUtdanning: FC<{
    underUtdanning: IUnderUtdanning;
}> = ({ underUtdanning }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.tarUtdanning]}
            </Element>

            <Normaltekst className={'førsteDataKolonne'}>Skole/Utdanningssted</Normaltekst>
            <Normaltekst> {underUtdanning.skoleUtdanningssted}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Linje/Kurs/Grad</Normaltekst>
            <Normaltekst> {underUtdanning.linjeKursGrad}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Offentlig eller privat</Normaltekst>
            <Normaltekst>{UtdanningsformTilTekst[underUtdanning.offentligEllerPrivat]}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Studiets tidsperiode</Normaltekst>
            <Normaltekst>{`${formaterNullableIsoDato(
                underUtdanning.fra
            )} - ${formaterNullableIsoDato(underUtdanning.til)}`}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Heltid eller deltid</Normaltekst>
            <Normaltekst> {StudieandelTilTekst[underUtdanning.heltidEllerDeltid]}</Normaltekst>

            {underUtdanning.hvorMyeSkalDuStudere && (
                <>
                    <Normaltekst className={'førsteDataKolonne'}>
                        Hvor mye skal søker studere
                    </Normaltekst>
                    <Normaltekst> {underUtdanning.hvorMyeSkalDuStudere + ' %'}</Normaltekst>
                </>
            )}

            <Normaltekst className={'førsteDataKolonne'}>Målet for utdanningen</Normaltekst>
            <Normaltekst> {underUtdanning.hvaErMåletMedUtdanningen}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne  leggTilSpacing'}>
                Har søker utdanning etter grunnskolen
            </Normaltekst>
            <BooleanTekst value={underUtdanning.utdanningEtterGrunnskolen} />
        </>
    );
};

export const TidligereUtdanninger: FC<{ tidligereUtdanninger?: ITidligereUtdanning[] }> = ({
    tidligereUtdanninger,
}) => {
    return (
        <>
            <Element className={'førsteDataKolonne'}>Linje/Kurs/grad</Element>
            <Element>Tidsperiode</Element>

            {tidligereUtdanninger?.map((utdanning, index) => (
                <StyledTabellWrapper key={utdanning.linjeKursGrad + index}>
                    <Normaltekst className={'førsteDataKolonne'}>
                        {utdanning.linjeKursGrad}
                    </Normaltekst>
                    <Normaltekst>
                        {`${formaterIsoMånedÅr(utdanning.fra)} - ${formaterIsoMånedÅr(
                            utdanning.til
                        )}`}
                    </Normaltekst>
                </StyledTabellWrapper>
            ))}
        </>
    );
};
