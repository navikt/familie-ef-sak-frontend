import React from 'react';
import { Select } from 'nav-frontend-skjema';

interface MånedProps {
    måned: string | undefined;
    settMåned: (måned: string) => void;
}

const MånedVelger: React.FC<MånedProps> = ({ måned, settMåned }) => {
    return (
        <Select
            value={måned}
            onChange={(event) => {
                event.persist();
                settMåned(event.target.value);
            }}
        >
            <option value="">Måned</option>
            <option value={'01'}>Januar</option>
            <option value={'02'}>Februar</option>
            <option value={'03'}>Mars</option>
            <option value={'04'}>April</option>
            <option value={'05'}>Mai</option>
            <option value={'06'}>Juni</option>
            <option value={'07'}>Juli</option>
            <option value={'08'}>August</option>
            <option value={'09'}>September</option>
            <option value={'10'}>Oktober</option>
            <option value={'11'}>November</option>
            <option value={'12'}>Desember</option>
        </Select>
    );
};

export default MånedVelger;
