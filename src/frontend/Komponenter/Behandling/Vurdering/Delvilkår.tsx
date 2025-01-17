import * as React from 'react';
import { FC } from 'react';
import { Regel } from './typer';
import { hjelpeTekstConfig } from './hjelpetekstconfig';
import { delvilkårTypeTilTekst } from './tekster';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { Heading, HelpText, HStack, RadioGroup, VStack } from '@navikt/ds-react';
import { RadioKnapper } from './RadioKnapper';
import { RadioKnapperMedlemskapUnntak } from './RadioKnapperMedlemskapUnntak';
import { visBeregnetInntektKalkulator } from './VurderingUtil';
import BeregnetInntektKalkulator from '../VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/BeregnetInntektKalkulator';

const utledRadioKnapper = (regel: Regel, settVurdering: (nyttSvar: Vurdering) => void) => {
    switch (regel.regelId) {
        case 'MEDLEMSKAP_UNNTAK':
            return <RadioKnapperMedlemskapUnntak regel={regel} settVurdering={settVurdering} />;
        default:
            return <RadioKnapper regel={regel} settVurdering={settVurdering} />;
    }
};

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

export const Delvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const hjelpetekst = hjelpeTekstConfig[regel.regelId];

    const visKalkulator = visBeregnetInntektKalkulator(regel.regelId);

    return (
        <VStack>
            <HStack justify="space-between" width="100%">
                <Heading size="small" style={{ flex: 1, wordBreak: 'break-word' }}>
                    {delvilkårTypeTilTekst[regel.regelId]}
                </Heading>
                {visKalkulator && (
                    <div>
                        <BeregnetInntektKalkulator
                            leggTilBeregnetInntektTekstIBegrunnelse={() => {}}
                        />
                    </div>
                )}
            </HStack>
            <RadioGroup legend={undefined} value={vurdering.svar || ''}>
                {utledRadioKnapper(regel, settVurdering)}
            </RadioGroup>
            {hjelpetekst && (
                <HelpText placement={hjelpetekst.plassering}>
                    {React.createElement(hjelpetekst.komponent)}
                </HelpText>
            )}
        </VStack>
    );
};
