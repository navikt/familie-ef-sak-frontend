import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import Søknadsinformasjon from './Søknadsinformasjon';
import { sivilstandTilTekst } from '../../../../typer/personopplysninger';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    vilkårStatus: VilkårStatus;
}

const SivilstandVisning: FC<Props> = ({ sivilstand, vilkårStatus }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    const sivilstatusOgDato = registergrunnlag.gyldigFraOgMed
        ? `${sivilstandTilTekst[registergrunnlag.type]} ${registergrunnlag.gyldigFraOgMed}`
        : sivilstandTilTekst[registergrunnlag.type];

    return (
        <>
            <GridTabell>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
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
