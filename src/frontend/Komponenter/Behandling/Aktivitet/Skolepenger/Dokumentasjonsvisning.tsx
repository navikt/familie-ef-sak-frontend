import React, { FC } from 'react';
import { formaterNullableIsoDato, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { UtdanningsformTilTekst } from '../Aktivitet/typer';
import { utledVisningForStudiebelastning } from '../../Inngangsvilkår/utils';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    aktivitet: IAktivitet;
}

const Dokumentasjonsvisning: FC<Props> = ({ aktivitet }) => {
    const { underUtdanning } = aktivitet;

    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Skole/utdanningssted"
                verdi={underUtdanning?.skoleUtdanningssted}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Linje/kurs/grad"
                verdi={underUtdanning?.linjeKursGrad}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Utdanningstype"
                verdi={
                    underUtdanning?.offentligEllerPrivat &&
                    UtdanningsformTilTekst[underUtdanning?.offentligEllerPrivat]
                }
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Studieperiode"
                verdi={`${formaterNullableIsoDato(
                    underUtdanning?.fra
                )} -  ${formaterNullableIsoDato(underUtdanning?.til)}`}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Studiebelastning"
                verdi={utledVisningForStudiebelastning(underUtdanning)}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Semesteravgift"
                verdi={utledUtgiftsbeløp(underUtdanning?.semesteravgift)}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Studieavgift"
                verdi={utledUtgiftsbeløp(underUtdanning?.studieavgift)}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Eksamensgebyr"
                verdi={utledUtgiftsbeløp(underUtdanning?.eksamensgebyr)}
            />
        </>
    );
};

export default Dokumentasjonsvisning;
