import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { IUtgiftsperiodeSkolepenger } from '../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';

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
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode) => {
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
