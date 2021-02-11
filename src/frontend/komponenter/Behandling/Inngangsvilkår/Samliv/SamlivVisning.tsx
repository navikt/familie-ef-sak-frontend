import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IInngangsvilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../../typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst, ÅrsakEnsligTilTekst } from './typer';

interface Props {
    vilkårStatus: VilkårStatus;
    grunnlag: IInngangsvilkårGrunnlag;
}

const SamlivVisning: FC<Props> = ({ grunnlag, vilkårStatus }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;
    const { søknadsgrunnlag, registergrunnlag } = sivilstand;
    const { tidligereSamboer } = søknadsgrunnlag;

    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Samliv</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>

                {registergrunnlag.type !== SivilstandType.GIFT && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Alene med barn fordi</Normaltekst>
                        <Normaltekst>
                            {(søknadsgrunnlag.årsakEnslig &&
                                ÅrsakEnsligTilTekst[søknadsgrunnlag?.årsakEnslig]) ||
                                ''}
                        </Normaltekst>
                    </>
                )}
                <ÅrsakEnslig søknadsgrunnlag={søknadsgrunnlag} />

                <Søknadsgrunnlag />
                <Normaltekst>Bosituasjon</Normaltekst>
                <Normaltekst>{SøkerDelerBoligTilTekst[bosituasjon.delerDuBolig] || ''}</Normaltekst>

                <Bosituasjon
                    bosituasjon={bosituasjon}
                    tidligereSamboer={tidligereSamboer}
                    sivilstandsplaner={sivilstandsplaner}
                />
            </StyledTabell>
        </>
    );
};

export default SamlivVisning;
