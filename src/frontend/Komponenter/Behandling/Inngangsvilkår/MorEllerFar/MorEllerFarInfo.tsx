import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { IDokumentasjonGrunnlag } from '../vilkår';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';

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
                                <Element>
                                    {registergrunnlag.navn ?? søknadsgrunnlag.navn ?? 'Ikke født'}
                                    {registergrunnlag.dødsdato && (
                                        <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                                    )}
                                </Element>
                            </>
                            {registergrunnlag.fødselsnummer ? (
                                <>
                                    <Registergrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                </>
                            ) : (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>Termindato</Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                                    </Normaltekst>
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
