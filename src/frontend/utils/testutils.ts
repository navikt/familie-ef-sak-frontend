import { DelvilkårType, Vilkårsresultat } from '../komponenter/Behandling/Inngangsvilkår/vilkår';
import { queryHelpers } from '@testing-library/dom';

export const finnRadioKnappFor = (
    container: HTMLElement,
    delvilkår: DelvilkårType,
    vilkårsresultat: Vilkårsresultat
) => {
    const getByName = queryHelpers.queryAllByAttribute.bind(null, 'name');
    const radioknappForDelvilkår: HTMLElement[] = getByName(container, delvilkår);

    const radioknappForResultat = radioknappForDelvilkår.find(
        (r) => r.getAttribute('value') === vilkårsresultat
    );

    if (radioknappForResultat) {
        return radioknappForResultat;
    }

    throw Error(`Fant ingen radioknapp for ${delvilkår} og ${vilkårsresultat}`);
};
