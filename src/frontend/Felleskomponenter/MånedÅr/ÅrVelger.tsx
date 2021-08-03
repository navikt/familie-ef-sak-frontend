import React from 'react';
import { range } from '../../utils/utils';
import { FamilieSelect } from '@navikt/familie-form-elements';

interface ÅrProps {
    år: number | undefined;
    settÅr: (år: number) => void;
    antallÅrFrem: number;
    antallÅrTilbake: number;
    lesevisning?: boolean;
    disabled?: boolean;
}

const lagÅrOptions = (år: number | undefined, antallÅrFrem: number, antallÅrTilbake: number) => {
    const gjeldendeÅr = new Date().getFullYear();
    const start = år ? Math.min(år, gjeldendeÅr - antallÅrTilbake) : gjeldendeÅr - antallÅrTilbake;
    const slutt = år ? Math.max(år, gjeldendeÅr + antallÅrFrem) : gjeldendeÅr + antallÅrFrem;
    return range(start, slutt).map((år) => (
        <option value={år} key={år}>
            {år}
        </option>
    ));
};

const Årvelger: React.FC<ÅrProps> = ({
    år,
    settÅr,
    antallÅrFrem,
    antallÅrTilbake,
    lesevisning = false,
    disabled = false,
}) => {
    const årOptions = lagÅrOptions(år, antallÅrFrem, antallÅrTilbake);
    return (
        <FamilieSelect
            lesevisningVerdi={år ? år.toString() : ''}
            value={år}
            bredde={'xs'}
            onChange={(event) => {
                event.persist();
                settÅr(parseInt(event.target.value));
            }}
            erLesevisning={lesevisning}
            disabled={disabled}
        >
            <option value="">År</option>
            {årOptions}
        </FamilieSelect>
    );
};

export default Årvelger;
