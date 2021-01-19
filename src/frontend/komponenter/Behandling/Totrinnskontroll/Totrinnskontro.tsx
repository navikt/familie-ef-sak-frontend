import * as React from 'react';
import { FC } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';

const Totrinnskontroll: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    return (
        <div>
            <Undertittel>To-trinnskontroll</Undertittel>
            <Element></Element>
        </div>
    );
};

export default Totrinnskontroll;
