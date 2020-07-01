import * as React from 'react';
import Lenke from 'nav-frontend-lenker';

const Venstremeny: React.FunctionComponent = () => {
    return (
        <ul>
            <li>
                <Lenke href={'personopplysninger'}>Personopplysninger</Lenke>
            </li>
            <li>
                <Lenke href={'overgangsstonad'}>Overgansstønad</Lenke>
            </li>
        </ul>
    );
};

export default Venstremeny;
