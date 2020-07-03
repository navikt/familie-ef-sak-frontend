import * as React from 'react';
import AnyData from './AnyData';
import { IOvergangsstønad } from '../../typer/overgangsstønad';

export interface IProps {
    data?: IOvergangsstønad;
}

const Overgangsstønad: React.FC<IProps> = ({ data }) => {
    return <AnyData data={data} />;
};

export default Overgangsstønad;
