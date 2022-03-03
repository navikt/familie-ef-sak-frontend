import React, { useCallback, useEffect, useState } from 'react';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { RessursStatus } from '../../App/typer/ressurs';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Navigate, useNavigate } from 'react-router-dom';
import Infotrygdperioderoversikt from '../Personoversikt/Infotrygdperioderoversikt';
import { useHentSøkPerson } from '../../App/hooks/useSøkPerson';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import Info from '../../Felles/Ikoner/Info';
import { Migreringsstatus } from '../../App/typer/migrering';

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const finnerIkkeFagsakMelding = 'Finner ikke fagsak for søkte personen';

interface OppgaveOgJournalpostId {
    oppgaveId: string;
    journalpostId: string;
}

const SøkEtterPerson: React.FC<OppgaveOgJournalpostId & { personIdent: string }> = ({
    oppgaveId,
    journalpostId,
    personIdent,
}) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentSøkPerson, søkPersonResponse } = useHentSøkPerson();
    const [feilmelding, settFeilmelding] = useState<string>();

    const navigate = useNavigate();

    useEffect(() => {
        hentSøkPerson(personIdent);
    }, [personIdent, hentSøkPerson]);

    useEffect(() => {
        if (søkPersonResponse.status === RessursStatus.SUKSESS) {
            const fagsakPersonId = søkPersonResponse.data.fagsakPersonId;
            if (fagsakPersonId) {
                hentFagsakPerson(fagsakPersonId);
            } else {
                settFeilmelding(
                    'Her har noe gått galt, forventer att fagsakPersonId finnes på søkPersonResponse'
                );
            }
        } else if (
            søkPersonResponse.status === RessursStatus.FEILET ||
            søkPersonResponse.status === RessursStatus.FUNKSJONELL_FEIL
        ) {
            if (søkPersonResponse.frontendFeilmelding.indexOf(finnerIkkeFagsakMelding) > -1) {
                settFeilmelding(`Personen finnes ikke i ny løsning eller infotrygd, denne burde ikke trenge migrering. 
                ${søkPersonResponse.frontendFeilmelding.substring(
                    finnerIkkeFagsakMelding.length
                )}`);
            } else {
                settFeilmelding(søkPersonResponse.frontendFeilmelding);
            }
        }
    }, [hentFagsakPerson, søkPersonResponse]);

    const gåVidereTilJournalføring = useCallback(() => {
        navigate(`/journalfor?journalpostId=${journalpostId}&oppgaveId=${oppgaveId}`);
    }, [navigate, journalpostId, oppgaveId]);

    useEffect(() => {
        if (
            fagsakPerson.status === RessursStatus.SUKSESS &&
            fagsakPerson.data.overgangsstønad?.erMigrert
        ) {
            gåVidereTilJournalføring();
        }
    }, [fagsakPerson, gåVidereTilJournalføring]);

    const triggerHentFagsak = () => {
        if (fagsakPerson.status === RessursStatus.SUKSESS && fagsakPerson.data.id) {
            hentFagsakPerson(fagsakPerson.data.id);
        }
    };

    const onMigrert = (status: Migreringsstatus) => {
        if (status === Migreringsstatus.ER_MIGRERT) {
            triggerHentFagsak();
        } else if (status === Migreringsstatus.KAN_GÅ_VIDERE_TIL_JOURNALFØRING) {
            gåVidereTilJournalføring();
        }
    };

    return (
        <>
            {feilmelding && <div style={{ color: 'red' }}>{feilmelding}</div>}
            <DataViewer response={{ fagsakPerson }}>
                {({ fagsakPerson }) => {
                    if (!fagsakPerson.overgangsstønad?.erMigrert) {
                        return (
                            <>
                                <Infotrygdperioderoversikt
                                    fagsakPerson={{
                                        id: fagsakPerson.id,
                                        overgangsstønad: fagsakPerson.overgangsstønad?.id,
                                        barnetilsyn: fagsakPerson.barnetilsyn?.id,
                                        skolepenger: fagsakPerson.skolepenger?.id,
                                    }}
                                    personIdent={personIdent}
                                    onMigrert={onMigrert}
                                    fraOppgavebenken={true}
                                />
                                <div>
                                    <Info heigth={24} width={24} /> Etter migrering vil du bli sendt
                                    videre til journalføring.
                                </div>
                                <div>
                                    Hvis du ønsker å journalføre på en ny behandling må du refreshe
                                    siden til at behandlingen får statusen "IVERKSATT"
                                </div>
                            </>
                        );
                    } else {
                        return <div>Sender videre til journalføring</div>;
                    }
                }}
            </DataViewer>
        </>
    );
};

/**
 * Denne gjør:
 * * Henter journalpost
 *  * Søker etter person på ident fra journalpost (som oppretter fagsakPerson hvis den finnes i infotrygd)
 *   * Henter fagsakPerson for fagsakPersonId
 *    * Hvis personen ikke er migrert, vis info om migrering
 *     * Når personen er migrert, trigg henting av fagsak på nytt
 *    * Hvis personen er migrert, send videre til journalføring
 */
const OppgaveMigrering: React.FC<OppgaveOgJournalpostId> = ({ oppgaveId, journalpostId }) => {
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostId);

    useEffect(() => {
        if (journalpostId) {
            hentJournalPost();
        }
    }, [hentJournalPost, journalpostId]);

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => (
                <SøkEtterPerson
                    oppgaveId={oppgaveId}
                    journalpostId={journalpostId}
                    personIdent={journalResponse.personIdent}
                />
            )}
        </DataViewer>
    );
};

const OppgaveMigreringApp: React.FC = () => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    if (!journalpostIdParam || !oppgaveIdParam) {
        return <Navigate to="/oppgavebenk" />;
    }

    return <OppgaveMigrering oppgaveId={oppgaveIdParam} journalpostId={journalpostIdParam} />;
};

export default OppgaveMigreringApp;
