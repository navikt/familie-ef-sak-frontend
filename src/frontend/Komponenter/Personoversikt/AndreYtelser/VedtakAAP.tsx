import React from 'react';
import { VedtakArbeidsavklaringspenger } from '../../../App/typer/andreYtelser';
import { BodyShort, Box, ExpansionCard, Heading, HStack, VStack } from '@navikt/ds-react';
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
        <div>
            <Heading size="small" level="2" spacing>
                Vedtak Arbeidsavklaringspenger
            </Heading>
            <VStack gap="4" style={{ marginLeft: '1rem' }}>
                {vedtakNyesteFørst.map((arbeidsavklaringspenger, index) => {
                    const vedtaksdato = formaterIsoDato(arbeidsavklaringspenger.vedtaksdato);

                    const fomDato = formaterIsoDato(arbeidsavklaringspenger.periode.fraOgMedDato);
                    const tomDato = formaterIsoDato(arbeidsavklaringspenger.periode.tilOgMedDato);
                    const fomTomDatoStreng = `${fomDato} - ${tomDato}`;

                    const dagsatsMedBarnetillegg =
                        arbeidsavklaringspenger.dagsats + arbeidsavklaringspenger.barnetillegg;

                    return (
                        <ExpansionCard
                            key={index}
                            aria-label="Vedtak om arbeidsavklaringspenger med vedtaksdato "
                            defaultOpen={index === 0}
                        >
                            <ExpansionCard.Header>
                                <HStack wrap={false} gap="space-16" align="center">
                                    <AAPIkon />
                                    <VStack>
                                        <ExpansionCard.Title>{vedtaksdato}</ExpansionCard.Title>
                                        <ExpansionCard.Description>
                                            {fomTomDatoStreng}
                                        </ExpansionCard.Description>
                                    </VStack>
                                </HStack>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <Box>
                                    <BodyShort>Dagsats med barnetillegg</BodyShort>
                                    <BodyShort weight="semibold">
                                        {dagsatsMedBarnetillegg}
                                    </BodyShort>
                                </Box>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    );
                })}
            </VStack>
        </div>
    );
};
