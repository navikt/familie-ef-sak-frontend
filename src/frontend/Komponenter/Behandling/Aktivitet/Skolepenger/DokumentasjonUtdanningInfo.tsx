import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';

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
        <>
            <GridTabell>
                {skalViseSøknadsdata ? (
                    <Dokumentasjonsvisning
                        aktivitet={aktivitet}
                        skalViseSøknadsdata={skalViseSøknadsdata}
                    />
                ) : null}
            </GridTabell>
            {skalViseSøknadsdata && (
                <GridTabell underTabellMargin={0}>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.utdanningsutgifter}
                        tittel={'Utgifter til skolepenger'}
                    />
                </GridTabell>
            )}
        </>
    );
};

export default DokumentasjonUtdanningInfo;
