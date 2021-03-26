import React, { FC, useState } from 'react';
import { RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import Vurdering from '../Vurdering/Vurdering';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useBehandling } from '../../../context/BehandlingContext';
import { Behandling } from '../../../typer/fagsak';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { StyledInngangsvilkår, StyledKnapp } from '../Inngangsvilkår/Inngangsvilkår';
import { AktivitetsvilkårType } from '../Inngangsvilkår/vilkår';

interface Props {
    behandlingId: string;
}

const Aktivitet: FC<Props> = ({ behandlingId }) => {
    const [feilmelding] = useState<string>();
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
    } = useHentVilkår();

    const godkjennEndringer = () => {
        axiosRequest<null, void>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/registergrunnlag/godkjenn`,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            }
        });
    };

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
    }, [behandlingId]);
    return (
        <>
            {feilmelding && <AlertStripeFeil children={feilmelding} />}
            <DataViewer response={{ vilkår }}>
                {({ vilkår }) => {
                    const harEndringerIGrunnlagsdata = Object.values(
                        (behandling as RessursSuksess<Behandling>).data
                            .endringerIRegistergrunnlag || {}
                    ).some((endringer) => endringer.length > 0);
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
                            <StyledKnapp
                                onClick={godkjennEndringer}
                                hidden={!harEndringerIGrunnlagsdata}
                            >
                                Godkjenn endringer i registergrunnlag
                            </StyledKnapp>
                        </StyledInngangsvilkår>
                    );
                }}
            </DataViewer>
        </>
    );
};

export default Aktivitet;
