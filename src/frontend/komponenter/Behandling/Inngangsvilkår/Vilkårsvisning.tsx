import React, { FC } from 'react';
import { IInngangsvilkår } from './vilkår';
import Medlemskap from './Medlemskap/Medlemskap';

interface Props {
    inngangsvilkår: IInngangsvilkår;
}

const Vilkårsvisning: FC<Props> = ({ inngangsvilkår }) => {
    const { medlemskap } = inngangsvilkår;
    return (
        <>
            <Medlemskap medlemskap={medlemskap} />
        </>
    );
};

export default Vilkårsvisning;
