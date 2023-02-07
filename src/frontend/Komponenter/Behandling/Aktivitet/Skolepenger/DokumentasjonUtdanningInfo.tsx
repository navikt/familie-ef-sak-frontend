import React, { FC } from 'react';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const DokumentasjonUtdanningInfo: FC<Props> = ({
    aktivitet,
    skalViseSøknadsdata,
    dokumentasjon,
}) => {
    return (
        <InformasjonContainer>
            {skalViseSøknadsdata && (
                <Dokumentasjonsvisning
                    aktivitet={aktivitet}
                    skalViseSøknadsdata={skalViseSøknadsdata}
                />
            )}
            {skalViseSøknadsdata && (
                <DokumentasjonSendtInn
                    dokumentasjon={dokumentasjon?.utdanningsutgifter}
                    tittel={'Utgifter til skolepenger'}
                />
            )}
        </InformasjonContainer>
    );
};

export default DokumentasjonUtdanningInfo;
