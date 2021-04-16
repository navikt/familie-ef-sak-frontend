import React, { FC } from 'react';
import { RessursStatus } from '../../../typer/ressurs';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { NyttBarnSammePartner } from './NyttBarnSammePartner/NyttBarnSammePartner';
import { Aleneomsorg } from './Aleneomsorg/Aleneomsorg';
import { MorEllerFar } from './MorEllerFar/MorEllerFar';
import { Opphold } from './Opphold/Opphold';
import { Medlemskap } from './Medlemskap/Medlemskap';
import { Samliv } from './Samliv/Samliv';
import { Sivilstand } from './Sivilstand/Sivilstand';

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
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
                        <Medlemskap
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <Opphold
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <MorEllerFar
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <NyttBarnSammePartner
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <Sivilstand
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <Samliv
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                        <Aleneomsorg
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Inngangsvilkår;
