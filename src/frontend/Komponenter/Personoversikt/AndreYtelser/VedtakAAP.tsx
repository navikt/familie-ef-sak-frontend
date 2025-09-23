import React from 'react';
import { VedtakArbeidsavklaringspenger } from '../../../App/typer/andreYtelser';
import { BodyShort, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { AAPIkon } from '../../../Felles/Ikoner/AAPIkon';

interface Props {
    vedtak: VedtakArbeidsavklaringspenger[];
}

export const VedtakAAP: React.FC<Props> = ({ vedtak }) => {
    const vedtakNyesteFørst = [...vedtak].sort(
        (first, second) => Date.parse(second.vedtaksdato) - Date.parse(first.vedtaksdato)
    );

    return (
        <VStack gap="4" style={{ marginLeft: '1rem' }}>
            <ExpansionCard
                aria-label="Vedtak om arbeidsavklaringspenger med vedtaksdato "
                defaultOpen
            >
                <ExpansionCard.Header>
                    <HStack wrap={false} gap="space-16" align="center">
                        <AAPIkon />
                        <VStack>
                            <ExpansionCard.Title>
                                Vedtak om arbeidsavklaringspenger
                            </ExpansionCard.Title>
                            <ExpansionCard.Description>
                                Dagsats med barnetillegg
                            </ExpansionCard.Description>
                        </VStack>
                    </HStack>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <VStack gap="1">
                        {vedtakNyesteFørst.map((arbeidsavklaringspenger, index) => {
                            const fomDato = formaterIsoDato(
                                arbeidsavklaringspenger.periode.fraOgMedDato
                            );
                            const tomDato = formaterIsoDato(
                                arbeidsavklaringspenger.periode.tilOgMedDato
                            );
                            const fomTomDatoStreng = `${fomDato} - ${tomDato}`;

                            const dagsatsMedBarnetillegg =
                                arbeidsavklaringspenger.dagsats +
                                arbeidsavklaringspenger.barnetillegg;

                            return (
                                <HStack justify="space-around" key={index}>
                                    <BodyShort>{fomTomDatoStreng}</BodyShort>
                                    <BodyShort>{dagsatsMedBarnetillegg} kr</BodyShort>
                                </HStack>
                            );
                        })}
                    </VStack>
                </ExpansionCard.Content>
            </ExpansionCard>
        </VStack>
    );
};
