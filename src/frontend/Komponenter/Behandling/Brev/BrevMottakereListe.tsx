import React from 'react';
import { EBrevmottakerRolle, IBrevmottakere } from '../Brevmottakere/typer';
import { Alert, BodyShort, Button, HStack, Label, Tooltip } from '@navikt/ds-react';

const BrevMottakereListe: React.FC<{
    mottakere: IBrevmottakere;
    kanEndreBrevmottakere: boolean;
    settVisBrevmottakereModal: (verdi: boolean) => void;
}> = ({ mottakere, kanEndreBrevmottakere, settVisBrevmottakereModal }) => {
    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) => `${org.navnHosOrganisasjon} (org.nr.: ${org.organisasjonsnummer})`
            ),
        ];
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        (person) => person.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'} size="small">
            <HStack gap="4">
                <Label>Brevmottakere: </Label>
                {kanEndreBrevmottakere && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <Button
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                            style={{ padding: 0 }}
                        >
                            Legg til/endre brevmottakere
                        </Button>
                    </Tooltip>
                )}
            </HStack>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <HStack gap="4">
            <Label>Brevmottaker: </Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {kanEndreBrevmottakere && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <Button
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                        style={{ padding: 0 }}
                    >
                        Legg til/endre brevmottakere
                    </Button>
                </Tooltip>
            )}
        </HStack>
    );
};

export default BrevMottakereListe;
