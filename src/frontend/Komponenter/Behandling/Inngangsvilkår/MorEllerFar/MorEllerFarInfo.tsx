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
                            {registergrunnlag.navn ? (
                                <>
                                    <LiteBarn />
                                    <Element>
                                        {registergrunnlag.navn}
                                        {registergrunnlag.dødsdato && (
                                            <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                                        )}
                                    </Element>
                                </>
                            ) : skalViseSøknadsdata ? (
                                <>
                                    <LiteBarn />
                                    <Element>
                                        {søknadsgrunnlag.navn ? søknadsgrunnlag.navn : 'Ikke født'}
                                        {registergrunnlag.dødsdato && (
                                            <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                                        )}
                                    </Element>
                                </>
                            ) : null}
                            {registergrunnlag.fødselsnummer ? (
                                <>
                                    <Registergrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                </>
                            ) : skalViseSøknadsdata ? (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>Termindato</Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                                    </Normaltekst>
                                </>
                            ) : null}
                        </GridTabell>
                    </React.Fragment>
                );
            })}
            {skalViseSøknadsdata && (
                <GridTabell underTabellMargin={0}>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.terminbekreftelse}
                        tittel={'Terminbekreftelse'}
                    />
                </GridTabell>
            )}
        </>
    );
};

export default MorEllerFarInfo;
