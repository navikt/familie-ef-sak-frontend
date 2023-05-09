import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import UtgiftsperiodeSkolepenger from './UtgiftsperiodeSkolepenger';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { validerKunSkoleårsperioder } from './vedtaksvalidering';
import SkoleårsperiodeInitiell from './SkoleårsperiodeInitiell';

enum Visningsmodus {
    INITIELL = 'INITIELL',
    SEMI_VISNING = 'SEMI_VISNING',
    VISNING = 'VISNING',
}

const utledVisningmodus = (behandlingErRedigerbar: boolean) => {
    if (!behandlingErRedigerbar) {
        return Visningsmodus.VISNING;
    }
    return Visningsmodus.INITIELL;
};

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    fjernSkoleårsperiode: () => void;
    låsteUtgiftIder: string[];
    oppdaterSkoleårsperiode: (
        property: keyof ISkoleårsperiodeSkolepenger,
        value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
    ) => void;
    oppdaterValideringsfeil: (
        property: keyof ISkoleårsperiodeSkolepenger,
        oppdaterteFeil: FormErrors<SkolepengerUtgift>[] | FormErrors<IPeriodeSkolepenger>[]
    ) => void;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
}

const Skoleårsperiode: React.FC<Props> = ({
    customValidate,
    fjernSkoleårsperiode,
    låsteUtgiftIder,
    oppdaterSkoleårsperiode,
    oppdaterValideringsfeil,
    skoleårsperiode,
    valideringsfeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [visningsmodus, settVisninsmodus] = useState<Visningsmodus>(
        utledVisningmodus(behandlingErRedigerbar)
    );

    const variabel = false;

    const oppdaterVisningsmodus = () => {
        if (customValidate(validerKunSkoleårsperioder)) {
            settVisninsmodus(Visningsmodus.SEMI_VISNING);
        }
    };

    switch (visningsmodus) {
        case Visningsmodus.INITIELL:
            return (
                <SkoleårsperiodeInitiell
                    fjernSkoleårsperiode={fjernSkoleårsperiode}
                    oppdaterSkoleårsperiode={oppdaterSkoleårsperiode}
                    oppdaterValideringsfeil={oppdaterValideringsfeil}
                    oppdaterVisningsmodus={oppdaterVisningsmodus}
                    skoleårsperiode={skoleårsperiode}
                    valideringsfeil={valideringsfeil}
                />
            );
        case Visningsmodus.SEMI_VISNING:
            return (
                <>
                    <p>meow</p>
                    {variabel && (
                        <UtgiftsperiodeSkolepenger
                            data={skoleårsperiode.utgiftsperioder}
                            oppdater={(utgiftsperioder) =>
                                oppdaterSkoleårsperiode('utgiftsperioder', utgiftsperioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil.utgiftsperioder}
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil('utgiftsperioder', oppdaterteFeil)
                            }
                            låsteUtgiftIder={låsteUtgiftIder}
                        />
                    )}
                </>
            );
        case Visningsmodus.VISNING:
            return <p>meow meow</p>;
    }
};

export default Skoleårsperiode;
