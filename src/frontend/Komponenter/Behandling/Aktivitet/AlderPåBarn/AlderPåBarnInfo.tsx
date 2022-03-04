import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { differenceInYears } from 'date-fns';

const AlderPåBarnInfo: FC<{ gjeldendeBarn: IBarnMedSamvær; skalViseSøknadsdata?: boolean }> = ({
    gjeldendeBarn,
    skalViseSøknadsdata,
}) => {
    const { registergrunnlag, søknadsgrunnlag } = gjeldendeBarn;

    const alder = differenceInYears(new Date(), new Date(registergrunnlag.fødselsdato));

    return (
        <>
            <GridTabell kolonner={3}>
                {registergrunnlag.navn ? (
                    <>
                        <Registergrunnlag />
                        <Element>
                            {registergrunnlag.navn}
                            (Alder: {alder}år)
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
                        </Element>
                    </>
                ) : skalViseSøknadsdata ? (
                    <>
                        <Søknadsgrunnlag />
                        <Element>Barnets navn</Element>
                        <Element>
                            {søknadsgrunnlag.navn && søknadsgrunnlag.navn !== ''
                                ? 'Ikke utfylt'
                                : 'Ikke født'}
                        </Element>
                    </>
                ) : null}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    </>
                ) : skalViseSøknadsdata ? (
                    søknadsgrunnlag.fødselTermindato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Termindato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                            </Normaltekst>
                        </>
                    )
                ) : null}
            </GridTabell>
        </>
    );
};

export default AlderPåBarnInfo;
