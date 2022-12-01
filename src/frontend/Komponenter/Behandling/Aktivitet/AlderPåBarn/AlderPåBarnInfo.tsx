import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { ÅrsakBarnepassTilTekst } from './AlderPåBarnTyper';
import { nullableDatoTilAlder } from '../../../../App/utils/dato';
import { BodyShortSmall, LabelSmallAsText } from '../../../../Felles/Visningskomponenter/Tekster';

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
                        <LabelSmallAsText>
                            {registergrunnlag.navn} ({alder} år)
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
                        </LabelSmallAsText>
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
                        <LabelSmallAsText>
                            {ÅrsakBarnepassTilTekst[barnepass.årsakBarnepass]}
                        </LabelSmallAsText>
                    </>
                ) : null}
            </GridTabell>
        </>
    );
};

export default AlderPåBarnInfo;
