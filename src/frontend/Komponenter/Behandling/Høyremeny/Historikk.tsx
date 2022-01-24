import React from 'react';
import { BeslutterIkon } from '../../../Felles/Ikoner/BeslutterIkon';
import { SaksbehandlerIkon } from '../../../Felles/Ikoner/SaksbehandlerIkon';
import { Behandlingshistorikk } from './typer';
import { SystemIkon } from '../../../Felles/Ikoner/SystemIkon';

export enum Hendelse {
    OPPRETTET = 'OPPRETTET',
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    VEDTAK_GODKJENT = 'VEDTAK_GODKJENT',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    VEDTAK_IVERKSATT = 'VEDTAK_IVERKSATT',
    VEDTAK_AVSLÅTT = 'VEDTAK_AVSLÅTT',
    HENLAGT = 'HENLAGT',
}

export const hendelseTilHistorikkTekst: Record<Hendelse, string> = {
    OPPRETTET: 'Behandling opprettet',
    SENDT_TIL_BESLUTTER: 'Sendt til beslutter',
    VEDTAK_GODKJENT: 'Vedtak godkjent',
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    VEDTAK_IVERKSATT: 'Vedtak iverksatt',
    VEDTAK_AVSLÅTT: 'Vedtak avslått',
    HENLAGT: 'Behandling henlagt',
};

export const HendelseIkon: React.FC<{ behandlingshistorikk: Behandlingshistorikk }> = ({
    behandlingshistorikk,
}) => {
    const { hendelse } = behandlingshistorikk;
    switch (hendelse) {
        case Hendelse.OPPRETTET:
        case Hendelse.SENDT_TIL_BESLUTTER:
        case Hendelse.HENLAGT:
            return <SaksbehandlerIkon />;
        case Hendelse.VEDTAK_GODKJENT:
        case Hendelse.VEDTAK_UNDERKJENT:
            return <BeslutterIkon />;
        case Hendelse.VEDTAK_IVERKSATT:
            return <SystemIkon />;
        default:
            return <SaksbehandlerIkon />;
    }
};
