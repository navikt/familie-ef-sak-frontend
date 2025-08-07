import { useRangeDatepicker, Heading, DatePicker, HStack } from '@navikt/ds-react';
import React from 'react';

const DatePickerMedTittel: React.FC<{
    tittel?: string;
    periode?: {
        fra: { årstall: string; måned: string };
        til: { årstall: string; måned: string };
    };
    settPeriode?: React.Dispatch<
        React.SetStateAction<{
            fra: { årstall: string; måned: string };
            til: { årstall: string; måned: string };
        }>
    >;
    lagBeregninger: (
        fra: {
            årstall: string;
            måned: string;
        },
        til: {
            årstall: string;
            måned: string;
        }
    ) => void;
}> = ({ tittel, settPeriode, lagBeregninger }) => {
    const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
        onRangeChange: (range) => {
            if (range?.from && settPeriode) {
                const fra = {
                    årstall: range.from.getFullYear().toString(),
                    måned: range.from.toLocaleDateString('no-NO', { month: 'long' }),
                };
                const til = {
                    årstall: range.to?.getFullYear().toString() || '',
                    måned: range.to?.toLocaleDateString('no-NO', { month: 'long' }) || '',
                };

                settPeriode({
                    fra: fra,
                    til: til,
                });

                if (lagBeregninger) {
                    lagBeregninger(fra, til);
                }
            }
        },
    });

    return (
        <>
            <div>
                <Heading level="3" size="xsmall">
                    {tittel}
                </Heading>
                <DatePicker {...datepickerProps}>
                    <HStack wrap gap="4" justify="center">
                        <DatePicker.Input {...fromInputProps} label="Fra" size="small" />
                        <DatePicker.Input {...toInputProps} label="Til" size="small" />
                    </HStack>
                </DatePicker>
            </div>
        </>
    );
};

export default DatePickerMedTittel;
