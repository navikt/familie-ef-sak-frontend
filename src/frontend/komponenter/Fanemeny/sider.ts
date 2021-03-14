import TidligereStønadsperioder from '../Behandling/TidligereStønadsperioder/TidligereStønadsperioder';
import {FunctionComponent} from 'react';
import Personopplysninger from '../Behandling/Personopplysninger/Personopplysninger';
import Inngangsvilkår from '../Behandling/Inngangsvilkår/Inngangsvilkår';
import Aktivitet from '../Behandling/Aktivitet/Aktivitet';
import Inntekt from '../Behandling/Inntekt/Inntekt';
import Utbetalingsoversikt from '../Behandling/Utbetalingsoversikt/Utbetalingsoversikt';
import Brev from '../Behandling/Brev/Brev';
import Blankett from '../Behandling/Blankett/Blankett';

export interface ISide {
    href: string;
    navn: string;
    komponent: FunctionComponent<{behandlingId: string}>;
}

export const sider: ISide[] = [
    {
        href: 'tidligerestønadsperioder',
        navn: 'Tidligere Stønadsperioder',
        komponent: TidligereStønadsperioder,
    },
    {
        href: 'personopplysninger',
        navn: 'Personopplysninger',
        komponent: Personopplysninger,
    },
    {
        href: 'inngangsvilkar',
        navn: 'Inngangsvilkår',
        komponent: Inngangsvilkår,
    },
    {
        href: 'aktivitet',
        navn: 'Aktivitet',
        komponent: Aktivitet,
    },
    {
        href: 'inntekt',
        navn: 'Inntekt',
        komponent: Inntekt,
    },
    {
        href: 'utbetalingsoversikt',
        navn: 'Utbetalingsoversikt',
        komponent: Utbetalingsoversikt,
    },
    {
        href: 'brev',
        navn: 'Brev',
        komponent: Brev,
    },
    {
        href: 'blankett',
        navn: 'Blankett',
        komponent: Blankett,
    },
];
