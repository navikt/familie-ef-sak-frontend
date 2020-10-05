import * as React from 'react';
import { RegisterGrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formaterIsoDato } from '../../../../utils/formatter';
import { FC } from 'react';
import { IStatsborgerskap } from '../../../../typer/personopplysninger';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

interface Props {
    statsborgerskap: IStatsborgerskap[];
}

const Statsborgerskap: FC<Props> = ({ statsborgerskap }) => {
    return (
        <StyledTabell kolonner={4}>
            <RegisterGrunnlag />
            <Element className="tittel">Statsborgerskap</Element>
            <Element className="førsteDataKolonne">Land</Element>
            <Element>Fra</Element>
            <Element>Til</Element>
            {statsborgerskap.map((statsborgerskap) => (
                <>
                    <Normaltekst className="førsteDataKolonne">{statsborgerskap.land}</Normaltekst>
                    <Normaltekst className="kolonne">
                        {statsborgerskap.gyldigFraOgMedDato &&
                            formaterIsoDato(statsborgerskap.gyldigFraOgMedDato)}
                    </Normaltekst>
                    <Normaltekst className="kolonne">
                        {statsborgerskap.gyldigTilOgMedDato &&
                            formaterIsoDato(statsborgerskap.gyldigTilOgMedDato)}
                    </Normaltekst>
                </>
            ))}
        </StyledTabell>
    );
};

export default Statsborgerskap;
