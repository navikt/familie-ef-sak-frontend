import React, { FC, Dispatch, SetStateAction, useState } from 'react';
import { CheckboxGroup, Checkbox, BodyShort, Textarea, ReadMore } from '@navikt/ds-react';
import styled from 'styled-components';
import { dagensDatoFormatert, formaterIsoDato } from '../../../App/utils/formatter';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const vurderHenvendelseOppgaveTilTekst: Record<VurderHenvendelseOppgavetype, string> = {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD: 'Beskjed om at vi har fått søknad',
    INNSTILLING_VEDRØRENDE_UTDANNING: 'Forespørsel om innstilling - utdanning',
};
enum VurderHenvendelseOppgavetype {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD = 'INFORMERE_OM_SØKT_OVERGANGSSTØNAD',
    INNSTILLING_VEDRØRENDE_UTDANNING = 'INNSTILLING_VEDRØRENDE_UTDANNING',
}

export type SendtOppgave = {
    vurderHenvendelseOppgave: VurderHenvendelseOppgavetype;
    datoOpprettet: string;
};

type Props = {
    aktuelleOppgaver: VurderHenvendelseOppgavetype[];
    sendteOppgaver: SendtOppgave[];
    settOppgaverMotLokalkontor: Dispatch<SetStateAction<VurderHenvendelseOppgavetype[]>>;
    oppgaverMotLokalkontor: VurderHenvendelseOppgavetype[];
    erBehandlingPåVent: boolean;
    settInnstillingsoppgaveBeskrivelse: Dispatch<SetStateAction<string>>;
    innstillingsoppgaveBeskrivelse: string;
};

const ReadMoreWrapper = styled(ReadMore)`
    max-width: 45rem;
    margin-top
`;

export const LokalkontorOppgavevalg: FC<Props> = ({
    aktuelleOppgaver,
    sendteOppgaver,
    settOppgaverMotLokalkontor,
    oppgaverMotLokalkontor,
    erBehandlingPåVent,
    settInnstillingsoppgaveBeskrivelse,
    innstillingsoppgaveBeskrivelse,
}) => {
    const tidligereSendteLokalkontorOppgaver = sendteOppgaver.map((oppgave) => {
        return oppgave.vurderHenvendelseOppgave;
    });

    const [checkedOppgaver, settCheckedOppgaver] = useState([
        ...tidligereSendteLokalkontorOppgaver,
        ...oppgaverMotLokalkontor,
    ]);
    const erSendt = (oppgave: VurderHenvendelseOppgavetype): boolean =>
        tidligereSendteLokalkontorOppgaver.includes(oppgave);
    const erValgt = (oppgave: VurderHenvendelseOppgavetype): boolean => {
        return oppgaverMotLokalkontor.includes(oppgave);
    };
    const erInstillingVedrørendeUtdanning = (oppgave: VurderHenvendelseOppgavetype): boolean => {
        return oppgave === VurderHenvendelseOppgavetype.INNSTILLING_VEDRØRENDE_UTDANNING;
    };
    const skalViseTekstfeltForBeskjedTilLokalkontor = (
        oppgave: VurderHenvendelseOppgavetype
    ): boolean => {
        return (
            !erSendt(oppgave) &&
            erInstillingVedrørendeUtdanning(oppgave) &&
            erValgt(VurderHenvendelseOppgavetype.INNSTILLING_VEDRØRENDE_UTDANNING) &&
            !erBehandlingPåVent
        );
    };

    const lagOppgaveSendtTekst = (oppgave: VurderHenvendelseOppgavetype): string | undefined => {
        const matchedOppgavestatus = sendteOppgaver.find(
            (status) => status.vurderHenvendelseOppgave === oppgave
        );

        if (erValgt(oppgave) && erBehandlingPåVent) {
            return '(Oppgave sendt ' + dagensDatoFormatert() + ')';
        }
        return matchedOppgavestatus?.datoOpprettet
            ? ' (Oppgave sendt ' + formaterIsoDato(matchedOppgavestatus?.datoOpprettet) + ')'
            : undefined;
    };

    const filtrerTidligereSendteOppgaver = (
        oppgaver: VurderHenvendelseOppgavetype[]
    ): VurderHenvendelseOppgavetype[] => {
        return oppgaver.filter((oppgave) => !tidligereSendteLokalkontorOppgaver.includes(oppgave));
    };

    return (
        <>
            <CheckboxGroup
                legend="Send oppgave til lokalkontoret"
                onChange={(oppgaver) => {
                    settOppgaverMotLokalkontor(filtrerTidligereSendteOppgaver(oppgaver));
                    settCheckedOppgaver(oppgaver);
                }}
                size="small"
                value={checkedOppgaver}
            >
                {aktuelleOppgaver.map((oppgave) => (
                    <>
                        <FlexBox key={oppgave}>
                            <Checkbox
                                disabled={erSendt(oppgave) || erBehandlingPåVent}
                                key={oppgave}
                                value={oppgave}
                            >
                                {vurderHenvendelseOppgaveTilTekst[oppgave]}
                            </Checkbox>
                            <BodyShort size={'small'}>{lagOppgaveSendtTekst(oppgave)}</BodyShort>
                        </FlexBox>
                        {skalViseTekstfeltForBeskjedTilLokalkontor(oppgave) && (
                            <ReadMoreWrapper header="Legg til beskjed">
                                <BodyShortSmall>
                                    Hvis det er behov for å legge til en beskjed til lokalkontoret,
                                    vil dette vises i tillegg til den faste teksten som automatisk
                                    kommer inn i oppgaven.
                                </BodyShortSmall>
                                <Textarea
                                    label={''}
                                    size={'small'}
                                    maxLength={200}
                                    value={innstillingsoppgaveBeskrivelse}
                                    onChange={(e) =>
                                        settInnstillingsoppgaveBeskrivelse(e.target.value)
                                    }
                                />
                            </ReadMoreWrapper>
                        )}
                    </>
                ))}
            </CheckboxGroup>
        </>
    );
};
