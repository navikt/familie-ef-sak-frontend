import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const DokumentasjonUtdanningInfo: FC<Props> = ({ aktivitet, skalViseSøknadsdata }) => {
    return (
        <GridTabell>
            {skalViseSøknadsdata ? (
                <Dokumentasjonsvisning
                    aktivitet={aktivitet}
                    skalViseSøknadsdata={skalViseSøknadsdata}
                />
            ) : null}
        </GridTabell>
    );
};

export default DokumentasjonUtdanningInfo;
