import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';

export type BeskrivelseMarkeringer =
    'Særlig tilsynskrevende barn' | 'Selvstendig næringsdrivende' | 'EØS' | 'Kontrollsak';

export const MAKS_ANTALL_BESKRIVELSE_MARKERINGER = 2;

const beskrivelseMarkeringerValg: BeskrivelseMarkeringer[] = [
    'Særlig tilsynskrevende barn',
    'Selvstendig næringsdrivende',
    'EØS',
    'Kontrollsak',
] as const;

export const BeskrivelseOppgave: FC<{
    beskrivelseMarkeringer: BeskrivelseMarkeringer[];
    settBeskrivelseMarkeringer: React.Dispatch<React.SetStateAction<BeskrivelseMarkeringer[]>>;
}> = ({ beskrivelseMarkeringer, settBeskrivelseMarkeringer }) => {
    return (
        <CheckboxGroup
            legend="Godkjenne vedtak-oppgaven skal merkes med:"
            onChange={settBeskrivelseMarkeringer}
            value={beskrivelseMarkeringer}
            size="small"
            error={
                beskrivelseMarkeringer.length > MAKS_ANTALL_BESKRIVELSE_MARKERINGER
                    ? 'Du kan velge maks to alternativer.'
                    : undefined
            }
        >
            {beskrivelseMarkeringerValg.map((valg) => (
                <Checkbox key={valg} value={valg}>
                    {valg}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};
