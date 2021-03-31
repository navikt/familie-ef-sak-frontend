import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../typer/personopplysninger';
import Søknadsinformasjon from './Søknadsinformasjon';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
}

const SivilstandInfo: FC<Props> = ({ sivilstand }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    const sivilstatusOgDato = registergrunnlag.gyldigFraOgMed
        ? `${sivilstandTilTekst[registergrunnlag.type]} - ${formaterNullableIsoDato(
              registergrunnlag.gyldigFraOgMed
          )}`
        : sivilstandTilTekst[registergrunnlag.type];

    return (
        <>
            <GridTabell>
                <Registergrunnlag />
                <Normaltekst>Sivilstatus</Normaltekst>
                <Normaltekst>{sivilstatusOgDato}</Normaltekst>

                <Søknadsinformasjon
                    sivilstandtype={registergrunnlag.type}
                    søknad={søknadsgrunnlag}
                />
            </GridTabell>
        </>
    );
};

export default SivilstandInfo;
