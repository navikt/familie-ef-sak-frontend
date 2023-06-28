import React from 'react';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './Vedtaksform';

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

const Skoleårsperiode: React.FC<Props> = () => {
    return <div></div>;
};

export default Skoleårsperiode;
