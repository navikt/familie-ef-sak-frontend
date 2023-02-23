import React from 'react';
import {
    IVurdering,
    resultatTilTall,
    resultatTilTekst,
    Vilkårsresultat,
} from '../../Inngangsvilkår/vilkår';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';
import styled from 'styled-components';
import { VilkårsresultatIkon } from '../../../../Felles/Ikoner/VilkårsresultatIkon';
import { Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

const Ikontekst = styled(BodyShortSmall)`
    margin-left: 0.25rem;
`;

const ResultatIkonOgTekstWrapper = styled.div`
    display: flex;
`;

const ResultatGrid = styled.div`
    display: grid;
    grid-template-columns: 8.5rem 7.25rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

export const ResultatVisning: React.FC<{
    vilkårsvurderinger: IVurdering[];
    tittel: string;
}> = ({ vilkårsvurderinger, tittel }) => {
    const vilkårtypeTilResultat = mapVilkårtypeTilResultat(vilkårsvurderinger);
    const antallVilkårTotalt = Object.keys(vilkårtypeTilResultat).length;
    const oppsummeringAvVilkårsresultat = summerVilkårsresultat(vilkårtypeTilResultat);

    const sorterVilkårsresultat = (a: [string, number], b: [string, number]): number => {
        return resultatTilTall[a[0] as Vilkårsresultat] - resultatTilTall[b[0] as Vilkårsresultat];
    };

    return (
        <>
            {Object.entries(oppsummeringAvVilkårsresultat)
                .sort(sorterVilkårsresultat)
                .map(([vilkårsresultat, antallVilkårsresultat], i) => (
                    <ResultatGrid key={i}>
                        <Label size="small">{i == 0 ? tittel : ''}</Label>
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
        </>
    );
};
