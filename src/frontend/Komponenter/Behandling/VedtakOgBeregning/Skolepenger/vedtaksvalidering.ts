import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { IUtgiftsperiodeSkolepenger } from '../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { erMånedÅrEtterEllerLik } from '../../../../App/utils/dato';

export const validerInnvilgetVedtakForm = ({
    utgiftsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            utgiftsperioder,
        }),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerPerioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: IUtgiftsperiodeSkolepenger[];
}): FormErrors<{
    utgiftsperioder: IUtgiftsperiodeSkolepenger[];
}> => {
    return {
        ...validerUtgiftsperioder({ utgiftsperioder }),
    };
};

export const validerUtgiftsperioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: IUtgiftsperiodeSkolepenger[];
}): FormErrors<{ utgiftsperioder: IUtgiftsperiodeSkolepenger[] }> => {
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode, index, utgiftsperioder) => {
        const { studietype, årMånedFra, årMånedTil, studiebelastning, utgifter } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<IUtgiftsperiodeSkolepenger> = {
            studietype: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
            studiebelastning: undefined,
            utgifter: undefined,
        };

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
        }

        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
