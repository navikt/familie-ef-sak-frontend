import React from 'react';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { Heading, Label } from '@navikt/ds-react';
import { ResultatVisning } from './ResultatVisning';
import styled from 'styled-components';
import { sorterUtAktivitetsvilkår, sorterUtInngangsvilkår } from './utils';
import { Neutral100 } from '@navikt/ds-tokens/js';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { VilkårsresultatIkon } from '../../../../Felles/Ikoner/VilkårsresultatIkon';
import { Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

const Container = styled.div`
    padding: 1rem;
    background-color: ${Neutral100};
`;

const ResultatGrid = styled.div`
    display: grid;
    grid-template-columns: 8.5rem 7.25rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const FlexBox = styled.div`
    display: flex;
    gap: 0.25rem;
`;

const stønadstyperMedBegrunnelseskrav: Stønadstype[] = [
    Stønadstype.OVERGANGSSTØNAD,
    Stønadstype.BARNETILSYN,
];

export const Vilkårsvurdering: React.FC<{
    vilkår: IVilkår;
}> = ({ vilkår }) => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsvilkår(vilkår);
    const { erRegelendring2026, regelendring2026Begrunnelse, behandling } = useBehandling();

    const stønadstype =
        behandling.status === RessursStatus.SUKSESS ? behandling.data.stønadstype : undefined;

    const skalViseRegelverkBegrunnelse =
        erRegelendring2026 &&
        stønadstype !== undefined &&
        stønadstyperMedBegrunnelseskrav.includes(stønadstype);

    const harBegrunnelse =
        regelendring2026Begrunnelse.status === RessursStatus.SUKSESS &&
        !!regelendring2026Begrunnelse.data?.begrunnelse;

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
