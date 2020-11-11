export interface ISide {
    id: SideId;
    href: string;
    navn: string;
}

export enum SideId {
    PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
    INNTEKT = 'INNTEKT',
    UTBETALINGSOVERSIKT = 'UTBETALINGSOVERSIKT',
}

export const sider: ISide[] = [
    {
        id: SideId.PERSONOPPLYSNINGER,
        href: 'personopplysninger',
        navn: 'Personopplysninger',
    },
    {
        id: SideId.INNGANGSVILKÅR,
        href: 'inngangsvilkar',
        navn: 'Inngangsvilkår',
    },
    {
        id: SideId.INNTEKT,
        href: 'inntekt',
        navn: 'Inntekt',
    },
    {
        id: SideId.UTBETALINGSOVERSIKT,
        href: 'utbetalingsoversikt',
        navn: 'Utbetalingsoversikt',
    },
];
