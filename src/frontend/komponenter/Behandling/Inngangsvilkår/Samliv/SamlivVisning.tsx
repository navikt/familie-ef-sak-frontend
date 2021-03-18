import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IVilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../../typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst, ÅrsakEnsligTilTekst } from './typer';

interface Props {
    vilkårStatus: VilkårStatus;
    grunnlag: IVilkårGrunnlag;
}

const SamlivVisning: FC<Props> = ({ grunnlag, vilkårStatus }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;

    return (
        <>
            <GridTabell>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
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
