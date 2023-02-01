import * as React from 'react';
import { FC } from 'react';
import { Folkeregisterpersonstatus } from '../../../../App/typer/personopplysninger';
import { toTitleCase } from '../../../../App/utils/utils';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const FolkeregisterPersonstatus: FC<{ status: Folkeregisterpersonstatus }> = ({ status }) => (
    <Informasjonsrad ikon={TabellIkon.REGISTER} label="Personstatus" verdi={toTitleCase(status)} />
);

export default FolkeregisterPersonstatus;
