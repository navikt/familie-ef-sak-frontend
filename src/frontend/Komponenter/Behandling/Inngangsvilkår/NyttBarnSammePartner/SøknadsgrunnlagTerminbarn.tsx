import React, { FC } from 'react';
import { SøknadsgrunnlagNyttBarn } from './typer';
import { mapBarnNavnTekst } from './utils';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { Heading, HStack } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { ChildHairEyesIcon, FileTextIcon } from '@navikt/aksel-icons';

interface Props {
    barn: SøknadsgrunnlagNyttBarn;
}

const SøknadgrunnlagTerminbarn: FC<Props> = ({ barn }) => {
    const annenForelder = barn.annenForelderSoknad;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <div>
            <HStack gap={'space-12'} align={'center'}>
                <ChildHairEyesIcon title="barn" fontSize="1.3rem" />

                <Heading size="xsmall">{mapBarnNavnTekst(barn)}</Heading>
            </HStack>

            <HStack>
                <HStack
                    gap={'space-12'}
                    align={'center'}
                    style={{
                        minWidth: '18rem',
                    }}
                >
                    <FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />
                    <BodyShortSmall>Termindato</BodyShortSmall>
                </HStack>

                <BodyShortSmall>{formaterNullableIsoDato(barn.fødselTermindato)}</BodyShortSmall>
            </HStack>

            {annenForelder && (
                <HStack>
                    <HStack
                        gap={'space-12'}
                        align={'center'}
                        style={{
                            minWidth: '18rem',
                        }}
                    >
                        <FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />
                        <BodyShortSmall>Annen forelder lagt til i søknad</BodyShortSmall>
                    </HStack>
                    <AnnenForelderNavnOgFnr forelder={annenForelder} />
                </HStack>
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <HStack>
                    <HStack
                        gap={'space-12'}
                        align={'center'}
                        style={{
                            minWidth: '18rem',
                        }}
                    >
                        <FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />
                        <BodyShortSmall>Annen forelder</BodyShortSmall>
                    </HStack>
                    <BodyShortSmall>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </BodyShortSmall>
                </HStack>
            )}
        </div>
    );
};

export default SøknadgrunnlagTerminbarn;
