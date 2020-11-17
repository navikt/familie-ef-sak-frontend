import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import VilkårOppfylt from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { hentSivilstatus } from './helper';
import { ISivilstandInngangsvilkår } from './typer';
import Søknadsinformasjon from './Søknadsinformasjon';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    erOppfylt: boolean;
}
const SivilstandVisning: FC<Props> = ({ sivilstand, erOppfylt }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    const sivilstatusOgDato = registergrunnlag.gyldigFraOgMed
        ? `${hentSivilstatus(registergrunnlag.type)}. ${registergrunnlag.gyldigFraOgMed}`
        : hentSivilstatus(registergrunnlag.type);

    return (
        <>
            <StyledTabell>
                <VilkårOppfylt erOppfylt={erOppfylt} />
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
            </StyledTabell>
        </>
    );
};

export default SivilstandVisning;
