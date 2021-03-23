import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {  VilkårsresultatIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import {IVilkårGrunnlag, Vilkårsresultat} from '../vilkår';
import { SivilstandType } from '../../../../typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst, ÅrsakEnsligTilTekst } from './typer';

interface Props {
    vilkårsresultat: Vilkårsresultat;
    grunnlag: IVilkårGrunnlag;
}

const SamlivVisning: FC<Props> = ({ grunnlag, vilkårsresultat }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;

    return (
        <>
            <GridTabell>
                <VilkårsresultatIkon className={'vilkårStatusIkon'} vilkårsresultat={vilkårsresultat} />
                <div className="tittel">
                    <Undertittel>Samliv</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>

                {sivilstand.registergrunnlag.type !== SivilstandType.GIFT && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Alene med barn fordi</Normaltekst>
                        <Normaltekst>
                            {(sivilstand.søknadsgrunnlag.årsakEnslig &&
                                ÅrsakEnsligTilTekst[sivilstand.søknadsgrunnlag?.årsakEnslig]) ||
                                ''}
                        </Normaltekst>
                        <ÅrsakEnslig søknadsgrunnlag={sivilstand.søknadsgrunnlag} />
                    </>
                )}

                <Søknadsgrunnlag />
                <Normaltekst>Bosituasjon</Normaltekst>
                <Normaltekst>{SøkerDelerBoligTilTekst[bosituasjon.delerDuBolig] || ''}</Normaltekst>

                <Bosituasjon bosituasjon={bosituasjon} sivilstandsplaner={sivilstandsplaner} />
            </GridTabell>
        </>
    );
};

export default SamlivVisning;
