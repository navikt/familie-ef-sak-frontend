import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårsresultatIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import Søknadsinformasjon from './Søknadsinformasjon';
import { sivilstandTilTekst } from '../../../../typer/personopplysninger';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { Vilkårsresultat } from '../vilkår';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    vilkårsresultat: Vilkårsresultat;
}

const SivilstandVisning: FC<Props> = ({ sivilstand, vilkårsresultat }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    const sivilstatusOgDato = registergrunnlag.gyldigFraOgMed
        ? `${sivilstandTilTekst[registergrunnlag.type]} ${formaterNullableIsoDato(
              registergrunnlag.gyldigFraOgMed
          )}`
        : sivilstandTilTekst[registergrunnlag.type];

    return (
        <>
            <GridTabell>
                <VilkårsresultatIkon
                    className={'vilkårStatusIkon'}
                    vilkårsresultat={vilkårsresultat}
                />
                <div className="tittel">
                    <Undertittel>Sivilstand</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>

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

export default SivilstandVisning;
