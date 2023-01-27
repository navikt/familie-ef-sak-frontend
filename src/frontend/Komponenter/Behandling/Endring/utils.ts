import { IEndring, IEndringer, IEndringerPersonopplysninger } from './personopplysningerEndringer';

export const utledEndringerPåPersonopplysninger = (
    personopplysninger: IEndringerPersonopplysninger
): (keyof IEndringer)[] =>
    Object.entries(personopplysninger.endringer)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => (value as IEndring).harEndringer)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([key, _]) => key as keyof IEndringer);
