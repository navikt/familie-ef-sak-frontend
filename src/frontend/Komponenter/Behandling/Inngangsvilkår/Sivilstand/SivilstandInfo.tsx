import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../App/typer/personopplysninger';
import Søknadsinformasjon from './Søknadsinformasjon';
import { formaterIsoDato } from '../../../../App/utils/formatter';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    skalViseSøknadsdata: boolean;
}

const SivilstandInfo: FC<Props> = ({ sivilstand, skalViseSøknadsdata }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    return (
        <>
            <GridTabell>
                <Registergrunnlag />
                <Normaltekst>Sivilstatus</Normaltekst>
                <Normaltekst>
                    {sivilstandTilTekst[registergrunnlag.type]}
                    {registergrunnlag.navn && ` - ${registergrunnlag.navn}`}
                    {registergrunnlag.gyldigFraOgMed &&
                        ` (${formaterIsoDato(registergrunnlag.gyldigFraOgMed)})`}
                </Normaltekst>

                {skalViseSøknadsdata && (
                    <Søknadsinformasjon
                        sivilstandtype={registergrunnlag.type}
                        søknad={søknadsgrunnlag}
                    />
                )}
            </GridTabell>
        </>
    );
};

export default SivilstandInfo;
