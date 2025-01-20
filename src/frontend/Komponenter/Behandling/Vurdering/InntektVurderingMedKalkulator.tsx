import * as React from 'react';
import { FC } from 'react';
import { Heading, HelpText, HStack, RadioGroup, VStack } from '@navikt/ds-react';
import { RadioKnapperMedlemskapUnntak } from './RadioKnapperMedlemskapUnntak';
import { BegrunnelseRegel, Regel } from './typer';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { delvilkårTypeTilTekst } from './tekster';
import BeregnetInntektKalkulator from '../VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/BeregnetInntektKalkulator';
import { hjelpeTekstConfig } from './hjelpetekstconfig';
import { RadioKnapper } from './RadioKnapper';
import Begrunnelse from './Begrunnelse';

const utledRadioKnapper = (regel: Regel, settVurdering: (nyttSvar: Vurdering) => void) => {
    switch (regel.regelId) {
        case 'MEDLEMSKAP_UNNTAK':
            return <RadioKnapperMedlemskapUnntak regel={regel} settVurdering={settVurdering} />;
        default:
            return <RadioKnapper regel={regel} settVurdering={settVurdering} />;
    }
};

interface InntektVurderingMedKalkualtor {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
    onChange: (tekst: string) => void;
}

export const InntektVurderingMedKalkulator: FC<InntektVurderingMedKalkualtor> = ({
    regel,
    vurdering,
    settVurdering,
    onChange,
}) => {
    const hjelpetekst = hjelpeTekstConfig[vurdering.regelId];

    const begrunnelsetype = vurdering.svar && regel.svarMapping[vurdering.svar].begrunnelseType;
    const visKalkulator = (begrunnelsetype ?? BegrunnelseRegel.UTEN) === BegrunnelseRegel.UTEN;

    return (
        <VStack>
            <HStack justify="space-between" width="100%" gap="2">
                <Heading size="xsmall" style={{ flex: 1, wordBreak: 'break-word' }}>
                    {delvilkårTypeTilTekst[regel.regelId]}
                </Heading>
                {!visKalkulator && (
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
            <Begrunnelse onChange={onChange} svar={vurdering} regel={regel} />
        </VStack>
    );
};
