import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { Heading, Label } from '@navikt/ds-react';
import { ResultatVisning, ResultatGrid, FlexBox } from './ResultatVisning';
import styled from 'styled-components';
import { sorterUtAktivitetsvilkår, sorterUtInngangsvilkår } from './utils';
import { Neutral100 } from '@navikt/ds-tokens/js';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../../App/typer/ressurs';
import { stønadstyperMedRegelendring2026Begrunnelse } from '../../../../App/hooks/useRegelendring2026';
import { VilkårsresultatIkon } from '../../../../Felles/Ikoner/VilkårsresultatIkon';
import { Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { useToggles } from '../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../App/context/toggles';

const Container = styled.div`
    padding: 1rem;
    background-color: ${Neutral100};
`;

export const Vilkårsvurdering: React.FC<{
    vilkår: IVilkår;
}> = ({ vilkår }) => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsvilkår(vilkår);
    const { regelendring2026Begrunnelse, behandling } = useBehandling();
    const { toggles } = useToggles();

    const stønadstype =
        behandling.status === RessursStatus.SUKSESS ? behandling.data.stønadstype : undefined;

    const skalViseRegelverkBegrunnelse =
        toggles[ToggleName.regelendringer2026] &&
        stønadstype !== undefined &&
        stønadstyperMedRegelendring2026Begrunnelse.includes(stønadstype);

    const harBegrunnelse =
        regelendring2026Begrunnelse.status === RessursStatus.SUKSESS &&
        !!regelendring2026Begrunnelse.data?.begrunnelse.trim();

    return (
        <Container>
            <Heading spacing size="small">
                Vilkårsvurdering
            </Heading>
            <ResultatVisning vilkårsvurderinger={inngangsvilkår} tittel="Inngangsvilkår:" />
            <ResultatVisning vilkårsvurderinger={aktivitetsvilkår} tittel="Aktivitetsvilkår:" />
            {skalViseRegelverkBegrunnelse && (
                <ResultatGrid>
                    <Label size="small">Regelverk begrunnelse:</Label>
                    <FlexBox>
                        <VilkårsresultatIkon
                            vilkårsresultat={
                                harBegrunnelse
                                    ? Vilkårsresultat.OPPFYLT
                                    : Vilkårsresultat.IKKE_TATT_STILLING_TIL
                            }
                        />
                        <BodyShortSmall>
                            {harBegrunnelse ? '1 av 1 oppfylt' : '0 av 1 ikke vurdert'}
                        </BodyShortSmall>
                    </FlexBox>
                </ResultatGrid>
            )}
        </Container>
    );
};
