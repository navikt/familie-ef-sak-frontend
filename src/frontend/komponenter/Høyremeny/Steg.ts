export const enum Steg {
    REGISTRERE_OPPLYSNINGER = 'REGISTRERE_OPPLYSNINGER',
    VILKÅRSVURDERE_INNGANGSVILKÅR = 'VILKÅRSVURDERE_INNGANGSVILKÅR',
    VILKÅRSVURDERE_STØNAD = 'VILKÅRSVURDERE_STØNAD',
}

export const StegVerdi = new Map<Steg, string>([
    [Steg.REGISTRERE_OPPLYSNINGER, 'Registrere Opplysninger'],
    [Steg.VILKÅRSVURDERE_INNGANGSVILKÅR, 'Vilkårsvurdere Inngangsvilkår'],
    [Steg.VILKÅRSVURDERE_STØNAD, 'Vilkårsvurdere Stønad'],
]);
