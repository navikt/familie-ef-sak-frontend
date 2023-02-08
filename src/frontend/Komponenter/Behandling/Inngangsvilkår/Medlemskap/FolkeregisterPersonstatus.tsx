import * as React from 'react';
import { FC } from 'react';
import { Folkeregisterpersonstatus } from '../../../../App/typer/personopplysninger';
import { toTitleCase } from '../../../../App/utils/utils';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

const FolkeregisterPersonstatus: FC<{ status: Folkeregisterpersonstatus }> = ({ status }) => (
    <Informasjonsrad
        ikon={VilkårInfoIkon.REGISTER}
        label="Personstatus"
        verdi={toTitleCase(status)}
    />
);

export default FolkeregisterPersonstatus;
