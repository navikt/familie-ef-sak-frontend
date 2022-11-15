import React from 'react';
import KlageInfotrygdInfo from './KlageInfotrygdInfo';
import KlageInfo from './KlageInfo';

export const ÅpneKlager: React.FunctionComponent<{
    fagsakPersonId: string;
}> = ({ fagsakPersonId }) => {
    return (
        <>
            <KlageInfo fagsakPersonId={fagsakPersonId} />
            <KlageInfotrygdInfo fagsakPersonId={fagsakPersonId} />
        </>
    );
};
