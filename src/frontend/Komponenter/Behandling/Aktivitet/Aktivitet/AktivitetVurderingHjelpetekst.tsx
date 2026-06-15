import React from 'react';
import { BodyShort, List, VStack } from '@navikt/ds-react';

const HJELPETEKSTER_AKTIVITET: {
    id: string;
    ingress: string;
    punkter: string[];
}[] = [
    {
        id: 'nye-regler',
        ingress: 'Når du skal behandle saken etter nye regler, skal du vurdere om',
        punkter: [
            'bruker har barn under 14 måneder',
            'bruker fyller vilkårene for stønad på grunn av særlig tilsynskrevende barn, eller vilkårene for å forlenge stønadsperioden på grunn av forbigående sykdom hos barnet, dersom barnet er over 14 måneder',
        ],
    },
    {
        id: 'gamle-regler',
        ingress:
            'Når du skal behandle saken etter gamle regler(overgangsregler), skal du vurdere om',
        punkter: [
            'bruker etter 1. juli 2026 har hatt et opphold i stønadsperioden på mer enn 12 måneder',
            'bruker har barn under 1 år, eller om aktivitetsplikten eller unntak fra aktivitetsplikten er oppfylt, dersom bruker søker om stønad i hovedperioden',
            'vilkårene for utvidet eller forlenget stønad er oppfylt, og eventuelt på hvilket grunnlag, dersom bruker søker om stønad utover hovedperioden',
        ],
    },
];

export const AktivitetVurderingHjelpetekst = () => {
    return (
        <VStack gap="space-24">
            {HJELPETEKSTER_AKTIVITET.map((seksjon) => (
                <div key={seksjon.id}>
                    <BodyShort weight="semibold">{seksjon.ingress}</BodyShort>
                    <List as="ul">
                        {seksjon.punkter.map((punkt, indeks) => (
                            <List.Item key={`${seksjon.id}-${indeks}`}>{punkt}</List.Item>
                        ))}
                    </List>
                </div>
            ))}
        </VStack>
    );
};
