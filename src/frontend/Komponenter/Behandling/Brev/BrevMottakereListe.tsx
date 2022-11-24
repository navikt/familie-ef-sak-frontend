import React from 'react';
import { EBrevmottakerRolle, IBrevmottakere } from '../Brevmottakere/typer';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import styled from 'styled-components';
import { IOrganisasjon } from '../Brevmottakere/SøkOrganisasjon';

const Grid = styled.div`
    display: flex;
    gap: 2rem;
`;

const InfoHeader = styled.div`
    display: flex;
    gap: 1rem;
`;

const KompaktButton = styled(Button)`
    padding: 0;
    justify-content: right;

    .navds-button__inner {
        margin: 0;
    }
`;

const finnOrganisasjonsnavn = (
    organisasjoner: IOrganisasjon[],
    organisasjonsnummer: string
): string => {
    return (
        organisasjoner.find(
            (organisasjon) => organisasjon.organisasjonsnummer === organisasjonsnummer
        )?.navn ?? organisasjonsnummer
    );
};

const BrevMottakereListe: React.FC<{
    mottakere: IBrevmottakere;
    kanEndreBrevmottakere: boolean;
    organisasjoner: IOrganisasjon[];
    settVisBrevmottakereModal: (verdi: boolean) => void;
}> = ({ mottakere, kanEndreBrevmottakere, settVisBrevmottakereModal, organisasjoner }) => {
    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) =>
                    `${finnOrganisasjonsnavn(
                        organisasjoner,
                        org.organisasjonsnummer
                    )} (${org.mottakerRolle.toLowerCase()})`
            ),
        ];
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        (person) => person.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                {kanEndreBrevmottakere && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <KompaktButton
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </KompaktButton>
                    </Tooltip>
                )}
            </InfoHeader>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <Grid>
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {kanEndreBrevmottakere && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <KompaktButton
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </KompaktButton>
                </Tooltip>
            )}
        </Grid>
    );
};

export default BrevMottakereListe;
