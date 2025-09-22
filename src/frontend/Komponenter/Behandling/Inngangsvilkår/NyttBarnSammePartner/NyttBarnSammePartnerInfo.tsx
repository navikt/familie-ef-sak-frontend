import React, { FC } from 'react';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import SøknadgrunnlagTerminbarn from './SøknadsgrunnlagTerminbarn';
import TidligereVedtaksperioderSøkerOgAndreForeldre from './TidligereVedtaksperioderSøkerOgAndreForeldre';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { UnderseksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IPersonalia } from '../vilkår';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { ChildHairEyesIcon, DatabaseIcon, FileTextIcon } from '@navikt/aksel-icons';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { utledNavnOgAlder } from '../utils';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';

interface Props {
    personalia: IPersonalia;
    barnMedSamvær: IBarnMedSamvær[];
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const NyttBarnSammePartnerInfo: FC<Props> = ({
    personalia,
    barnMedSamvær,
    tidligereVedtaksperioder,
}) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);

    const barnFraRegisterMedFødselsdato = barnMedSamvær.filter(
        (b) => b.registergrunnlag.fødselsdato
    );

    return (
        <InformasjonContainer>
            <TidligereVedtaksperioderSøkerOgAndreForeldre
                personalia={personalia}
                tidligereVedtaksperioder={tidligereVedtaksperioder}
                registergrunnlagNyttBarn={registergrunnlagNyttBarn}
            />
            <UnderseksjonWrapper underoverskrift="Brukers barn registrert i folkeregisteret">
                {barnFraRegisterMedFødselsdato.map((barn, i) => {
                    const { registergrunnlag: barnRegistergrunnlag } = barn;

                    const { fødselsdato, navn, dødsdato } = barnRegistergrunnlag;

                    const harAnnenForelderIRegister = !!barnRegistergrunnlag.forelder;
                    const harAnnenForelderISøknad = !!barn.søknadsgrunnlag.forelder;
                    const erKopiertFraAnnetBarn =
                        !!barn.søknadsgrunnlag.forelder?.erKopiertFraAnnetBarn;

                    const erFraSøknad =
                        (harAnnenForelderISøknad && !harAnnenForelderIRegister) ||
                        erKopiertFraAnnetBarn;

                    return (
                        <div key={i}>
                            <div>
                                <HStack gap={'space-12'} align={'center'}>
                                    <ChildHairEyesIcon title="barn" fontSize="1.3rem" />
                                    <Heading size="xsmall">
                                        {utledNavnOgAlder(navn, fødselsdato)}
                                        {dødsdato && <EtikettDød dødsdato={dødsdato} />}
                                    </Heading>
                                </HStack>
                            </div>

                            {barnRegistergrunnlag.fødselsnummer && (
                                <HStack>
                                    <VStack
                                        style={{
                                            minWidth: '18rem',
                                        }}
                                    >
                                        <HStack gap={'space-12'}>
                                            <DatabaseIcon
                                                title="finnes i register"
                                                fontSize="1.3rem"
                                            />
                                            <BodyShortSmall>Fødsels eller D-Nummer</BodyShortSmall>
                                        </HStack>
                                    </VStack>

                                    <VStack>
                                        {barnRegistergrunnlag.fødselsnummer && (
                                            <KopierbartNullableFødselsnummer
                                                fødselsnummer={barnRegistergrunnlag.fødselsnummer}
                                            />
                                        )}
                                    </VStack>
                                </HStack>
                            )}

                            {!erFraSøknad && barn.registergrunnlag.forelder?.fødselsdato && (
                                <>
                                    <HStack>
                                        <VStack
                                            style={{
                                                minWidth: '18rem',
                                            }}
                                        >
                                            <HStack gap={'space-12'} align={'center'}>
                                                <DatabaseIcon
                                                    title="finnes i register"
                                                    fontSize="1.3rem"
                                                />
                                                <BodyShortSmall>
                                                    Annen forelder fra folkeregister
                                                </BodyShortSmall>
                                            </HStack>
                                        </VStack>

                                        <VStack>
                                            {barnRegistergrunnlag.forelder && (
                                                <AnnenForelderNavnOgFnr
                                                    forelder={barnRegistergrunnlag.forelder}
                                                    skalViseDato={false}
                                                />
                                            )}
                                        </VStack>
                                    </HStack>

                                    {barnRegistergrunnlag.forelder?.dødsfall && (
                                        <HStack>
                                            <VStack
                                                style={{
                                                    minWidth: '18rem',
                                                }}
                                            >
                                                <HStack gap={'space-12'} align={'center'}>
                                                    <DatabaseIcon
                                                        title="finnes i register"
                                                        fontSize="1.3rem"
                                                    />
                                                    <BodyShortSmall>
                                                        Annen forelders dødsdato
                                                    </BodyShortSmall>
                                                </HStack>
                                            </VStack>

                                            <VStack>
                                                {barnRegistergrunnlag.forelder?.dødsfall && (
                                                    <BodyShortSmall>
                                                        {barnRegistergrunnlag.forelder.dødsfall}
                                                    </BodyShortSmall>
                                                )}
                                            </VStack>
                                        </HStack>
                                    )}
                                </>
                            )}

                            {erFraSøknad && (
                                <HStack>
                                    <VStack
                                        style={{
                                            minWidth: '18rem',
                                        }}
                                    >
                                        <HStack gap={'space-12'} align={'center'}>
                                            <FileTextIcon
                                                title="lagt til i søknad"
                                                fontSize="1.3rem"
                                            />
                                            <BodyShortSmall>
                                                Annen forelder lagt til i søknad
                                            </BodyShortSmall>
                                        </HStack>
                                    </VStack>

                                    <VStack>
                                        {barn.søknadsgrunnlag.forelder && (
                                            <AnnenForelderNavnOgFnr
                                                forelder={barn.søknadsgrunnlag.forelder}
                                                søknadsgrunnlag={barn.søknadsgrunnlag}
                                            />
                                        )}
                                    </VStack>
                                </HStack>
                            )}
                        </div>
                    );
                })}
            </UnderseksjonWrapper>

            <UnderseksjonWrapper underoverskrift="Brukers fremtidige barn lagt til i søknad">
                {søknadsgrunnlagNyttBarn.length ? (
                    søknadsgrunnlagNyttBarn.map((barn) => (
                        <SøknadgrunnlagTerminbarn key={barn.barnId} barn={barn} />
                    ))
                ) : (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i søknad</i>
                    </BodyShortSmall>
                )}
            </UnderseksjonWrapper>
        </InformasjonContainer>
    );
};
export default NyttBarnSammePartnerInfo;
