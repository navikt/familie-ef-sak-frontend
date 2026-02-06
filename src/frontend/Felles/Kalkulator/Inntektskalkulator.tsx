import { Button, HStack, MonthPicker, useMonthpicker, VStack } from '@navikt/ds-react';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import ForwardedTextField from '../../Komponenter/Behandling/VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/ForwardedTextField';
import { EnsligErrorMessage } from '../ErrorMessage/EnsligErrorMessage';

const TASTATURTAST_ENTER = 'Enter';

const Inntektskalkulator = forwardRef<
    { focus: () => void },
    {
        leggTilBeregnetInntektTekstIBegrunnelse: (årsinntekt: number, fraOgMed?: Date) => void;
        nullstillBegrunnelse?: () => void;
    }
>(({ leggTilBeregnetInntektTekstIBegrunnelse, nullstillBegrunnelse }, ref) => {
    const [årsinntekt, settÅrsinntekt] = useState<string>('');
    const textFieldRef = useRef<HTMLInputElement>(null);
    const [feilmedling, settFeilmedling] = useState<string>('');
    const [fraOgMed, settFraOgMed] = useState<Date | undefined>(undefined);

    useImperativeHandle(ref, () => ({
        focus: () => {
            textFieldRef.current?.focus();
        },
    }));

    const { monthpickerProps, inputProps, reset } = useMonthpicker({
        onMonthChange: (month) => {
            settFraOgMed(month);
        },
    });

    const oppdaterÅrsinntekt = () => {
        settFeilmedling('');
        const årsinntektTall = parseFloat(årsinntekt);

        if (isNaN(årsinntektTall)) {
            settFeilmedling('Årsinntekt må være et tall');
            return;
        }

        leggTilBeregnetInntektTekstIBegrunnelse(årsinntektTall, fraOgMed);
        settÅrsinntekt('');
        settFraOgMed(undefined);
        reset();
    };

    const handleRegnUtOgLeggTilTekst = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === TASTATURTAST_ENTER) {
            event.preventDefault();
            oppdaterÅrsinntekt();
        }
    };

    const handleTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        settÅrsinntekt(value);

        if (!isNaN(parseFloat(value))) {
            settFeilmedling('');
        }
    };

    const nullstillKalkulator = () => {
        if (nullstillBegrunnelse !== undefined) {
            nullstillBegrunnelse();
        }
        settÅrsinntekt('');
    };

    return (
        <VStack gap="space-16">
            <BodyShortSmall>
                Legg inn årsinntekt og fra-dato for å regne ut +/- prosent.
            </BodyShortSmall>

            <HStack gap="4" justify={nullstillBegrunnelse ? 'start' : 'space-between'}>
                <ForwardedTextField
                    ref={textFieldRef}
                    placeholder=""
                    type="number"
                    inputMode="numeric"
                    label="Årsinntekt"
                    size="small"
                    value={årsinntekt}
                    onChange={handleTextFieldOnChange}
                    onKeyDown={handleRegnUtOgLeggTilTekst}
                />

                <MonthPicker {...monthpickerProps}>
                    <MonthPicker.Input {...inputProps} label="Fra og med" size="small" />
                </MonthPicker>

                <HStack gap="2" align={'end'}>
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="xsmall"
                            onClick={oppdaterÅrsinntekt}
                        >
                            Beregn
                        </Button>
                    </div>

                    <div>
                        {nullstillBegrunnelse !== undefined && (
                            <Button
                                type="button"
                                variant="tertiary"
                                size="xsmall"
                                onClick={nullstillKalkulator}
                            >
                                Nullstill
                            </Button>
                        )}
                    </div>
                </HStack>

                <EnsligErrorMessage>{feilmedling}</EnsligErrorMessage>
            </HStack>
        </VStack>
    );
});

Inntektskalkulator.displayName = 'Inntektskalkulator';

export default Inntektskalkulator;
