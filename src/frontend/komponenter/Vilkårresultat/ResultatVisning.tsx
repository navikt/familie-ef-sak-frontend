import React from 'react';
import { IVurdering, Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';
import styled from 'styled-components';
import { FlexDiv } from '../Oppgavebenk/OppgaveFiltrering';
import { VilkårsresultatIkon } from '../Felleskomponenter/Visning/VilkårsresultatIkon';

const Container = styled.div`
    padding: 2rem 1rem;
`;

const resultatTilTekst: Record<string, string> = {
    IKKE_AKTUELL: 'ikke aktuell',
    IKKE_OPPFYLT: 'ikke oppfylt',
    IKKE_TATT_STILLING_TIL: 'ikke tatt stilling til',
    OPPFYLT: 'oppfylt',
    SKAL_IKKE_VURDERES: 'ikke vurdert',
};

export const ResultatVisning: React.FC<{
    vilkårsvurderinger: IVurdering[];
    tittel: string;
}> = ({ vilkårsvurderinger, tittel }) => {
    const vilkårtypeTilResultat = mapVilkårtypeTilResultat(vilkårsvurderinger);
    const antallVilkårTotalt = Object.keys(vilkårtypeTilResultat).length;
    const oppsummeringAvVilkårsresultat = summerVilkårsresultat(vilkårtypeTilResultat);
    return (
        <Container>
            <Undertittel className="blokk-xs">{tittel}</Undertittel>
            {Object.entries(oppsummeringAvVilkårsresultat).map(
                ([vilkårsresultat, antallVilkårsresultat], i) => (
                    <FlexDiv flexDirection="row" className="blokk-xxs" key={i}>
                        <VilkårsresultatIkon vilkårsresultat={vilkårsresultat as Vilkårsresultat} />
                        <Normaltekst style={{ marginLeft: '0.25rem' }}>
                            {`${antallVilkårsresultat} av ${antallVilkårTotalt} ${resultatTilTekst[vilkårsresultat]}`}
                        </Normaltekst>
                    </FlexDiv>
                )
            )}
        </Container>
    );
};
