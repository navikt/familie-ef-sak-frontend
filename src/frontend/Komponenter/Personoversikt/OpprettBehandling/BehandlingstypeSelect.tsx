import React, { Dispatch, SetStateAction } from 'react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Select } from '@navikt/ds-react';

interface Props {
    valgtBehandlingstype: Behandlingstype | undefined;
    settValgtBehandlingstype: Dispatch<SetStateAction<Behandlingstype | undefined>>;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    kanOppretteRevurdering: boolean;
}

export const BehandlingstypeSelect: React.FC<Props> = ({
    valgtBehandlingstype,
    settValgtBehandlingstype,
    settFeilmelding,
    kanOppretteRevurdering,
}) => (
    <Select
        label="Behandlingstype"
        value={valgtBehandlingstype || ''}
        onChange={(e) => {
            settValgtBehandlingstype(e.target.value as Behandlingstype);
            settFeilmelding('');
        }}
    >
        <option value="">Velg</option>
        {kanOppretteRevurdering && <option value={Behandlingstype.REVURDERING}>Revurdering</option>}
        <option value={Behandlingstype.TILBAKEKREVING}>Tilbakekreving</option>
        <option value={Behandlingstype.KLAGE}>Klage</option>
    </Select>
);
