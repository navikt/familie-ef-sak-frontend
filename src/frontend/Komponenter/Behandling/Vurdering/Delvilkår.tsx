import * as React from 'react';
import { FC } from 'react';
import { Regel } from './typer';
import { DelvilkårContainer } from './DelvilkårContainer';
import { hjelpeTekstConfig } from './hjelpetekstconfig';
import { delvilkårTypeTilTekst } from './tekster';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { HelpText, RadioGroup } from '@navikt/ds-react';
import { RadioKnapper } from './RadioKnapper';
import { RadioKnapperMedlemskapUnntak } from './RadioKnapperMedlemskapUnntak';

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

const Delvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const hjelpetekst = hjelpeTekstConfig[regel.regelId];

    return (
        <DelvilkårContainer>
            <RadioGroup legend={delvilkårTypeTilTekst[regel.regelId]} value={vurdering.svar || ''}>
                {utledRadioKnapper(regel, settVurdering)}
            </RadioGroup>
            {hjelpetekst && (
                <HelpText placement={hjelpetekst.plassering}>
                    {React.createElement(hjelpetekst.komponent)}
                </HelpText>
            )}
        </DelvilkårContainer>
    );
};

export default Delvilkår;
