import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { IKontantstøttePeriode, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import { erMånedÅrEtter, erMånedÅrEtterEllerLik } from '../../../../App/utils/dato';

export const validerInnvilgetVedtakForm = ({
    utgiftsperioder,
    kontantstøtteperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerUtgiftsperioder({ utgiftsperioder }),
        ...validerKontantstøttePerioder({ kontantstøtteperioder }),
    };
};

export const validerUtgiftsperioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: IUtgiftsperiode[];
}): FormErrors<{ utgiftsperioder: IUtgiftsperiode[] }> => {
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode, index) => {
        const { årMånedFra, årMånedTil } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<IUtgiftsperiode> = {
            årMånedFra: undefined,
            årMånedTil: undefined,
            barn: undefined,
            utgifter: undefined,
        };

        if (!årMånedTil || !årMånedFra) {
            return { ...utgiftsperiodeFeil, årMånedFra: 'Mangelfull utfylling av utgiftsperiode' };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...utgiftsperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && utgiftsperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...utgiftsperiodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
                };
            }
        }
        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

export const validerKontantstøttePerioder = ({
    kontantstøtteperioder,
}: {
    kontantstøtteperioder: IKontantstøttePeriode[];
}): FormErrors<{ kontantstøtteperioder: IKontantstøttePeriode[] }> => {
    const feilIKontantstøtteperioder = kontantstøtteperioder.map((periode, index) => {
        const { årMånedFra, årMånedTil } = periode;
        const kontantstøtteperiodeFeil: FormErrors<IKontantstøttePeriode> = {
            årMånedFra: undefined,
            årMånedTil: undefined,
            beløp: undefined,
        };

        if (!årMånedTil || !årMånedFra) {
            return {
                ...kontantstøtteperiodeFeil,
                årMånedFra: 'Mangelfull utfylling av periode',
            };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...kontantstøtteperiodeFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        const forrige = index > 0 && kontantstøtteperioder[index - 1];
        if (forrige && forrige.årMånedTil) {
            if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
                return {
                    ...kontantstøtteperiodeFeil,
                    årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
                };
            }
        }
        return kontantstøtteperiodeFeil;
    });

    return {
        kontantstøtteperioder: feilIKontantstøtteperioder,
    };
};
