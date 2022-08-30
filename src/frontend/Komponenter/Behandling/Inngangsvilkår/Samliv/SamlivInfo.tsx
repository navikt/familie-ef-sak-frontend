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
import { Bostedsadresse } from './Bostedsadresse';
import { BehandlingStatus } from '../../../../App/typer/behandlingstatus';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';

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
    const { sivilstand, bosituasjon, sivilstandsplaner, dokumentasjon } = grunnlag;

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
                                    <Normaltekst>Alene med barn fordi</Normaltekst>
                                    <Normaltekst>
                                        {(sivilstand.søknadsgrunnlag.årsakEnslig &&
                                            ÅrsakEnsligTilTekst[
                                                sivilstand.søknadsgrunnlag?.årsakEnslig
                                            ]) ||
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
                                bosituasjon={bosituasjon}
                                sivilstandsplaner={sivilstandsplaner}
                            />
                        </>
                    )}
                {behandlingsstatus !== BehandlingStatus.FERDIGSTILT && (
                    <Bostedsadresse behandlingId={behandlingId} />
                )}
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
                </>
            )}
        </>
    );
};

export default SamlivInfo;
