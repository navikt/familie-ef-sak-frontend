import React, { useCallback, useState } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import styled from 'styled-components';
import { AxiosRequestConfig } from 'axios';
import { Behandling } from '../../../App/typer/fagsak';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

const VilkårKnapp = styled(Button)`
    margin-top: 1rem;
    margin-left: 1rem;
`;

interface Props {
    behandling: Behandling;
    hentVilkår: (behandlingId: string) => void;
    behandlingErRedigerbar: boolean;
}

export const FyllUtVilkårKnapp: React.FC<Props> = ({
    behandling,
    hentVilkår,
    behandlingErRedigerbar,
}) => {
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();
    const behandlingId = behandling.id;
    const [feilmelding, settFeilmelding] = useState<string>('');

    const automatiskFyllUtVilkår = useCallback(() => {
        settFeilmelding('');
        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `/familie-ef-sak/api/test/${behandlingId}/utfyll-vilkar`,
        };
        axiosRequest<string, null>(requestConfig).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    }, [axiosRequest, behandlingId, hentVilkår, settFeilmelding]);

    if (!toggles[ToggleName.visAutomatiskUtfylleVilkår] || !behandlingErRedigerbar) {
        return <></>;
    }

    return (
        <>
            <VilkårKnapp onClick={automatiskFyllUtVilkår}>Fyll ut vilkår automatisk</VilkårKnapp>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        </>
    );
};
