import React, { FC } from 'react';
import {
    IBarnMedSamvær,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { utledNavnOgAlder } from '../../Inngangsvilkår/utils';
import { BarneInfoWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const TilsynsutgifterBarnInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
}> = ({ gjeldendeBarn }) => {
    const { registergrunnlag, barnepass } = gjeldendeBarn;
    const harPassordning = barnepass && barnepass.barnepassordninger;
    const passordningTittel =
        harPassordning && barnepass?.barnepassordninger.length > 1
            ? 'Barnepassordninger'
            : 'Barnepassordning';

    if (!gjeldendeBarn.barnepass?.skalHaBarnepass) {
        return (
            <BarneInfoWrapper
                navnOgAlderPåBarn={utledNavnOgAlder(
                    registergrunnlag.navn,
                    registergrunnlag.fødselsdato,
                    registergrunnlag.dødsdato
                )}
                dødsdato={registergrunnlag.dødsdato}
            >
                <Informasjonsrad label="Ingen søknadsopplysninger" />
            </BarneInfoWrapper>
        );
    }

    return (
        <BarneInfoWrapper
            navnOgAlderPåBarn={utledNavnOgAlder(
                registergrunnlag.navn,
                registergrunnlag.fødselsdato,
                registergrunnlag.dødsdato
            )}
            dødsdato={registergrunnlag.dødsdato}
        >
            {harPassordning && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label={passordningTittel}
                        verdi={barnepass?.barnepassordninger.map((ordning) => {
                            return typeBarnepassordningTilTekst[ordning.type]; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Navn passordning"
                        verdi={barnepass?.barnepassordninger.map((ordning) => {
                            return ordning.navn; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Periode passordning"
                        verdi={barnepass?.barnepassordninger.map((ordning) => {
                            return `${formaterNullableIsoDato(
                                ordning.fra
                            )} - ${formaterNullableIsoDato(ordning.til)}`; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Utgifter"
                        verdi={barnepass?.barnepassordninger.map((ordning) => {
                            return ordning.beløp + ',-'; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    />
                </>
            )}
        </BarneInfoWrapper>
    );
};

export default TilsynsutgifterBarnInfo;
