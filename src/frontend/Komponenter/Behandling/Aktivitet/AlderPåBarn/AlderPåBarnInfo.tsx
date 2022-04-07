import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { ÅrsakBarnepassTilTekst } from './AlderPåBarnTyper';
import { nullableDatoTilAlder } from '../../../../App/utils/dato';

const AlderPåBarnInfo: FC<{ gjeldendeBarn: IBarnMedSamvær; skalViseSøknadsdata?: boolean }> = ({
    gjeldendeBarn,
}) => {
    const { registergrunnlag, barnepass } = gjeldendeBarn;

    const alder = nullableDatoTilAlder(registergrunnlag.fødselsdato);

    return (
        <>
            <GridTabell kolonner={3}>
                {registergrunnlag.navn ? (
                    <>
                        <Registergrunnlag />
                        <Element>
                            {registergrunnlag.navn} ({alder} år)
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
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
                ) : null}
                {barnepass && barnepass.årsakBarnepass ? (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Hvorfor trenger barnet pass?</Normaltekst>
                        <Element>{ÅrsakBarnepassTilTekst[barnepass.årsakBarnepass]}</Element>
                    </>
                ) : null}
            </GridTabell>
        </>
    );
};

export default AlderPåBarnInfo;
