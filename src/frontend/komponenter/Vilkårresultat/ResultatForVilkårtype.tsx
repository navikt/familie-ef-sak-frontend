import React from 'react';
import { IVurdering, Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import { Undertittel } from 'nav-frontend-typografi';
import { ResultatVisning } from './Resultatvisning';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';
import styled from 'styled-components';

const Container = styled.div`
    padding: 2rem 1rem;
`;

export const ResultatForVilkårstype: React.FC<{
    vilkårsvurderinger: IVurdering[];
    tittel: string;
}> = ({ vilkårsvurderinger, tittel }) => {
    const vilkårResultat = summerVilkårsresultat(mapVilkårtypeTilResultat(vilkårsvurderinger));

    return (
        <Container>
            <Undertittel className="blokk-xs">{tittel}</Undertittel>
            {Object.entries(vilkårResultat).map(([vilkårsresultat, sum]) => (
                <ResultatVisning
                    vilkårsresultat={vilkårsresultat as Vilkårsresultat}
                    summering={sum}
                    antall={vilkårsvurderinger.length}
                />
            ))}
        </Container>
    );
};
