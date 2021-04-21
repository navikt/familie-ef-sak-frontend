import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../typer/personopplysninger';
import Søknadsinformasjon from './Søknadsinformasjon';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
}

const SivilstandInfo: FC<Props> = ({ sivilstand }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    return (
        <>
            <GridTabell>
                <Registergrunnlag />
                <Normaltekst>Sivilstatus</Normaltekst>
                <Normaltekst>
                    {sivilstandTilTekst[registergrunnlag.type]}
                    {registergrunnlag.navn && ' med ' + registergrunnlag.navn}
                    {registergrunnlag.gyldigFraOgMed && ' - ' + registergrunnlag.gyldigFraOgMed}
                </Normaltekst>

                <Søknadsinformasjon
                    sivilstandtype={registergrunnlag.type}
                    søknad={søknadsgrunnlag}
                />
            </GridTabell>
        </>
    );
};

export default SivilstandInfo;
