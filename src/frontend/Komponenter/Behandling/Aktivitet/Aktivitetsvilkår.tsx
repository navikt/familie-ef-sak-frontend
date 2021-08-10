import React, { FC } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Aktivitet } from './Aktivitet/Aktivitet';
import { SagtOppEllerRedusert } from './SagtOppEllerRedusert/SagtOppEllerRedusert';

interface Props {
    behandlingId: string;
}

const AktivitetsVilkår: FC<Props> = ({ behandlingId }) => {
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
    } = useHentVilkår();

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);
    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return (
                    <>
                        <Aktivitet
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <SagtOppEllerRedusert
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default AktivitetsVilkår;
