import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Heading, HStack } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    IVurdering,
    InngangsvilkårType,
    Vilkårsresultat,
    resultatTilTekst,
} from '../Inngangsvilkår/vilkår';

import { TextDangerDecoration, TextSuccessDecoration } from '@navikt/ds-tokens/js';

export const LagTittel: FC<{
    vurdering: IVurdering;
    erAutomatiskVurdert: boolean;
}> = ({ vurdering, erAutomatiskVurdert }) => {
    const erAleneomsorg = vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG;
    const erVurderingOppfylt = vurdering.resultat === Vilkårsresultat.OPPFYLT;
    const erVurderingIkkeOppfylt = vurdering.resultat === Vilkårsresultat.IKKE_OPPFYLT;
    const skalViseCheckmarkIkon = erAleneomsorg && erVurderingOppfylt;
    const skalViseXMarkIkon = erAleneomsorg && erVurderingIkkeOppfylt;

    const tittel = () => {
        let tittel = '';

        tittel = `Vilkår ${resultatTilTekst[vurdering.resultat]}`;

        tittel += erAutomatiskVurdert ? ` (automatisk)` : ``;
        return tittel;
    };

    return (
        <HStack gap="space-4">
            <Heading size={'small'} level={'3'}>
                {tittel()}
            </Heading>
            {skalViseCheckmarkIkon && (
                <CheckmarkCircleIcon
                    title="check-success"
                    fontSize="1.5rem"
                    color={TextSuccessDecoration}
                />
            )}
            {skalViseXMarkIkon && (
                <XMarkOctagonIcon title="x-danger" fontSize="1.5rem" color={TextDangerDecoration} />
            )}
        </HStack>
    );
};
