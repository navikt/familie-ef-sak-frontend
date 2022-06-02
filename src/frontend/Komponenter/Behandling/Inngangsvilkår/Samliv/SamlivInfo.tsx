import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IVilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst } from './typer';
import { ÅrsakEnsligTilTekst } from '../Sivilstand/typer';

interface Props {
    grunnlag: IVilkårGrunnlag;
    skalViseSøknadsdata: boolean;
    behandlingId: string;
}

const SamlivInfo: FC<Props> = ({ grunnlag, skalViseSøknadsdata, behandlingId }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;

    return (
        <>
            {skalViseSøknadsdata && sivilstand.søknadsgrunnlag && bosituasjon && sivilstandsplaner && (
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
                    {bosituasjon && (
                        <>
                            <Normaltekst>Bosituasjon</Normaltekst>
                            <Normaltekst>
                                {SøkerDelerBoligTilTekst[bosituasjon.delerDuBolig] || ''}
                            </Normaltekst>
                        </>
                    )}

                    <Bosituasjon
                        behandlingId={behandlingId}
                        bosituasjon={bosituasjon}
                        sivilstandsplaner={sivilstandsplaner}
                    />
                </GridTabell>
            )}
        </>
    );
};

export default SamlivInfo;
