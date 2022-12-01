import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IVilkårGrunnlag } from '../vilkår';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import ÅrsakEnslig from './ÅrsakEnslig';
import { Bosituasjon } from './Bosituasjon';
import { SøkerDelerBoligTilTekst } from './typer';
import { ÅrsakEnsligTilTekst } from '../Sivilstand/typer';
import { Bostedsadresse } from './Bostedsadresse';
import { BehandlingStatus } from '../../../../App/typer/behandlingstatus';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { Addresseopplysninger } from './Addresseopplysninger';

interface Props {
    grunnlag: IVilkårGrunnlag;
    skalViseSøknadsdata: boolean;
    behandlingId: string;
    behandlingsstatus: BehandlingStatus;
}

const SamlivInfo: FC<Props> = ({
    grunnlag,
    skalViseSøknadsdata,
    behandlingId,
    behandlingsstatus,
}) => {
    const { sivilstand, bosituasjon, sivilstandsplaner, adresseopplysninger, dokumentasjon } =
        grunnlag;

    return (
        <>
            <GridTabell>
                {skalViseSøknadsdata &&
                    sivilstand.søknadsgrunnlag &&
                    bosituasjon &&
                    sivilstandsplaner && (
                        <>
                            {sivilstand.registergrunnlag.type !== SivilstandType.GIFT && (
                                <>
                                    <Søknadsgrunnlag />
                                    <BodyShortSmall>Alene med barn fordi</BodyShortSmall>
                                    <BodyShortSmall>
                                        {(sivilstand.søknadsgrunnlag.årsakEnslig &&
                                            ÅrsakEnsligTilTekst[
                                                sivilstand.søknadsgrunnlag?.årsakEnslig
                                            ]) ||
                                            ''}
                                    </BodyShortSmall>
                                    <ÅrsakEnslig søknadsgrunnlag={sivilstand.søknadsgrunnlag} />
                                </>
                            )}

                            <Søknadsgrunnlag />
                            {bosituasjon && (
                                <>
                                    <BodyShortSmall>Bosituasjon</BodyShortSmall>
                                    <BodyShortSmall>
                                        {SøkerDelerBoligTilTekst[bosituasjon.delerDuBolig] || ''}
                                    </BodyShortSmall>
                                </>
                            )}
                            <Bosituasjon
                                bosituasjon={bosituasjon}
                                sivilstandsplaner={sivilstandsplaner}
                            />
                        </>
                    )}
                {behandlingsstatus !== BehandlingStatus.FERDIGSTILT && (
                    <Bostedsadresse behandlingId={behandlingId} />
                )}
                {skalViseSøknadsdata && <Addresseopplysninger data={adresseopplysninger} />}
            </GridTabell>
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
                        tittel={'Dokumentasjon på meldt Adresseendring'}
                    />
                </>
            )}
        </>
    );
};

export default SamlivInfo;
