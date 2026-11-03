import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BeskrivelseMarkeringer, BeskrivelseOppgave } from './BeskrivelseOppgave';

describe('BeskrivelseOppgave', () => {
    const markeringer: BeskrivelseMarkeringer[] = [
        'Særlig tilsynskrevende barn',
        'Selvstendig næringsdrivende',
        'EØS',
        'Kontrollsak',
    ];

    it.each([0, 1, 2, 3, 4])(
        'viser feilmelding bare når mer enn to alternativer er valgt (%i valgt)',
        (antallValgte) => {
            const html = renderToStaticMarkup(
                <BeskrivelseOppgave
                    beskrivelseMarkeringer={markeringer.slice(0, antallValgte)}
                    settBeskrivelseMarkeringer={vi.fn()}
                />
            );

            if (antallValgte > 2) {
                expect(html).toContain('Du kan velge maks to alternativer.');
            } else {
                expect(html).not.toContain('Du kan velge maks to alternativer.');
            }
            expect(html.match(/checked=""/g) ?? []).toHaveLength(antallValgte);
            expect(html).not.toContain('disabled=""');
        }
    );
});
