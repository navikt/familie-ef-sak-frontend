import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { Label } from '@navikt/ds-react';
import { utledNavnOgAlder } from '../utils';
import { FlexColumnContainer, UnderoverskriftWrapper } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';

interface Props {
    barn: RegistergrunnlagNyttBarn;
}

const RegistergrunnlagNyttBarnInnhold: FC<Props> = ({ barn }) => {
    const { annenForelderRegister, fødselsdato, navn, dødsdato } = barn;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;
    return (
        <FlexColumnContainer>
            <UnderoverskriftWrapper>
                <LiteBarn />
                <Label size={'small'} as={'div'}>
                    {utledNavnOgAlder(navn, fødselsdato, dødsdato)}
                    {barn.dødsdato && <EtikettDød dødsdato={barn.dødsdato} />}
                </Label>
            </UnderoverskriftWrapper>
            <Informasjonsrad
                ikon={TabellIkon.REGISTER}
                label="Fødsels eller D-nummer"
                verdi={
                    barn.fødselsnummer && (
                        <KopierbartNullableFødselsnummer fødselsnummer={barn.fødselsnummer} />
                    )
                }
            />
            {annenForelderRegister && (
                <Informasjonsrad
                    ikon={TabellIkon.REGISTER}
                    label="Annen forelder fra folkeregister"
                    verdi={<AnnenForelderNavnOgFnr forelder={annenForelderRegister} />}
                />
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Annen forelder"
                    verdi={
                        ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`
                    }
                />
            )}

            {barn.annenForelderRegister?.dødsfall && (
                <Informasjonsrad
                    ikon={TabellIkon.REGISTER}
                    label="Annen forelder dødsdato"
                    verdi={formaterNullableIsoDato('2021-01-01')}
                />
            )}
        </FlexColumnContainer>
    );
};

export default RegistergrunnlagNyttBarnInnhold;
