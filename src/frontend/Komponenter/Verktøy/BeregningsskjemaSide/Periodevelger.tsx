import { HStack, MonthPicker, useMonthpicker } from '@navikt/ds-react';
import React from 'react';
import type { Periode } from './typer';

export const Periodevelger: React.FC<{
    periode: Periode;
    settPeriode?: React.Dispatch<React.SetStateAction<Periode>>;
    lagBeregninger: (periode: Periode) => void;
    key: number;
}> = ({ periode, settPeriode, lagBeregninger, key }) => {
    const datoTiÅrTilbake = new Date();
    datoTiÅrTilbake.setFullYear(datoTiÅrTilbake.getFullYear() - 10);

    const datoTiÅrFrem = new Date();
    datoTiÅrFrem.setFullYear(datoTiÅrFrem.getFullYear() + 10);

    const fraMonthpicker = useMonthpicker({
        fromDate: datoTiÅrTilbake,
        toDate: datoTiÅrFrem,
        onMonthChange: (date) => {
            if (date) {
                if (settPeriode) {
                    const fra = {
                        årstall: date.getFullYear().toString(),
                        måned: (date.getMonth() + 1).toString(),
                    };

                    settPeriode({
                        fra,
                        til: periode.til,
                    });

                    lagBeregninger({ fra, til: periode.til });
                }
            }
        },
    });

    const tilMonthpicker = useMonthpicker({
        fromDate: datoTiÅrTilbake,
        toDate: datoTiÅrFrem,
        onMonthChange: (date) => {
            if (date) {
                if (settPeriode) {
                    const til = {
                        årstall: date.getFullYear().toString(),
                        måned: (date.getMonth() + 1).toString(),
                    };

                    settPeriode({
                        fra: periode.fra,
                        til,
                    });

                    lagBeregninger({ fra: periode.fra, til });
                }
            }
        },
    });

    return (
        <div key={key}>
            <HStack gap="4" justify="center">
                <MonthPicker {...fraMonthpicker.monthpickerProps}>
                    <MonthPicker.Input
                        {...fraMonthpicker.inputProps}
                        label="Fra måned"
                        size="small"
                    />
                </MonthPicker>
                <MonthPicker {...tilMonthpicker.monthpickerProps}>
                    <MonthPicker.Input
                        {...tilMonthpicker.inputProps}
                        label="Til måned"
                        size="small"
                    />
                </MonthPicker>
            </HStack>
        </div>
    );
};
