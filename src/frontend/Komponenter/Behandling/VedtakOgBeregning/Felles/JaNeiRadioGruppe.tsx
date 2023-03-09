import { ERadioValg, radioValgTilTekst } from '../../../../App/typer/vedtak';
import { BodyShort, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';

interface Props {
    className?: string;
    error?: string | undefined;
    legend: string;
    lesevisning: boolean;
    onChange: (event: React.ChangeEvent<Element>) => void;
    value: ERadioValg;
}
const JaNeiRadioGruppe: React.FC<Props> = ({
    className,
    error,
    legend,
    lesevisning,
    onChange,
    value,
}) => (
    <div className={className}>
        <BodyShort>{legend}</BodyShort>
        {lesevisning ? (
            <BodyShort>{radioValgTilTekst[value]}</BodyShort>
        ) : (
            <RadioGroup error={error} legend={legend} hideLegend={true} value={value}>
                <Radio value={ERadioValg.JA} onChange={(event) => onChange(event)}>
                    Ja
                </Radio>
                <Radio value={ERadioValg.NEI} onChange={(event) => onChange(event)}>
                    Nei
                </Radio>
            </RadioGroup>
        )}
    </div>
);

export default JaNeiRadioGruppe;
