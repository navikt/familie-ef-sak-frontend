export interface ISide {
    id: SideId;
    href: string;
    navn: string;
}

export enum SideId {
    PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
    AKTIVITET = 'AKTIVITET',
    INNTEKT = 'INNTEKT',
    UTBETALINGSOVERSIKT = 'UTBETALINGSOVERSIKT',
    BREV = 'BREV',
    BLANKETT = 'BLANKETT',
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
        id: SideId.AKTIVITET,
        href: 'aktivitet',
        navn: 'Aktivitet',
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
    {
        id: SideId.BREV,
        href: 'brev',
        navn: 'Brev',
    },
    {
        id: SideId.BLANKETT,
        href: 'blankett',
        navn: 'Blankett',
    },
];
