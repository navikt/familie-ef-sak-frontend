import React, { FC } from 'react';
import { ITidligereUtdanning, IUnderUtdanning } from '../../../../typer/overgangsstønad';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { v4 as uuidv4 } from 'uuid';
import { StyledTabellWrapper } from '../../../Felleskomponenter/Visning/StyledTabell';

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
            <Normaltekst> {underUtdanning.offentligEllerPrivat}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Studiets tidsperiode</Normaltekst>
            <Normaltekst>{`${underUtdanning.fra} - ${underUtdanning.til}`}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Heltid eller deltid</Normaltekst>
            <Normaltekst> {underUtdanning.heltidEllerDeltid}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Hvor mye skal søker studere</Normaltekst>
            <Normaltekst> {underUtdanning.hvorMyeSkalDuStudere + ' %'}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>Målet for utdanningen</Normaltekst>
            <Normaltekst> {underUtdanning.hvaErMåletMedUtdanningen}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne  leggTilSpacing'}>
                Har søker utdanning etter grunnskolen
            </Normaltekst>
            <Normaltekst>
                <BooleanTekst value={underUtdanning.utdanningEtterGrunnskolen} />
            </Normaltekst>
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

            {tidligereUtdanninger?.map((utdanning) => (
                <StyledTabellWrapper key={uuidv4()}>
                    <Normaltekst className={'førsteDataKolonne'}>
                        {utdanning.linjeKursGrad}
                    </Normaltekst>
                    <Normaltekst> {`${utdanning.fra} - ${utdanning.til}`}</Normaltekst>
                </StyledTabellWrapper>
            ))}
        </>
    );
};
