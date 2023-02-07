import React, { FC } from 'react';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

interface Props {
    aktivitet: IAktivitet;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const DokumentasjonUtdanningInfo: FC<Props> = ({ aktivitet, dokumentasjon }) => {
    return (
        <InformasjonContainer>
            <Dokumentasjonsvisning aktivitet={aktivitet} />

            <DokumentasjonSendtInn
                dokumentasjon={dokumentasjon?.utdanningsutgifter}
                tittel={'Utgifter til skolepenger'}
            />
        </InformasjonContainer>
    );
};

export default DokumentasjonUtdanningInfo;
