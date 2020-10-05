import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from '../vilkår';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formaterIsoDato } from '../../../../utils/formatter';
import { SøknadGrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

interface Props {
    utenlandsopphold: IUtenlandsopphold[];
}

const Utenlandsopphold: FC<Props> = ({ utenlandsopphold }) => {
    return (
        <>
            <StyledTabell kolonner={4}>
                <SøknadGrunnlag />
                <Element className="tittel">Utenlandsperioder</Element>
                <Element className="førsteDataKolonne">Årsak</Element>
                <Element>Fra</Element>
                <Element>Til</Element>
                {utenlandsopphold.map((utenlandsopphold) => (
                    <>
                        <Normaltekst className="førsteDataKolonne">
                            {utenlandsopphold.årsak}
                        </Normaltekst>
                        <Normaltekst className="kolonne">
                            {utenlandsopphold.fraDato && formaterIsoDato(utenlandsopphold.fraDato)}
                        </Normaltekst>
                        <Normaltekst className="kolonne">
                            {utenlandsopphold.tilDato && formaterIsoDato(utenlandsopphold.tilDato)}
                        </Normaltekst>
                    </>
                ))}
            </StyledTabell>
        </>
    );
};

export default Utenlandsopphold;
