import React, { FC, useState } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    EIkkeOppgittAnnenForelderÅrsak,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IAleneomsorgSøknadsgrunnlag,
    IAnnenForelderAleneomsorg,
    ikkeOppgittAnnenForelderÅrsakTilTekst,
} from './typer';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { hentAnnenForelderInfo } from './utils';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
    padding: 4rem;
`;

interface Props {
    søknadsgrunnlag: IAleneomsorgSøknadsgrunnlag;
    forelderRegister?: IAnnenForelderAleneomsorg;
}

const AnnenForelder: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const [statusModal, settModal] = useState<boolean>(false);
    const annenForelderInfo = hentAnnenForelderInfo();
    const forelderSøknad = søknadsgrunnlag.forelder;
    return (
        <>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            {annenForelderInfo !==
            ikkeOppgittAnnenForelderÅrsakTilTekst[EIkkeOppgittAnnenForelderÅrsak.annet] ? (
                <Normaltekst>{annenForelderInfo}</Normaltekst>
            ) : (
                <>
                    <Knapp onClick={() => settModal(true)}>{annenForelderInfo}</Knapp>
                    <StyledModal
                        contentLabel={'Begrunnelse for ikke oppgitt annen forelder'}
                        onRequestClose={() => settModal(false)}
                        isOpen={statusModal}
                    >
                        <Normaltekst>
                            {søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse}
                            bla bla bla
                        </Normaltekst>
                    </StyledModal>
                </>
            )}

            <Registergrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>
                {forelderRegister
                    ? `${forelderRegister.navn}, ${forelderRegister.fødselsnummer}`
                    : '-'}
            </Normaltekst>

            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land}
            </Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>{forelderRegister?.bosattINorge ? 'Norge' : '-'}</Normaltekst>

            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skriftlig avtale om delt fast bosted</Normaltekst>
                    <BooleanTekst value={søknadsgrunnlag.spørsmålAvtaleOmDeltBosted} />
                </>
            )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelders samvær</Normaltekst>
                    <Normaltekst>
                        {harSamværMedBarnTilTekst[søknadsgrunnlag.skalAnnenForelderHaSamvær]}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skriftlig samværsavtale</Normaltekst>
                    <Normaltekst>
                        {
                            harSkriftligSamværsavtaleTilTekst[
                                søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær
                            ]
                        }
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.hvordanPraktiseresSamværet && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Praktisering av samværet</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.hvordanPraktiseresSamværet}</Normaltekst>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHus && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldre har nære boforhold</Normaltekst>
                    <Normaltekst>
                        {
                            borAnnenForelderISammeHusTilTekst[
                                søknadsgrunnlag.borAnnenForelderISammeHus
                            ]
                        }
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Bo begrunnelse</Normaltekst>
                    <Normaltekst>
                        {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.harDereTidligereBoddSammen && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldre har bodd sammen</Normaltekst>
                    <BooleanTekst value={søknadsgrunnlag.harDereTidligereBoddSammen} />
                </>
            )}
            {søknadsgrunnlag.nårFlyttetDereFraHverandre && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Fraflyttingsdato</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.nårFlyttetDereFraHverandre}</Normaltekst>
                </>
            )}
            {søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldres kontakt</Normaltekst>
                    <Normaltekst>
                        {hvorMyeSammenTilTekst[søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder]}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.beskrivSamværUtenBarn && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Kontakt begrunnelse</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.beskrivSamværUtenBarn}</Normaltekst>
                </>
            )}
        </>
    );
};

export default AnnenForelder;
