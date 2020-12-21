import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../../typer/personopplysninger';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <StyledTabell kolonner={3}>
            <Registergrunnlag />
            <Element className="tittel" tag="h3">
                Innflytting og utflytting
            </Element>
            {['Innflytting fra', 'Dato'].map((kolonneTittel, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                    {kolonneTittel}
                </Element>
            ))}
            {innflytting.map((innflytting, index) => (
                <React.Fragment key={index}>
                    <Normaltekst className="førsteDataKolonne">
                        {innflytting.fraflyttingsland}
                        {innflytting.fraflyttingssted && ',' + innflytting.fraflyttingssted}
                    </Normaltekst>
                    <Normaltekst className="kolonne">
                        {formaterNullableIsoDato(innflytting.dato)}
                    </Normaltekst>
                </React.Fragment>
            ))}
            {['Utflyttet til', 'Dato'].map((kolonneTittel, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                    {kolonneTittel}
                </Element>
            ))}
            {utflytting.map((utflytting, index) => (
                <React.Fragment key={index}>
                    <Normaltekst className="førsteDataKolonne">
                        {utflytting.tilflyttingsland}
                        {utflytting.tilflyttingssted && ',' + utflytting.tilflyttingssted}
                    </Normaltekst>
                    <Normaltekst className="kolonne">
                        {formaterNullableIsoDato(utflytting.dato)}
                    </Normaltekst>
                </React.Fragment>
            ))}
        </StyledTabell>
    );
};

export default InnflyttingUtflytting;
