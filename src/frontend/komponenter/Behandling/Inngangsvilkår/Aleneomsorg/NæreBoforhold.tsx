import React, { FC } from 'react';
import { Select } from 'nav-frontend-skjema';
import { ENæreBoforhold, næreBoforholdTilTekst } from './typer';

interface Props {
    boforhold: string;
    settBoforhold: (boforhold: string) => void;
}

const NæreBoforhold: FC<Props> = ({ boforhold, settBoforhold }) => {
    return (
        <Select
            label={'Om boforholdet'}
            value={boforhold}
            onChange={(e) => settBoforhold(e.target.value)}
        >
            <option value={''}>Velg et alternativ</option>
            <option value={næreBoforholdTilTekst[ENæreBoforhold.sammeHusOgFærreEnn4Boenheter]}>
                {næreBoforholdTilTekst[ENæreBoforhold.sammeHusOgFærreEnn4Boenheter]}
            </option>
            <option
                value={
                    næreBoforholdTilTekst[ENæreBoforhold.sammeHusOgFlereEnn4BoenheterMenVurdertNært]
                }
            >
                {næreBoforholdTilTekst[ENæreBoforhold.sammeHusOgFlereEnn4BoenheterMenVurdertNært]}
            </option>
            <option value={næreBoforholdTilTekst[ENæreBoforhold.selvstendigeBoligerSammeTomt]}>
                {næreBoforholdTilTekst[ENæreBoforhold.selvstendigeBoligerSammeTomt]}
            </option>
            <option value={næreBoforholdTilTekst[ENæreBoforhold.selvstendigeBoligerSammeGårdstun]}>
                {næreBoforholdTilTekst[ENæreBoforhold.selvstendigeBoligerSammeGårdstun]}
            </option>
            <option
                value={næreBoforholdTilTekst[ENæreBoforhold.nærmesteBoligEllerRekkehusISammeGate]}
            >
                {næreBoforholdTilTekst[ENæreBoforhold.nærmesteBoligEllerRekkehusISammeGate]}
            </option>
            <option
                value={
                    næreBoforholdTilTekst[ENæreBoforhold.tilStøtendeBoligerEllerRekkehusISammeGate]
                }
            >
                {næreBoforholdTilTekst[ENæreBoforhold.tilStøtendeBoligerEllerRekkehusISammeGate]}{' '}
            </option>
        </Select>
    );
};
export default NæreBoforhold;
