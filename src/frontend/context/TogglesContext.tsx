import { useState } from 'react';

import createUseContext from 'constate';
import { Toggles } from './toggles';

const [TogglesProvider, useToggles] = createUseContext(() => {
    const [toggles, settToggles] = useState<Toggles>({});
    TogglesProvider.displayName = 'TOGGLES_PROVIDER';

    return { toggles, settToggles };
});

export { TogglesProvider, useToggles };
