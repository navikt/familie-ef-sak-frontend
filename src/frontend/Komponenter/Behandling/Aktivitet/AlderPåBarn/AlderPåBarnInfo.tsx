import React, { FC } from 'react';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { ÅrsakBarnepassTilTekst } from './AlderPåBarnTyper';
import { utledNavnOgAlderPåGrunnlag } from '../../Inngangsvilkår/utils';
import { BarneInfoWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const AlderPåBarnInfo: FC<{ gjeldendeBarn: IBarnMedSamvær; skalViseSøknadsdata?: boolean }> = ({
    gjeldendeBarn,
}) => {
    const { registergrunnlag, barnepass, søknadsgrunnlag } = gjeldendeBarn;

    return (
        <BarneInfoWrapper
            navnOgAlderPåBarn={utledNavnOgAlderPåGrunnlag(registergrunnlag, søknadsgrunnlag)}
            dødsdato={registergrunnlag.dødsdato}
        >
            {registergrunnlag.fødselsnummer ? (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Fødsels eller D-nummer"
                    verdiSomString={false}
                    verdi={
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    }
                />
            ) : søknadsgrunnlag.fødselsnummer ? (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Fødsels eller D-nummer"
                    verdiSomString={false}
                    verdi={
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={søknadsgrunnlag.fødselsnummer}
                        />
                    }
                />
            ) : null}
            {barnepass && barnepass.årsakBarnepass && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Hvorfor trenger barnet pass?"
                    verdi={ÅrsakBarnepassTilTekst[barnepass.årsakBarnepass]}
                />
            )}
        </BarneInfoWrapper>
    );
};

export default AlderPåBarnInfo;
