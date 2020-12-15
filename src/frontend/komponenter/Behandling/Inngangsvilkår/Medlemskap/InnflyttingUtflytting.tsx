import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../../typer/personopplysninger';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

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
                <Element className={index === 0 ? 'førsteDataKolonne' : ''}>
                    {kolonneTittel}
                </Element>
            ))}
            {innflytting.map((innflytting) => (
                <>
                    <Normaltekst className="førsteDataKolonne">
                        {innflytting.fraflyttingsland}
                        {innflytting.fraflyttingssted && ',' + innflytting.fraflyttingssted}
                    </Normaltekst>
                    <Normaltekst className="kolonne">Todo</Normaltekst>
                </>
            ))}
            {['Utflyttet til', 'Dato'].map((kolonneTittel, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''}>
                    {kolonneTittel}
                </Element>
            ))}
            {utflytting.map((utflytting) => (
                <>
                    <Normaltekst className="førsteDataKolonne">
                        {utflytting.tilflyttingsland}
                        {utflytting.tilflyttingssted && ',' + utflytting.tilflyttingssted}
                    </Normaltekst>
                    <Normaltekst className="kolonne">Todo</Normaltekst>
                </>
            ))}
        </StyledTabell>
    );
};

export default InnflyttingUtflytting;
