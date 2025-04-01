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

const dokumentasjonUtdanning = (dokumentasjon: IDokumentasjonGrunnlag) => {
    return [
        { tittel: 'Utgifter til utdanning', dokumentasjon: dokumentasjon.utdanningsutgifter },
        { tittel: 'Dokumentasjon utdanning tilbud', dokumentasjon: dokumentasjon.utdanningstilbud },
    ];
};

const DokumentasjonUtdanningInfo: FC<Props> = ({ aktivitet, dokumentasjon }) => {
    return (
        <InformasjonContainer>
            <Dokumentasjonsvisning aktivitet={aktivitet} />
            {dokumentasjon &&
                dokumentasjonUtdanning(dokumentasjon).map((dokumentasjon, index) => {
                    return (
                        <DokumentasjonSendtInn
                            key={index}
                            dokumentasjon={dokumentasjon.dokumentasjon}
                            tittel={dokumentasjon.tittel}
                        />
                    );
                })}
        </InformasjonContainer>
    );
};

export default DokumentasjonUtdanningInfo;
