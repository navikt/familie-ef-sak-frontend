import React, { FC } from 'react';
import { RessursStatus } from '../../../typer/ressurs';
import Vurdering from '../Vurdering/Vurdering';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { StyledInngangsvilkår } from '../Inngangsvilkår/Inngangsvilkår';
import { AktivitetsvilkårType } from '../Inngangsvilkår/vilkår';

interface Props {
    behandlingId: string;
}

const Aktivitet: FC<Props> = ({ behandlingId }) => {
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
    } = useHentVilkår();

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
    }, [behandlingId]);
    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return (
                    <StyledInngangsvilkår>
                        {Object.keys(AktivitetsvilkårType).map((vilkårGruppe) => {
                            return (
                                <Vurdering
                                    key={vilkårGruppe}
                                    vilkårGruppe={vilkårGruppe as AktivitetsvilkårType}
                                    inngangsvilkår={vilkår}
                                    feilmeldinger={feilmeldinger}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            );
                        })}
                    </StyledInngangsvilkår>
                );
            }}
        </DataViewer>
    );
};

export default Aktivitet;
