import React from 'react';
import { Select } from 'nav-frontend-skjema';
import { range } from '../../../utils/utils';

interface ÅrProps {
    år: number | undefined;
    settÅr: (år: number) => void;
    antallÅrFrem: number;
    antallÅrTilbake: number;
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

const Årvelger: React.FC<ÅrProps> = ({ år, settÅr, antallÅrFrem, antallÅrTilbake }) => {
    const årOptions = lagÅrOptions(år, antallÅrFrem, antallÅrTilbake);
    return (
        <Select
            value={år}
            bredde={'xs'}
            onChange={(event) => {
                event.persist();
                settÅr(parseInt(event.target.value));
            }}
        >
            <option value="">År</option>
            {årOptions}
        </Select>
    );
};

export default Årvelger;
