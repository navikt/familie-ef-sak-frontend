import React, { FC } from 'react';
import { CheckboxGroup, Checkbox, BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { formaterIsoDato } from '../../../App/utils/formatter';

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export type Oppgavestatus = {
    vurderHenvendelsOppgave: string;
    datoOpprettet: string;
};

type Props = {
    aktuelleOppgaver: VurderHenvendelseOppgavetype[];
    oppgavestatus: Ressurs<Oppgavestatus[]>;
    settOppgaverMotLokalkontor: (oppgaverMotLokalkontor: VurderHenvendelseOppgavetype[]) => void;
    oppgaverMotLokalkontor: VurderHenvendelseOppgavetype[];
    erBehandlingPåVent: boolean;
};

export const LokalkontorOppgavevalg: FC<Props> = ({
    aktuelleOppgaver,
    oppgavestatus,
    settOppgaverMotLokalkontor,
    oppgaverMotLokalkontor,
    erBehandlingPåVent,
}) => {
    const lagOppgaveSendtTekst = (oppgave: VurderHenvendelseOppgavetype): string | undefined => {
        if (oppgavestatus.status !== RessursStatus.SUKSESS) {
            return undefined;
        }

        const matchedOppgaveStatus = oppgavestatus.data.find(
            (status) => status.vurderHenvendelsOppgave === oppgave
        );

        if (erValgt(oppgave) && erBehandlingPåVent) {
            return '(Oppgave er sendt)';
        }
        return matchedOppgaveStatus?.datoOpprettet
            ? ' (Oppgave sendt ' + formaterIsoDato(matchedOppgaveStatus?.datoOpprettet) + ')'
            : undefined;
    };
    const erSendt = (oppgave: VurderHenvendelseOppgavetype): boolean => {
        if (oppgavestatus.status === RessursStatus.SUKSESS) {
            return oppgavestatus.data.some((status) => status.vurderHenvendelsOppgave === oppgave);
        }
        return false;
    };
    const erValgt = (oppgave: VurderHenvendelseOppgavetype): boolean => {
        return oppgaverMotLokalkontor.some(
            (oppgaveMotLokalkontor) => oppgaveMotLokalkontor === oppgave
        );
    };

    return (
        <div>
            <CheckboxGroup
                legend="Send oppgave til lokalkontoret"
                onChange={settOppgaverMotLokalkontor}
                size="small"
            >
                {aktuelleOppgaver.map((oppgave) => (
                    <FlexBox>
                        <Checkbox
                            disabled={erSendt(oppgave) || erBehandlingPåVent}
                            key={oppgave}
                            value={oppgave}
                            defaultChecked={erValgt(oppgave) || erSendt(oppgave)}
                        >
                            {vurderHenvendelseOppgaveTilTekst[oppgave]}
                        </Checkbox>
                        <BodyShort size={'small'}>{lagOppgaveSendtTekst(oppgave)}</BodyShort>
                    </FlexBox>
                ))}
            </CheckboxGroup>
        </div>
    );
};

const vurderHenvendelseOppgaveTilTekst: Record<VurderHenvendelseOppgavetype, string> = {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD: 'Beskjed om at vi har fått søknad',
    INNSTILLING_VEDRØRENDE_UTDANNING: 'Forespørsel om innstilling - utdanning',
};
export enum VurderHenvendelseOppgavetype {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD = 'INFORMERE_OM_SØKT_OVERGANGSSTØNAD',
    INNSTILLING_VEDRØRENDE_UTDANNING = 'INNSTILLING_VEDRØRENDE_UTDANNING',
}
