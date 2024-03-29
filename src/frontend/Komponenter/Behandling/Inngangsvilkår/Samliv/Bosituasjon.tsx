import React, { FC } from 'react';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner }) => {
    return (
        <>
            {bosituasjon.delerDuBolig === ESøkerDelerBolig.harEkteskapsliknendeForhold && (
                <SamboerInfoOgDatoSammenflytting
                    samboer={bosituasjon?.samboer}
                    sammenflyttingsdato={bosituasjon?.sammenflyttingsdato}
                />
            )}

            {bosituasjon.delerDuBolig ===
                ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Tidligere samboer"
                        verdi={hentPersonInfo(bosituasjon.samboer)}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Flyttet fra hverandre"
                        verdi={formaterNullableIsoDato(bosituasjon.datoFlyttetFraHverandre) || '-'}
                    />
                </>
            )}

            {[
                ESøkerDelerBolig.borAleneMedBarnEllerGravid,
                ESøkerDelerBolig.delerBoligMedAndreVoksne,
                ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
            ].includes(bosituasjon.delerDuBolig) &&
                sivilstandsplaner && <Sivilstandsplaner sivilstandsplaner={sivilstandsplaner} />}
        </>
    );
};

const SamboerInfoOgDatoSammenflytting: FC<{
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
}> = ({ samboer, sammenflyttingsdato }) => (
    <>
        <Informasjonsrad
            ikon={VilkårInfoIkon.SØKNAD}
            label="Samboer"
            verdi={hentPersonInfo(samboer)}
        />
        <Informasjonsrad
            ikon={VilkårInfoIkon.SØKNAD}
            label="Flyttet sammen"
            verdi={formaterNullableIsoDato(sammenflyttingsdato)}
        />
    </>
);

const Sivilstandsplaner: FC<{ sivilstandsplaner: ISivilstandsplaner }> = ({
    sivilstandsplaner,
}) => (
    <>
        <Informasjonsrad
            ikon={VilkårInfoIkon.SØKNAD}
            label="Skal gifte seg eller bli samboer"
            verdi={mapTrueFalse(!!sivilstandsplaner.harPlaner)}
        />

        {sivilstandsplaner.harPlaner && (
            <>
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Dato"
                    verdi={formaterNullableIsoDato(sivilstandsplaner.fraDato)}
                />
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Ektefelle eller samboer"
                    verdi={`${sivilstandsplaner.vordendeSamboerEktefelle?.navn} - ${
                        sivilstandsplaner.vordendeSamboerEktefelle?.personIdent ||
                        formaterNullableIsoDato(
                            sivilstandsplaner.vordendeSamboerEktefelle?.fødselsdato
                        )
                    }`}
                />
            </>
        )}
    </>
);
