import React, { FC } from 'react';

interface Props {
    behandlingId: string;
}

const Sanksjonsfastsettelse: FC<Props> = ({ behandlingId }) => {
    return <p>{behandlingId}</p>;
};

export default Sanksjonsfastsettelse;
