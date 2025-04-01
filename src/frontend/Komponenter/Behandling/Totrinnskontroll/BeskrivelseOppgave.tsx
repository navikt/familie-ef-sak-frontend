import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';

export type BeskrivelseMarkeringer =
    | 'Særlig tilsynskrevende barn'
    | 'Selvstendig næringsdrivende'
    | 'EØS'
    | 'Kontrollsak';

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
        >
            {beskrivelseMarkeringerValg.map((valg) => (
                <Checkbox key={valg} value={valg}>
                    {valg}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};
