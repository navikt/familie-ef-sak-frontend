import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import InitiellSkoleårsperiode from './InitiellSkoleårsperiode';
import RedigerSkoleårsperiode from './RedigerSkoleårsperiode';

export enum Visningsmodus {
    INITIELL = 'INITIELL',
    REDIGER_SKOLEÅRSPERIODE = 'REDIGER_SKOLEÅRSPERIODE',
    REDIGER_UTGIFTSPERIODE = 'REDIGER_UTGIFTSPERIODE',
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

    const [visningsmodus, settVisningsmodus] = useState<Visningsmodus>(
        utledVisningmodus(behandlingErRedigerbar)
    );

    switch (visningsmodus) {
        case Visningsmodus.INITIELL:
            return (
                <InitiellSkoleårsperiode
                    customValidate={customValidate}
                    fjernSkoleårsperiode={fjernSkoleårsperiode}
                    oppdaterSkoleårsperiode={oppdaterSkoleårsperiode}
                    oppdaterValideringsfeil={oppdaterValideringsfeil}
                    settVisningsmodus={settVisningsmodus}
                    skoleårsperiode={skoleårsperiode}
                    valideringsfeil={valideringsfeil}
                    visningsmodus={visningsmodus}
                />
            );
        case Visningsmodus.REDIGER_SKOLEÅRSPERIODE:
        case Visningsmodus.REDIGER_UTGIFTSPERIODE:
        case Visningsmodus.VISNING:
            return (
                <RedigerSkoleårsperiode
                    customValidate={customValidate}
                    fjernSkoleårsperiode={fjernSkoleårsperiode}
                    låsteUtgiftIder={låsteUtgiftIder}
                    oppdaterSkoleårsperiode={oppdaterSkoleårsperiode}
                    oppdaterValideringsfeil={oppdaterValideringsfeil}
                    settVisningsmodus={settVisningsmodus}
                    skoleårsperiode={skoleårsperiode}
                    valideringsfeil={valideringsfeil}
                    visningsmodus={visningsmodus}
                />
            );
    }
};

export default Skoleårsperiode;
