import React from 'react';
import { FamilieSelect } from '@navikt/familie-form-elements';

interface MånedProps {
    måned: string | undefined;
    settMåned: (måned: string) => void;
    lesevisning?: boolean;
    disabled?: boolean;
    className?: string;
}

const månedValg = [
    { mndNr: '01', verdi: 'Januar' },
    { mndNr: '02', verdi: 'Februar' },
    { mndNr: '03', verdi: 'Mars' },
    { mndNr: '04', verdi: 'April' },
    { mndNr: '05', verdi: 'Mai' },
    { mndNr: '06', verdi: 'Juni' },
    { mndNr: '07', verdi: 'Juli' },
    { mndNr: '08', verdi: 'August' },
    { mndNr: '09', verdi: 'September' },
    { mndNr: '10', verdi: 'Oktober' },
    { mndNr: '11', verdi: 'November' },
    { mndNr: '12', verdi: 'Desember' },
];

const MånedVelger: React.FC<MånedProps> = ({
    måned,
    settMåned,
    lesevisning = false,
    disabled = false,
    className,
}) => {
    return (
        <FamilieSelect
            erLesevisning={lesevisning}
            lesevisningVerdi={måned ? månedValg.find((mnd) => mnd.mndNr === måned)?.verdi : ''}
            value={måned}
            className={className}
            onChange={(event) => {
                event.persist();
                settMåned(event.target.value);
            }}
            disabled={disabled}
            label={'Måned'}
            hideLabel
            size={'small'}
        >
            <option value="">Måned</option>
            {månedValg.map((mnd) => (
                <option value={mnd.mndNr} key={mnd.mndNr}>
                    {mnd.verdi}
                </option>
            ))}
        </FamilieSelect>
    );
};

export default MånedVelger;
