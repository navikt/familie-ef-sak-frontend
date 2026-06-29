import React, { FC, useEffect } from 'react';
import { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext.tsx';
import { useApp } from '../../../App/context/AppContext.tsx';
import { Button, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';
import { RessursStatus } from '../../../App/typer/ressurs.ts';
import { useParams } from 'react-router-dom';
import { BekreftRegelendringModal } from './BekreftRegelendringModal.tsx';
import { regelverkLabel } from '../../../App/typer/behandlingstype.ts';
import { VilkårpanelInnhold } from '../Vilkårpanel/VilkårpanelInnhold.tsx';
import { VertikalStrek, VurderingLesemodusGrid } from './StyledVurdering.tsx';
import { stønadstyperMedRegelendring2026Begrunnelse } from '../../../App/hooks/useRegelendring2026.ts';

export const BehandleSom2026Regelendring: FC = () => {
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const {
        erRegelendring2026,
        settErRegelendring2026,
        behandlingErRedigerbar,
        hentVedtak,
        hentBehandling,
        behandling,
        regelendring2026Begrunnelse,
        lagreBegrunnelse,
    } = useBehandling();
    const { axiosRequest } = useApp();

    const [visBekreftelsesmodal, settVisBekreftelsesmodal] = useState(false);
    const [pendingVerdi, settNyVerdi] = useState<boolean | null>(null);
    const [begrunnelseTekst, settBegrunnelseTekst] = useState<string>('');
    const [begrunnelseLagret, settBegrunnelseLagret] = useState(false);

    const stønadstype =
        behandling.status === RessursStatus.SUKSESS ? behandling.data.stønadstype : undefined;

    const skalViseBegrunnelse =
        stønadstype !== undefined &&
        stønadstyperMedRegelendring2026Begrunnelse.includes(stønadstype);

    useEffect(() => {
        if (
            regelendring2026Begrunnelse.status === RessursStatus.SUKSESS &&
            regelendring2026Begrunnelse.data
        ) {
            settBegrunnelseTekst(regelendring2026Begrunnelse.data.begrunnelse);
            settBegrunnelseLagret(true);
        }
    }, [regelendring2026Begrunnelse]);

    const håndterRegelendring = (nyVerdi: boolean) => {
        settNyVerdi(nyVerdi);
        settVisBekreftelsesmodal(true);
    };

    const bekreftEndring = () => {
        if (pendingVerdi === null) return;
        axiosRequest<string, { erRegelendring2026: boolean }>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/regelendring-2026`,
            data: { erRegelendring2026: pendingVerdi },
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settErRegelendring2026(pendingVerdi);
                hentBehandling.rerun();
                hentVedtak.rerun();
            }
        });
        settVisBekreftelsesmodal(false);
        settNyVerdi(null);
    };

    const avbrytEndring = () => {
        settVisBekreftelsesmodal(false);
        settNyVerdi(null);
    };

    const håndterLagreBegrunnelse = async () => {
        const lagret = await lagreBegrunnelse(begrunnelseTekst);
        if (lagret) {
            settBegrunnelseLagret(true);
        }
    };

    return (
        <>
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <RadioGroup
                            legend="Ønsker du å behandle denne saken etter nytt eller tidligere regelverk?"
                            value={erRegelendring2026}
                            onChange={håndterRegelendring}
                            readOnly={!behandlingErRedigerbar}
                        >
                            <Radio value={true}>{regelverkLabel.NYTT_REGELVERK.tekst}</Radio>
                            <Radio value={false}>{regelverkLabel.TIDLIGERE_REGELVERK.tekst}</Radio>
                        </RadioGroup>
                    ),
                    høyre: skalViseBegrunnelse ? (
                        <VurderingLesemodusGrid>
                            <VertikalStrek />
                            <VStack gap="space-16">
                                <Textarea
                                    label="Begrunnelse for valg av regelverk"
                                    value={begrunnelseTekst}
                                    onChange={(e) => {
                                        settBegrunnelseTekst(e.target.value);
                                        settBegrunnelseLagret(false);
                                    }}
                                    readOnly={!behandlingErRedigerbar}
                                />
                                {behandlingErRedigerbar && (
                                    <div>
                                        <Button
                                            type="button"
                                            size="small"
                                            variant="secondary"
                                            onClick={håndterLagreBegrunnelse}
                                            disabled={
                                                begrunnelseTekst.trim().length === 0 ||
                                                begrunnelseLagret
                                            }
                                        >
                                            {begrunnelseLagret ? 'Lagret' : 'Lagre begrunnelse'}
                                        </Button>
                                    </div>
                                )}
                            </VStack>
                        </VurderingLesemodusGrid>
                    ) : (
                        <></>
                    ),
                }}
            </VilkårpanelInnhold>
            <BekreftRegelendringModal
                open={visBekreftelsesmodal}
                nyVerdi={pendingVerdi}
                onBekreft={bekreftEndring}
                onAvbryt={avbrytEndring}
            />
        </>
    );
};
