import React from 'react';
import styled from 'styled-components';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { ERadioValg } from '../../../../App/typer/vedtak';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { EFinnesKontantstøtteUtbetaling } from '../../../../App/hooks/useHentKontantstøtteUtbetalinger';
import { Alert } from '@navikt/ds-react';
import JaNeiRadioGruppe from '../Felles/JaNeiRadioGruppe';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const AlertOgRadioknappWrapper = styled.div`
    width: max-content;
`;

interface Props {
    erLesevisning: boolean;
    kontantstøtte: FieldState;

    valideringsfeil?: FormErrors<InnvilgeVedtakForm>;
    finnesKontantstøtteUtbetaling: EFinnesKontantstøtteUtbetaling;
}
export const KontantstøtteAlert: React.FC<Props> = ({
    erLesevisning,
    kontantstøtte,

    valideringsfeil,
    finnesKontantstøtteUtbetaling,
}) => {
    const radioGruppeTekst =
        'Er det søkt om, utbetales det eller har det blitt utbetalt kontantstøtte til brukeren eller en brukeren bor med i perioden(e) det er søkt om?';
    return (
        <AlertOgRadioknappWrapper>
            {!erLesevisning &&
                finnesKontantstøtteUtbetaling === EFinnesKontantstøtteUtbetaling.JA && (
                    <AlertStripe variant={'warning'} size={'small'}>
                        Bruker har eller har fått kontantstøtte.
                    </AlertStripe>
                )}
            {!erLesevisning &&
                finnesKontantstøtteUtbetaling === EFinnesKontantstøtteUtbetaling.NEI && (
                    <AlertStripe variant={'info'} size={'small'}>
                        Bruker verken mottar eller har mottatt kontantstøtte.
                    </AlertStripe>
                )}

            <JaNeiRadioGruppe
                error={valideringsfeil?.harKontantstøtte}
                legend={radioGruppeTekst}
                lesevisning={erLesevisning}
                onChange={(event) => kontantstøtte.onChange(event)}
                value={kontantstøtte.value as ERadioValg}
            />
        </AlertOgRadioknappWrapper>
    );
};
