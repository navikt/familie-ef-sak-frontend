import * as React from 'react';
import { RegisterGrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formaterIsoDato } from '../../../../utils/formatter';
import { IOppholdstatus } from '../vilkår';
import { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

interface Props {
    oppholdsstatus: IOppholdstatus[];
}
const Oppholdsstatus: FC<Props> = ({ oppholdsstatus }) => {
    return (
        <StyledTabell kolonner={4}>
            <RegisterGrunnlag />
            <Element className="tittel">Oppholdsstatus</Element>
            <Element className="førsteDataKolonne">Oppholdstillatelse</Element>
            <Element>Fra</Element>
            <Element>Til</Element>
            {oppholdsstatus.map((oppholdsstatus) => (
                <>
                    <Normaltekst className="førsteDataKolonne">
                        {oppholdsstatus.oppholdstillatelse}
                    </Normaltekst>
                    <Normaltekst className="kolonne">
                        {oppholdsstatus.fraDato && formaterIsoDato(oppholdsstatus.fraDato)}
                    </Normaltekst>
                    <Normaltekst className="kolonne">
                        {oppholdsstatus.tilDato && formaterIsoDato(oppholdsstatus.tilDato)}
                    </Normaltekst>
                </>
            ))}
        </StyledTabell>
    );
};

export default Oppholdsstatus;
