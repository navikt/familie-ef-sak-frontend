import React from 'react';
import { Select } from 'nav-frontend-skjema';

interface MånedProps {
    måned: number | undefined;
    settMåned: (måned: number) => void;
}

const MånedVelger: React.FC<MånedProps> = ({ måned, settMåned }) => {
    return (
        <Select
            value={måned}
            onChange={(event) => {
                event.persist();
                settMåned(parseInt(event.target.value, 10));
            }}
        >
            <option value="">Måned</option>
            <option value={1}>Januar</option>
            <option value={2}>Februar</option>
            <option value={3}>Mars</option>
            <option value={4}>April</option>
            <option value={5}>Mai</option>
            <option value={6}>Juni</option>
            <option value={7}>Juli</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>Oktober</option>
            <option value={11}>November</option>
            <option value={12}>Desember</option>
        </Select>
    );
};

export default MånedVelger;
