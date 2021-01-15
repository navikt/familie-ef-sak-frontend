import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { IInngangsvilkårGrunnlag } from '../vilkår';
import { ESøkerDelerBolig } from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';

interface Props {
    vilkårStatus: VilkårStatus;
    grunnlag: IInngangsvilkårGrunnlag;
}

const SamlivVisning: FC<Props> = ({ grunnlag, vilkårStatus }) => {
    const { sivilstand, bosituasjon, sivilstandsplaner } = grunnlag;
    const { søknadsgrunnlag } = sivilstand;
    const { tidligereSamboer } = søknadsgrunnlag;

    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Samliv</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>
                <Søknadsgrunnlag />
                <Normaltekst>Alene med barn fordi</Normaltekst>
                <Normaltekst>{søknadsgrunnlag.årsakEnslig?.verdi || ''}</Normaltekst>
                {søknadsgrunnlag.samlivsbruddsdato && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Dato for samlivsbrudd</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.samlivsbruddsdato)}
                        </Normaltekst>
                    </>
                )}
                {tidligereSamboer && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Tidligere samboer</Normaltekst>
                        <Normaltekst>
                            {`${tidligereSamboer.navn} - ${
                                tidligereSamboer.ident ||
                                formaterNullableIsoDato(tidligereSamboer.fødselsdato)
                            }`}
                        </Normaltekst>
                    </>
                )}
                {søknadsgrunnlag.fraflytningsdato && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Flyttet fra hverandre</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.fraflytningsdato)}
                        </Normaltekst>
                    </>
                )}
                {søknadsgrunnlag.endringSamværsordningDato && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Endringen skjer/skjedde</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.endringSamværsordningDato)}
                        </Normaltekst>
                    </>
                )}
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Bosituasjon</Normaltekst>
                    <Normaltekst>{bosituasjon.delerDuBolig.verdi || ''}</Normaltekst>

                    {bosituasjon.delerDuBolig.svarId === 'harEkteskapsliknendeForhold' && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Samboers navn</Normaltekst>
                            <Normaltekst>
                                {`${bosituasjon.samboer?.navn} - ${
                                    bosituasjon.samboer?.ident ||
                                    formaterNullableIsoDato(bosituasjon.samboer?.fødselsdato)
                                }`}
                            </Normaltekst>
                            <Søknadsgrunnlag />
                            <Normaltekst>Flyttet sammen</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(bosituasjon.sammenflyttingsdato)}
                            </Normaltekst>
                        </>
                    )}

                    {bosituasjon.delerDuBolig.svarId ===
                        'tidligereSamboerFortsattRegistrertPåAdresse' && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Tidligere samboer</Normaltekst>
                            <Normaltekst>{tidligereSamboer?.navn || ''}</Normaltekst>
                        </>
                    )}

                    {[
                        ESøkerDelerBolig.borAleneMedBarnEllerGravid,
                        ESøkerDelerBolig.delerBoligMedAndreVoksne,
                        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
                    ].includes(bosituasjon.delerDuBolig.svarId) && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Skal gifte seg eller bli samboer</Normaltekst>
                            <BooleanTekst value={!!sivilstandsplaner.harPlaner} />
                            <Søknadsgrunnlag />
                            <Normaltekst>Dato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(sivilstandsplaner.fraDato)}
                            </Normaltekst>
                            <Søknadsgrunnlag />
                            <Normaltekst>Ektefelle eller samboer</Normaltekst>
                            <Normaltekst>{`${sivilstandsplaner.vordendeSamboerEktefelle?.navn} - ${
                                sivilstandsplaner.vordendeSamboerEktefelle?.ident ||
                                formaterNullableIsoDato(
                                    sivilstandsplaner.vordendeSamboerEktefelle?.fødselsdato
                                )
                            }`}</Normaltekst>
                        </>
                    )}
                </>
            </StyledTabell>
        </>
    );
};

export default SamlivVisning;
