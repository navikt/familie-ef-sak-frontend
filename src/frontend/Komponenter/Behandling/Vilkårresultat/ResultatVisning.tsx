import React from 'react';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { Normaltekst } from 'nav-frontend-typografi';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';
import styled from 'styled-components';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { Label } from '@navikt/ds-react';

const Ikontekst = styled(Normaltekst)`
    margin-left: 0.25rem;
`;

const BoldTekst = styled(Label)`
    margin-right: 1rem;
`;

const Container = styled.div`
    width: 280px;
`;

const Div = styled(FlexDiv)`
    justify-content: space-between;
`;

const ResultatIkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const resultatTilTekst: Record<string, string> = {
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
            {Object.entries(oppsummeringAvVilkårsresultat).map(
                ([vilkårsresultat, antallVilkårsresultat], i) => (
                    <Div flexDirection="row" className="blokk-xxs" key={i}>
                        <BoldTekst size="small">{tittel}</BoldTekst>
                        <ResultatIkonOgTekstWrapper>
                            <VilkårsresultatIkon
                                vilkårsresultat={vilkårsresultat as Vilkårsresultat}
                            />
                            <Ikontekst>
                                {`${antallVilkårsresultat} av ${antallVilkårTotalt} ${resultatTilTekst[vilkårsresultat]}`}
                            </Ikontekst>
                        </ResultatIkonOgTekstWrapper>
                    </Div>
                )
            )}
        </Container>
    );
};
