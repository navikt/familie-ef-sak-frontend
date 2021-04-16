import React from 'react';
import { Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import { FlexDiv } from '../Oppgavebenk/OppgaveFiltrering';
import { VilkårsresultatIkon } from '../Felleskomponenter/Visning/VilkårsresultatIkon';
import { Normaltekst } from 'nav-frontend-typografi';

const resultatTilTekst: Record<Vilkårsresultat, string> = {
    IKKE_AKTUELL: 'ikke aktuell',
    IKKE_OPPFYLT: 'ikke oppfylt',
    IKKE_TATT_STILLING_TIL: 'ikke tatt stilling til',
    OPPFYLT: 'oppfylt',
    SKAL_IKKE_VURDERES: 'ikke vurdert',
};

export const ResultatVisning: React.FC<{
    vilkårsresultat: Vilkårsresultat;
    summering: number;
    antall: number;
}> = ({ summering, vilkårsresultat, antall }) => {
    return (
        <FlexDiv flexDirection="row" className="blokk-xxs">
            <VilkårsresultatIkon
                vilkårsresultat={(vilkårsresultat as unknown) as Vilkårsresultat}
            />
            <Normaltekst style={{ marginLeft: '0.25rem' }}>
                {`${summering} av ${antall} ${resultatTilTekst[vilkårsresultat]}`}
            </Normaltekst>
        </FlexDiv>
    );
};
