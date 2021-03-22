import * as React from 'react';
import { FC } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';

interface Props {
    unntak: UnntakType[];
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const vilkårsResultatForUnntak = (unntakType: UnntakType | undefined): Vilkårsresultat => {
    if (!unntakType) {
        return Vilkårsresultat.IKKE_TATT_STILLING_TIL;
    } else if (unntakType === UnntakType.IKKE_OPPFYLT) {
        return Vilkårsresultat.IKKE_OPPFYLT;
    } else {
        return Vilkårsresultat.OPPFYLT;
    }
};

const Unntak: FC<Props> = ({ vurdering, settVurdering, unntak }) => {
    return (
        <RadioGruppe key={vurdering.id} legend={'Er unntak fra hovedregelen oppfylt?'}>
            {unntak.map((unntakType) => (
                <Radio
                    key={unntakType}
                    label={unntakTypeTilTekst[unntakType]}
                    name={unntakType}
                    value={unntakTypeTilTekst[unntakType]}
                    checked={vurdering.unntak === unntakType}
                    onChange={() => {
                        settVurdering({
                            ...vurdering,
                            unntak: unntakType,
                            resultat: vilkårsResultatForUnntak(unntakType),
                        });
                    }}
                />
            ))}
        </RadioGruppe>
    );
};
export default Unntak;
