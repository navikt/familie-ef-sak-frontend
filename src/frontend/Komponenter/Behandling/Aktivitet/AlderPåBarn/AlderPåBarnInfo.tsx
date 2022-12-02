import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { ÅrsakBarnepassTilTekst } from './AlderPåBarnTyper';
import { nullableDatoTilAlder } from '../../../../App/utils/dato';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';

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
                        <SmallTextLabel>
                            {registergrunnlag.navn} ({alder} år)
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
                        </SmallTextLabel>
                    </>
                ) : null}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <BodyShortSmall>Fødsels eller D-nummer</BodyShortSmall>
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    </>
                ) : null}
                {barnepass && barnepass.årsakBarnepass ? (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Hvorfor trenger barnet pass?</BodyShortSmall>
                        <SmallTextLabel>
                            {ÅrsakBarnepassTilTekst[barnepass.årsakBarnepass]}
                        </SmallTextLabel>
                    </>
                ) : null}
            </GridTabell>
        </>
    );
};

export default AlderPåBarnInfo;
