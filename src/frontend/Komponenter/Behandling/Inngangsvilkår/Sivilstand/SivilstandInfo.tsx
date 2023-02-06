import React, { FC } from 'react';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../App/typer/personopplysninger';
import Søknadsinformasjon from './Søknadsinformasjon';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../vilkår';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const SivilstandInfo: FC<Props> = ({ sivilstand, skalViseSøknadsdata, dokumentasjon }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    return (
        <InformasjonContainer>
            <Informasjonsrad
                ikon={VilkårInfoIkon.REGISTER}
                label="Sivilstatus"
                verdi={`${sivilstandTilTekst[registergrunnlag.type]} ${
                    registergrunnlag.navn &&
                    `- ${registergrunnlag.navn} (${
                        registergrunnlag.gyldigFraOgMed &&
                        formaterIsoDato(registergrunnlag.gyldigFraOgMed)
                    })`
                }`}
                verdiSomString={false}
            />
            {skalViseSøknadsdata && søknadsgrunnlag && (
                <Søknadsinformasjon
                    sivilstandtype={registergrunnlag.type}
                    søknad={søknadsgrunnlag}
                />
            )}
            {skalViseSøknadsdata && (
                <>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.uformeltGift}
                        tittel={'Dokumentasjon på inngått ekteskap'}
                    />
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.uformeltSeparertEllerSkilt}
                        tittel={'Dokumentasjon på separasjon eller skilsmisse'}
                    />
                </>
            )}
        </InformasjonContainer>
    );
};

export default SivilstandInfo;
