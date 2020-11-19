import { FC } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import * as React from 'react';

interface Props {
    unntak: UnntakType[];
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const Unntak: FC<Props> = ({ vurdering, settVurdering, unntak }) => {
    const hentResultatForUnntak = (unntakType: UnntakType | undefined): Vilkårsresultat => {
        if (!unntakType) {
            return Vilkårsresultat.IKKE_VURDERT;
        } else if (unntakType === UnntakType.IKKE_OPPFYLT) {
            return Vilkårsresultat.NEI;
        } else {
            return Vilkårsresultat.JA;
        }
    };

    return (
        <>
            <RadioGruppe key={vurdering.id} legend={'Er unntak fra hovedregelen oppfylt?'}>
                {unntak.map((unntakType) => (
                    <Radio
                        key={unntakType}
                        label={unntakTypeTilTekst[unntakType]}
                        name={unntakType}
                        value={unntakTypeTilTekst[unntakType]}
                        checked={vurdering.unntak === unntakTypeTilTekst[unntakType]}
                        onChange={(e) => {
                            const unntak = e.target.value as UnntakType;
                            settVurdering({
                                ...vurdering,
                                unntak: unntak,
                                resultat: hentResultatForUnntak(unntak),
                            });
                        }}
                    />
                ))}
            </RadioGruppe>
        </>
    );
};
export default Unntak;
