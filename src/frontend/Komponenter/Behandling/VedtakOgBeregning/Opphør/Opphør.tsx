import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import React, { useState } from 'react';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Knapp } from 'nav-frontend-knapper';
import { useApp } from '../../../../App/context/AppContext';
import { EBehandlingResultat, IOpphørtVedtak, IVedtak } from '../../../../App/typer/vedtak';
import { Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useHistory } from 'react-router-dom';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

export const Opphør: React.FC<{ behandlingId: string; lagretVedtak?: IVedtak }> = ({
    behandlingId,
    lagretVedtak,
}) => {
    const [laster, settLaster] = useState(false);
    const lagretOpphørtVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.OPPHØRT
            ? (lagretVedtak as IOpphørtVedtak)
            : undefined;
    const [opphørtFra, settOpphørtFra] = useState<string>(lagretOpphørtVedtak?.opphørFom || '');
    const [opphørtBegrunnelse, settOpphørtBegrunnelse] = useState<string>(
        lagretOpphørtVedtak?.begrunnelse || ''
    );
    const [feilmelding, settFeilmelding] = useState<string | undefined>();
    const { behandlingErRedigerbar, hentBehandling, settAntallIRedigeringsmodus } = useBehandling();
    const { axiosRequest } = useApp();
    const history = useHistory();

    const lagreVedtak = () => {
        if (opphørtBegrunnelse && opphørtFra) {
            settLaster(true);
            axiosRequest<string, IOpphørtVedtak>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
                data: {
                    resultatType: EBehandlingResultat.OPPHØRT,
                    opphørFom: opphørtFra,
                    begrunnelse: opphørtBegrunnelse,
                } as IOpphørtVedtak,
            })
                .then(håndterOpphørtVedtak)
                .finally(() => {
                    settLaster(false);
                });
        } else {
            settFeilmelding('Dato eller begrunnelse mangler');
        }
    };

    const håndterOpphørtVedtak = (res: Ressurs<string>) => {
        switch (res.status) {
            case RessursStatus.SUKSESS:
                history.push(`/behandling/${behandlingId}/simulering`);
                hentBehandling.rerun();
                settAntallIRedigeringsmodus(0);
                break;
            case RessursStatus.HENTER:
            case RessursStatus.IKKE_HENTET:
                break;
            default:
                settFeilmelding(res.frontendFeilmelding);
        }
    };

    return (
        <>
            <form onSubmit={lagreVedtak}>
                <MånedÅrVelger
                    label={'Opphør fra og med'}
                    onEndret={(årMåned) => årMåned && settOpphørtFra(årMåned)}
                    antallÅrTilbake={3}
                    antallÅrFrem={3}
                    disabled={!behandlingErRedigerbar}
                />
                <FamilieTextarea
                    label={'Begrunnelse for opphør'}
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    value={opphørtBegrunnelse}
                    onChange={(begrunnelse) => settOpphørtBegrunnelse(begrunnelse.target.value)}
                />
                <Knapp htmlType={'submit'} disabled={laster || !behandlingErRedigerbar}>
                    Lagre vedtak
                </Knapp>
            </form>
            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
        </>
    );
};
