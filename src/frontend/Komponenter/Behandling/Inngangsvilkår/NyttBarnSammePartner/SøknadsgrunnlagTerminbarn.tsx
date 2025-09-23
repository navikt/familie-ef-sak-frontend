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

export const SøknadgrunnlagTerminbarn: FC<Props> = ({ barn }) => {
    const annenForelder = barn.annenForelderSoknad;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <div>
            <HStack gap={'space-12'} align={'center'}>
                <ChildHairEyesIcon title="barn" fontSize="1.3rem" />

                <Heading size="xsmall">{mapBarnNavnTekst(barn)}</Heading>
            </HStack>

            <InfoRad
                ikon={<FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />}
                tekst={'Termindato'}
            >
                <BodyShortSmall>{formaterNullableIsoDato(barn.fødselTermindato)}</BodyShortSmall>
            </InfoRad>

            {annenForelder && (
                <InfoRad
                    ikon={<FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />}
                    tekst={'Annen forelder lagt til i søknad'}
                >
                    <AnnenForelderNavnOgFnr forelder={annenForelder} />
                </InfoRad>
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <InfoRad
                    ikon={<FileTextIcon title="lagt til i søknad" fontSize="1.3rem" />}
                    tekst={'Annen forelder'}
                >
                    <BodyShortSmall>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </BodyShortSmall>
                </InfoRad>
            )}
        </div>
    );
};

const InfoRad: React.FC<{
    ikon: React.ReactNode;
    tekst: string;
    children: React.ReactNode;
}> = ({ ikon, tekst, children }) => {
    return (
        <HStack>
            <HStack
                gap={'space-12'}
                align={'center'}
                style={{
                    minWidth: '18rem',
                }}
            >
                {ikon}
                <BodyShortSmall>{tekst}</BodyShortSmall>
            </HStack>
            {children}
        </HStack>
    );
};
