import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { BodyShort } from '@navikt/ds-react';
import Skoleårsperioder from './Skoleårsperioder';

const Container = styled.div`
    padding: 1rem;
`;

enum Visningsmodus {
    INITIELL = 'INITIELL',
    VISNING = 'VISNING',
}

const utledVisningmodus = (behandlingErRedigerbar: boolean, antallSkoleårsperioder: number) => {
    if (!behandlingErRedigerbar || antallSkoleårsperioder > 0) {
        return Visningsmodus.VISNING;
    }
    return Visningsmodus.INITIELL;
};

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    låsteUtgiftIder: string[];
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    oppdaterHarUtførtBeregning: (beregningUtført: boolean) => void;
}

const VisEllerEndreSkoleårsperioder: React.FC<Props> = ({
    customValidate,
    skoleårsperioder,
    låsteUtgiftIder,
    valideringsfeil,
    settValideringsFeil,
    oppdaterHarUtførtBeregning,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const antallSkoleår = skoleårsperioder.value.length;

    const [visningsmodus, settVisninsmodus] = useState<Visningsmodus>(
        utledVisningmodus(behandlingErRedigerbar, antallSkoleår)
    );

    useEffect(() => {
        settVisninsmodus(utledVisningmodus(behandlingErRedigerbar, antallSkoleår));
    }, [antallSkoleår, behandlingErRedigerbar]);

    switch (visningsmodus) {
        case Visningsmodus.INITIELL:
            return (
                <Container>
                    <BodyShort>Bruker har ingen tidligere skoleårsperioder registrert.</BodyShort>
                    <LeggTilKnapp
                        knappetekst="Legg til nytt skoleår"
                        onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                        variant="tertiary"
                    />
                </Container>
            );
        case Visningsmodus.VISNING:
            return (
                <Skoleårsperioder
                    customValidate={customValidate}
                    skoleårsperioder={skoleårsperioder}
                    låsteUtgiftIder={låsteUtgiftIder}
                    valideringsfeil={valideringsfeil}
                    settValideringsFeil={settValideringsFeil}
                    oppdaterHarUtførtBeregning={oppdaterHarUtførtBeregning}
                />
            );
    }
};

export default VisEllerEndreSkoleårsperioder;
