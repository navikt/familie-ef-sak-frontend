import * as React from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';

export interface IProps {
    data?: IPersonopplysninger;
}

const Personopplysninger: React.FC<IProps> = ({ data }) => {
    return <div>{JSON.stringify(data)}</div>;
};

export default Personopplysninger;
