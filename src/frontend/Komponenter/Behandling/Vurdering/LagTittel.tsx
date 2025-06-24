import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { Heading, HStack } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    IVurdering,
    InngangsvilkårType,
    Vilkårsresultat,
    resultatTilTekst,
} from '../Inngangsvilkår/vilkår';

export const LagTittel: FC<{
    vurdering: IVurdering;
    erAutomatiskVurdert: boolean;
}> = ({ vurdering, erAutomatiskVurdert }) => {
    const erAleneomsorg = vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG;
    const erVurderingOppfylt = vurdering.resultat === Vilkårsresultat.OPPFYLT;

    const tittel = () => {
        let tittel = '';

        tittel = `Vilkår ${resultatTilTekst[vurdering.resultat]}`;

        tittel += erAutomatiskVurdert ? ` (automatisk)` : ``;
        return tittel;
    };

    const skalViseXIkon = erAleneomsorg && !erVurderingOppfylt;

    return (
        <HStack gap="1">
            <Heading size={'small'} level={'3'}>
                {tittel()}
            </Heading>
            {skalViseXIkon && (
                <XMarkOctagonIcon title="a11y-title" fontSize="1.5rem" color={ARed500} />
            )}
        </HStack>
    );
};
