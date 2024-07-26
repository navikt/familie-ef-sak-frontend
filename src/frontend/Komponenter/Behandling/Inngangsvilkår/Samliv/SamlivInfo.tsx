import React, { FC } from 'react';
import { IVilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst } from './typer';
import { ÅrsakEnsligTilTekst } from '../Sivilstand/typer';
import { Bostedsadresse } from './Bostedsadresse';
import { BehandlingStatus } from '../../../../App/typer/behandlingstatus';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { Addresseopplysninger } from './Addresseopplysninger';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { Behandling } from '../../../../App/typer/fagsak';

interface Props {
    grunnlag: IVilkårGrunnlag;
    skalViseSøknadsdata: boolean;
    behandling: Behandling;
}

const SamlivInfo: FC<Props> = ({ grunnlag, skalViseSøknadsdata, behandling }) => {
    const {
        personalia,
        sivilstand,
        bosituasjon,
        sivilstandsplaner,
        adresseopplysninger,
        dokumentasjon,
    } = grunnlag;

    return (
        <InformasjonContainer>
            {skalViseSøknadsdata &&
                sivilstand.søknadsgrunnlag &&
                bosituasjon &&
                sivilstandsplaner && (
                    <>
                        {sivilstand.registergrunnlag.type !== SivilstandType.GIFT && (
                            <>
                                <Informasjonsrad
                                    ikon={VilkårInfoIkon.SØKNAD}
                                    label="Alene med barn fordi"
                                    verdi={
                                        (sivilstand.søknadsgrunnlag.årsakEnslig &&
                                            ÅrsakEnsligTilTekst[
                                                sivilstand.søknadsgrunnlag?.årsakEnslig
                                            ]) ||
                                        ''
                                    }
                                />
                                <ÅrsakEnslig søknadsgrunnlag={sivilstand.søknadsgrunnlag} />
                            </>
                        )}

                        {bosituasjon && (
                            <Informasjonsrad
                                ikon={VilkårInfoIkon.SØKNAD}
                                label="Bosituasjon"
                                verdi={SøkerDelerBoligTilTekst[bosituasjon.delerDuBolig] || ''}
                            />
                        )}
                        <Bosituasjon
                            bosituasjon={bosituasjon}
                            sivilstandsplaner={sivilstandsplaner}
                        />
                    </>
                )}
            {behandling.status !== BehandlingStatus.FERDIGSTILT && (
                <Bostedsadresse behandlingId={behandling.id} personalia={personalia} />
            )}
            {skalViseSøknadsdata && <Addresseopplysninger data={adresseopplysninger} />}
            {skalViseSøknadsdata && (
                <>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.separasjonsbekreftelse}
                        tittel={'Separasjonsbekreftelse'}
                    />
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.samlivsbrudd}
                        tittel={'Bekreftelse på samlivsbrudd med den andre forelderen'}
                    />
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.tidligereSamboerFortsattRegistrertPåAdresse}
                        tittel={
                            'Dokumentasjon som viser at du og tidligere samboer bor på ulike adresser'
                        }
                    />
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.meldtAdresseendring}
                        tittel={'Dokumentasjon på meldt adresseendring'}
                    />
                </>
            )}
        </InformasjonContainer>
    );
};

export default SamlivInfo;
