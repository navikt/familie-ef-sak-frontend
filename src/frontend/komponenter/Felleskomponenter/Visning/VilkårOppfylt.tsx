import React, { FC } from 'react';
import Oppfylt from '../../../ikoner/Oppfylt';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';

interface Props {
    erOppfylt: boolean;
}

const VilkårOppfylt: FC<Props> = ({ erOppfylt }) => {
    return (
        <>
            {' '}
            {erOppfylt ? (
                <Oppfylt heigth={21} width={21} />
            ) : (
                <IkkeOppfylt heigth={21} width={21} />
            )}
        </>
    );
};

export default VilkårOppfylt;
