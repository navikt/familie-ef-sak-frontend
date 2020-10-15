export interface ISide {
    id: SideId;
    href: string;
    navn: string;
}

export enum SideId {
    PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
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
];
