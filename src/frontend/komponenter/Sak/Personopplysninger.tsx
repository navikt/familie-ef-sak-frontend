import * as React from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import AnyData from './AnyData';

export interface IProps {
    data?: IPersonopplysninger;
}

const Personopplysninger: React.FC<IProps> = ({ data }) => {
    return <AnyData data={data} />;
};

export default Personopplysninger;
