import { IEndring, IEndringerPersonopplysninger } from '../Inngangsvilkår/vilkår';

export const erEndringPåPersonopplysninger = (
    personopplysninger: IEndringerPersonopplysninger
): boolean =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(personopplysninger.endringer).some(([_, v]) => (v as IEndring).harEndringer);
