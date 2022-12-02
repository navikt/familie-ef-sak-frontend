import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { IDokumentasjonGrunnlag } from '../vilkår';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { Label } from '@navikt/ds-react';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const MorEllerFarInfo: FC<Props> = ({ barnMedSamvær, skalViseSøknadsdata, dokumentasjon }) => {
    return (
        <>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;

                return (
                    <React.Fragment key={barn.barnId}>
                        <GridTabell>
                            <>
                                <LiteBarn />
                                <Label size={'small'} as={'div'}>
                                    {registergrunnlag.navn ?? søknadsgrunnlag.navn ?? 'Ikke født'}
                                    {registergrunnlag.dødsdato && (
                                        <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                                    )}
                                </Label>
                            </>
                            {registergrunnlag.fødselsnummer ? (
                                <>
                                    <Registergrunnlag />
                                    <BodyShortSmall>Fødsels- eller D-nummer</BodyShortSmall>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                </>
                            ) : (
                                <>
                                    <Søknadsgrunnlag />
                                    <BodyShortSmall>Termindato</BodyShortSmall>
                                    <BodyShortSmall>
                                        {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                                    </BodyShortSmall>
                                </>
                            )}
                        </GridTabell>
                    </React.Fragment>
                );
            })}
            {skalViseSøknadsdata && (
                <DokumentasjonSendtInn
                    dokumentasjon={dokumentasjon?.terminbekreftelse}
                    tittel={'Terminbekreftelse'}
                />
            )}
        </>
    );
};

export default MorEllerFarInfo;
