import {FormErrors} from '../../../../App/hooks/felles/useFormState';
import {ISkoleårsperiodeSkolepenger} from '../../../../App/typer/vedtak';
import {InnvilgeVedtakForm} from './VedtaksformSkolepenger';

export const validerInnvilgetVedtakForm = ({
    perioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            perioder,
        }),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerPerioder = ({
    perioder,
}: {
    perioder: ISkoleårsperiodeSkolepenger[];
}): FormErrors<{
    perioder: ISkoleårsperiodeSkolepenger[];
}> => {
    return {
        ...validerUtgiftsperioder({ perioder }),
    };
};

export const validerUtgiftsperioder = ({
    perioder,
}: {
    perioder: ISkoleårsperiodeSkolepenger[];
}): FormErrors<{ perioder: ISkoleårsperiodeSkolepenger[] }> => {
    //const feilIUtgiftsperioder = perioder.map((utgiftsperiode, index, utgiftsperioder) => {
    const feilIUtgiftsperioder = perioder.map(() => {
        //const { studietype, årMånedFra, årMånedTil, studiebelastning, utgifter } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: [],
            utgifter: []
        };
/*
        if (!studietype) {
            return { ...utgiftsperiodeFeil, studietype: 'Mangelfull utfylling av studietype' };
        }
        if (!årMånedFra || !årMånedTil) {
            return { ...utgiftsperiodeFeil, årMånedFra: 'Mangelfull utfylling av utgiftsperiode' };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...utgiftsperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        if (index > 0) {
            const forrigeårMånedFra = utgiftsperioder[index - 1].årMånedFra;
            if (!erMånedÅrEtterEllerLik(forrigeårMånedFra, årMånedFra)) {
                return {
                    ...utgiftsperiodeFeil,
                    årMånedFra: `Ugyldig periode - fra-dato for forrige utgiftsperiode (${forrigeårMånedFra}) må være før fra-dato for neste utgiftsperiode (${årMånedFra})`,
                };
            }
        }
        if (!studiebelastning) {
            return {
                ...utgiftsperiodeFeil,
                studiebelastning: 'Mangelfull utfylling av studiebelastning',
            };
        }
        if (studiebelastning < 1 || studiebelastning > 100) {
            return {
                ...utgiftsperiodeFeil,
                studiebelastning: 'Studiebelastning må være mellom 1-100%',
            };
        }
        if (!utgifter) {
            return { ...utgiftsperiodeFeil, utgifter: 'Mangelfull utfylling av utgifter' };
        }*/

        return utgiftsperiodeFeil;
    });

    return {
        perioder: feilIUtgiftsperioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
