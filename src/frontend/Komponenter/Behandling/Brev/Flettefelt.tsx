import { erFlettefeltFritektsfelt, finnFlettefeltNavnOgBeskrivelseFraRef } from './BrevUtils';
import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse } from './BrevTyper';
import { BodyShort, HelpText, HStack, Label, Textarea, TextField } from '@navikt/ds-react';

interface Props {
    flettefelt: Flettefeltreferanse;
    dokument: BrevStruktur;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (
        verdi: string,
        flettefelt: Flettefeltreferanse,
        flettefeltApiNavn?: string
    ) => void;
}

export const Flettefelt: React.FC<Props> = ({
    flettefelt,
    dokument,
    flettefelter,
    handleFlettefeltInput,
}) => {
    const flettefeltMedVerdi = flettefelter?.find((felt) => felt._ref === flettefelt._ref);
    const { flettefeltNavn, flettefeltBeskrivelse, flettefeltApiNavn } =
        finnFlettefeltNavnOgBeskrivelseFraRef(dokument, flettefelt._ref);

    if (erFlettefeltFritektsfelt(dokument, flettefelt._ref)) {
        return (
            <Textarea
                label={flettefeltNavn}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt, flettefeltApiNavn);
                }}
                value={flettefeltMedVerdi?.verdi || ''}
                maxLength={0}
            />
        );
    } else {
        return flettefeltMedVerdi?.automatiskUtfylt ? (
            <div>
                <Label>{flettefeltNavn}</Label>
                <HStack>
                    <BodyShort>{flettefeltMedVerdi.verdi}</BodyShort>
                    {flettefeltBeskrivelse && <HelpText>{flettefeltBeskrivelse}</HelpText>}
                </HStack>
            </div>
        ) : (
            <TextField
                description={flettefeltBeskrivelse}
                label={flettefeltNavn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt, flettefeltApiNavn);
                }}
                value={flettefeltMedVerdi?.verdi || ''}
            />
        );
    }
};
