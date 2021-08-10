import React, { FC } from 'react';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IVilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../App/typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst } from './typer';
import { ÅrsakEnsligTilTekst } from '../Sivilstand/typer';

interface Props {
    grunnlag: IVilkårGrunnlag;
}

const SamlivInfo: FC<Props> = ({ grunnlag }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;

    return (
        <>
            <GridTabell>
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

export default SamlivInfo;
