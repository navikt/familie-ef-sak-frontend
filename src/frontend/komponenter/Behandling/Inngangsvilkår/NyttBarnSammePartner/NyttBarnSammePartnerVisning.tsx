import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import React, { FC } from 'react';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import TabellVisning, { TabellIkon } from '../../TabellVisning';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { RegistergrunnlagNyttBarn } from './typer';
import {
    mapBarnNavnTekst,
    mapForelderTilNavnOgFnr,
    mapIkkeOppgitt,
    mapTilRegistergrunnlagNyttBarn,
    mapTilSøknadsgrunnlagNyttBarn,
} from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';

const TittelWrapper = styled.div`
    padding-bottom: 1rem;
    display: flex;
    margin-left: 0.5rem;
    align-items: center;

    .typo-undertittel {
        margin-right: 1rem;
    }
    .typo-etikett-liten {
        color: ${navFarger.navGra60};
    }
`;

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    vilkårStatus: VilkårStatus;
}

const NyttBarnSammePartnerVisning: FC<Props> = ({ barnMedSamvær, vilkårStatus }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <>
            <FlexDiv>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                <TittelWrapper>
                    <Undertittel>Nytt barn samme partner</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </TittelWrapper>
            </FlexDiv>

            <TabellVisning
                tittel="Brukers barn registrert i folkeregisteret"
                ikon={TabellIkon.REGISTER}
                onEmpty="Ingen barn registrert i folkeregisteret"
                kolonner={[
                    {
                        overskrift: 'Navn',
                        tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                            registergrunnlag.navn,
                    },
                    {
                        overskrift: 'Fødsels/D-nummer',
                        tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                            registergrunnlag.fødselsnummer,
                    },
                    {
                        overskrift: 'Annen forelder register',
                        tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                            mapForelderTilNavnOgFnr(registergrunnlag.annenForelderRegister),
                    },
                    {
                        overskrift: 'Annen forelder søknad',
                        tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                            mapForelderTilNavnOgFnr(registergrunnlag.annenForelderSoknad) ??
                            mapIkkeOppgitt(registergrunnlag.ikkeOppgittAnnenForelderBegrunnelse),
                    },
                ]}
                verdier={registergrunnlagNyttBarn}
            />
            <TabellVisning
                tittel="Brukers nåværende eller fremtidige barn lagt til i søknad"
                ikon={TabellIkon.SØKNAD}
                onEmpty="Ingen barn lagt til i søknad"
                kolonner={[
                    {
                        overskrift: 'Navn',
                        tekstVerdi: (søknadsgrunnlag) => mapBarnNavnTekst(søknadsgrunnlag),
                    },
                    {
                        overskrift: 'Fødsels/D-nummer',
                        tekstVerdi: (søknadsgrunnlag) => søknadsgrunnlag.fødselsnummer,
                    },
                    {
                        overskrift: 'Fødselsdato',
                        tekstVerdi: (søknadsgrunnlag) => søknadsgrunnlag.fødselsnummer,
                    },
                    {
                        overskrift: 'Termindato',
                        tekstVerdi: (søknadsgrunnlag) => søknadsgrunnlag.terminDato,
                    },
                    {
                        overskrift: 'Annen forelder',
                        tekstVerdi: (søknadsgrunnlag) =>
                            mapForelderTilNavnOgFnr(søknadsgrunnlag.annenForelderSoknad) ??
                            mapIkkeOppgitt(søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse),
                    },
                ]}
                verdier={søknadsgrunnlagNyttBarn}
            />
        </>
    );
};
export default NyttBarnSammePartnerVisning;
