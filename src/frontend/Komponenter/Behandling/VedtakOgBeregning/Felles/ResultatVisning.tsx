import React from 'react';
import { IVurdering, Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { Normaltekst } from 'nav-frontend-typografi';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';
import styled from 'styled-components';
import { VilkårsresultatIkon } from '../../../../Felles/Ikoner/VilkårsresultatIkon';
import { Label } from '@navikt/ds-react';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const Ikontekst = styled(Normaltekst)`
    margin-left: 0.25rem;
`;

const BoldTekst = styled(Label)`
    margin-right: 1rem;
`;

const Container = styled.div<{ stønadstype: Stønadstype }>`
    width: ${(p) => (p.stønadstype === Stønadstype.OVERGANGSSTØNAD ? '280px' : '300px')};
`;

const ResultatIkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
`;

const ResultatGrid = styled.div<{ stønadstype: Stønadstype }>`
    display: grid;
    grid-template-area: vilkårstype vilkårsoppsummering;
    grid-template-columns: ${(p) =>
            p.stønadstype === Stønadstype.OVERGANGSSTØNAD ? '7rem' : '8.5rem'} 10.5rem;
    grid-gap: 1rem;
`;

export const resultatTilTekst: Record<string, string> = {
    OPPFYLT: 'oppfylt',
    IKKE_TATT_STILLING_TIL: 'ikke vurdert',
    IKKE_OPPFYLT: 'ikke oppfylt',
    IKKE_AKTUELL: 'ikke aktuell',
    SKAL_IKKE_VURDERES: 'ikke vurdert',
};

export const resultatTilTall: Record<Vilkårsresultat, number> = {
    OPPFYLT: 1,
    IKKE_TATT_STILLING_TIL: 2,
    IKKE_OPPFYLT: 3,
    IKKE_AKTUELL: 4,
    SKAL_IKKE_VURDERES: 5,
};

export const ResultatVisning: React.FC<{
    vilkårsvurderinger: IVurdering[];
    tittel: string;
    stønadstype: Stønadstype;
}> = ({ vilkårsvurderinger, tittel, stønadstype }) => {
    const vilkårtypeTilResultat = mapVilkårtypeTilResultat(vilkårsvurderinger);
    const antallVilkårTotalt = Object.keys(vilkårtypeTilResultat).length;
    const oppsummeringAvVilkårsresultat = summerVilkårsresultat(vilkårtypeTilResultat);

    const sorterVilkårsresultat = (a: [string, number], b: [string, number]): number => {
        return resultatTilTall[a[0] as Vilkårsresultat] - resultatTilTall[b[0] as Vilkårsresultat];
    };

    return (
        <Container stønadstype={stønadstype}>
            {Object.entries(oppsummeringAvVilkårsresultat)
                .sort(sorterVilkårsresultat)
                .map(([vilkårsresultat, antallVilkårsresultat], i) => (
                    <ResultatGrid stønadstype={stønadstype} key={i}>
                        <BoldTekst size="small">{i == 0 ? tittel : ''}</BoldTekst>
                        <ResultatIkonOgTekstWrapper>
                            <VilkårsresultatIkon
                                vilkårsresultat={vilkårsresultat as Vilkårsresultat}
                            />
                            <Ikontekst>
                                {`${antallVilkårsresultat} av ${antallVilkårTotalt} ${resultatTilTekst[vilkårsresultat]}`}
                            </Ikontekst>
                        </ResultatIkonOgTekstWrapper>
                    </ResultatGrid>
                ))}
        </Container>
    );
};
