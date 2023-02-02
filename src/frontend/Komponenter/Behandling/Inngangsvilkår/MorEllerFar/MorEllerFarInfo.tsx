import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { IDokumentasjonGrunnlag } from '../vilkår';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { Label } from '@navikt/ds-react';
import { utledNavnOgAlderPåGrunnlag } from '../utils';
import { FlexColumnContainer, InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';
import styled from 'styled-components';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const UnderoverskriftWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

const MorEllerFarInfo: FC<Props> = ({ barnMedSamvær, skalViseSøknadsdata, dokumentasjon }) => {
    return (
        <InformasjonContainer>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;

                return (
                    <FlexColumnContainer key={barn.barnId}>
                        <UnderoverskriftWrapper>
                            <LiteBarn />
                            <Label size={'small'} as={'div'}>
                                {utledNavnOgAlderPåGrunnlag(registergrunnlag, søknadsgrunnlag)}
                                {registergrunnlag.dødsdato && (
                                    <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                                )}
                            </Label>
                        </UnderoverskriftWrapper>
                        {registergrunnlag.fødselsnummer ? (
                            <Informasjonsrad
                                label="Fødsels- eller D-nummer"
                                verdi={
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                }
                                verdiSomString={false}
                                ikon={TabellIkon.REGISTER}
                            />
                        ) : (
                            <Informasjonsrad
                                label="Termindato"
                                verdi={
                                    formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato) || ''
                                }
                                ikon={TabellIkon.SØKNAD}
                            />
                        )}
                    </FlexColumnContainer>
                );
            })}
            {skalViseSøknadsdata && (
                <DokumentasjonSendtInn
                    dokumentasjon={dokumentasjon?.terminbekreftelse}
                    tittel={'Terminbekreftelse'}
                />
            )}
        </InformasjonContainer>
    );
};

export default MorEllerFarInfo;
