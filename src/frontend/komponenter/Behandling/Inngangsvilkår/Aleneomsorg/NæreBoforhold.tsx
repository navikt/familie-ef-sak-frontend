import React, { FC } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { ENæreBoforhold, næreBoforholdTilTekst } from './typer';
import { IDelvilkår, IVurdering } from '../vilkår';
import { oppdaterDelvilkår } from '../../Vurdering/Delvilkår';

interface Props {
    delvilkår: IDelvilkår;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const NæreBoforhold: FC<Props> = ({ vurdering, delvilkår, settVurdering }) => {
    return (
        <>
            <RadioGruppe key={'nære boforhold'} legend={'Om boforholdet'}>
                {[
                    ENæreBoforhold.sammeHusOgFærreEnn4Boenheter,
                    ENæreBoforhold.sammeHusOgFlereEnn4BoenheterMenVurdertNært,
                    ENæreBoforhold.selvstendigeBoligerSammeGårdstun,
                    ENæreBoforhold.selvstendigeBoligerSammeTomt,
                    ENæreBoforhold.nærmesteBoligEllerRekkehusISammeGate,
                    ENæreBoforhold.tilStøtendeBoligerEllerRekkehusISammeGate,
                ].map((årsak) => (
                    <Radio
                        key={årsak}
                        label={næreBoforholdTilTekst[årsak]}
                        name={årsak}
                        onChange={() =>
                            settVurdering(
                                oppdaterDelvilkår(vurdering, {
                                    ...delvilkår,
                                    årsak: delvilkår.type,
                                })
                            )
                        }
                        value={årsak}
                        checked={delvilkår.årsak === årsak}
                    />
                ))}
            </RadioGruppe>
        </>
    );
};

export default NæreBoforhold;
