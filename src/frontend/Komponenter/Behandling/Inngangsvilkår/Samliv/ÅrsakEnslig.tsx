import React, { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag } from '../Sivilstand/typer';
import { hentPersonInfo } from '../utils';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';

interface Props {
    søknadsgrunnlag: ISivilstandSøknadsgrunnlag;
}

const ÅrsakEnslig: FC<Props> = ({ søknadsgrunnlag }) => {
    const { tidligereSamboer } = søknadsgrunnlag;

    return (
        <>
            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.samlivsbruddForeldre &&
                søknadsgrunnlag.samlivsbruddsdato && (
                    <Informasjonsrad
                        ikon={TabellIkon.SØKNAD}
                        label="Dato for samlivsbrudd"
                        verdi={formaterNullableIsoDato(søknadsgrunnlag.samlivsbruddsdato)}
                    />
                )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                <>
                    <Informasjonsrad
                        ikon={TabellIkon.SØKNAD}
                        label="Tidligere samboer"
                        verdi={hentPersonInfo(tidligereSamboer)}
                    />
                    {søknadsgrunnlag.fraflytningsdato && (
                        <Informasjonsrad
                            ikon={TabellIkon.SØKNAD}
                            label="Flyttet fra hverandre"
                            verdi={formaterNullableIsoDato(søknadsgrunnlag.fraflytningsdato)}
                        />
                    )}
                </>
            )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.endringISamværsordning &&
                søknadsgrunnlag.endringSamværsordningDato && (
                    <Informasjonsrad
                        ikon={TabellIkon.SØKNAD}
                        label="Endringen skjer/skjedde"
                        verdi={formaterNullableIsoDato(søknadsgrunnlag.endringSamværsordningDato)}
                    />
                )}
        </>
    );
};
export default ÅrsakEnslig;
