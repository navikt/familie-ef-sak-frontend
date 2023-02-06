import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { utledNavnOgAlder } from '../utils';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { BarneInfoWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    barn: RegistergrunnlagNyttBarn;
}

const RegistergrunnlagNyttBarnInnhold: FC<Props> = ({ barn }) => {
    const { annenForelderRegister, fødselsdato, navn, dødsdato } = barn;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;
    return (
        <BarneInfoWrapper
            navnOgAlderPåBarn={utledNavnOgAlder(navn, fødselsdato, dødsdato)}
            dødsdato={barn.dødsdato}
        >
            <Informasjonsrad
                ikon={VilkårInfoIkon.REGISTER}
                label="Fødsels eller D-nummer"
                verdi={
                    barn.fødselsnummer && (
                        <KopierbartNullableFødselsnummer fødselsnummer={barn.fødselsnummer} />
                    )
                }
            />
            {annenForelderRegister && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Annen forelder fra folkeregister"
                    verdi={<AnnenForelderNavnOgFnr forelder={annenForelderRegister} />}
                />
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Annen forelder"
                    verdi={
                        ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`
                    }
                />
            )}
        </BarneInfoWrapper>
    );
};

export default RegistergrunnlagNyttBarnInnhold;
