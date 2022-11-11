import { Up } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const OppKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return <Button type={'button'} onClick={onClick} variant={'tertiary'} icon={<Up />} />;
};

export default hiddenIf(OppKnapp);
