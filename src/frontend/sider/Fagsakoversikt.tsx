/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { useParams } from 'react-router';
import { Behandling, Fagsak } from '../typer/fagsak';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../utils/formatter';
import { formatterEnumVerdi } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useSorteringState } from '../hooks/felles/useSorteringState';
import SorteringsHeader from '../komponenter/Oppgavebenk/OppgaveSorteringHeader';
import { useApp } from '../context/AppContext';
import { IPersonopplysninger } from '../typer/personopplysninger';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import VisittkortComponent from '../komponenter/Felleskomponenter/Visittkort/Visittkort';
import DataViewer from '../komponenter/Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../typer/behandlingstype';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useToggles } from '../context/TogglesContext';
import { ToggleName } from '../context/toggles';

const TittelWrapper = styled.div`
    padding: 2rem 2rem 1rem 2rem;
`;

const TekniskOpphørKnapp = styled(Knapp)`
    margin: 1rem;
`;

const Fagsakoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const [personOpplysninger, settPersonOpplysninger] = useState<Ressurs<IPersonopplysninger>>(
        byggTomRessurs()
    );
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();

    const hentFagsak = () =>
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then((response) => settFagsak(response));

    const hentPersonData = () =>
        axiosRequest<IPersonopplysninger, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }).then((response) => settPersonOpplysninger(response));

    useEffect(() => {
        if (fagsakId) {
            hentFagsak();
            hentPersonData();
        }
    }, [fagsakId]);

    const gjørTekniskOpphør = (personIdent: string) => {
        axiosRequest<Ressurs<void>, { ident: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor`,
            data: { ident: personIdent },
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentFagsak();
            } else if (
                response.status === RessursStatus.FEILET ||
                response.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    return (
        <DataViewer response={{ fagsak, personOpplysninger }}>
            {({ fagsak, personOpplysninger }) => (
                <>
                    <VisittkortComponent data={personOpplysninger} />
                    <TittelWrapper>
                        <Innholdstittel className="blokk-m" tag="h2">
                            Behandlingsoversikt - {personOpplysninger.navn.visningsnavn}
                        </Innholdstittel>
                        <Systemtittel tag="h3">
                            Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
                        </Systemtittel>
                    </TittelWrapper>
                    <FagsakoversiktTabell behandlinger={fagsak.behandlinger} />
                    {toggles[ToggleName.TEKNISK_OPPHØR] && (
                        <TekniskOpphørKnapp
                            onClick={() => gjørTekniskOpphør(personOpplysninger.personIdent)}
                        >
                            Teknisk opphør
                        </TekniskOpphørKnapp>
                    )}
                    {tekniskOpphørFeilet && (
                        <AlertStripeFeil style={{ maxWidth: '15rem' }}>
                            Kunde inte iverksetta teknisk opphør. Ta venligest kontakt med noen som
                            som har tilgang til secureloggs och kan førtelle dig hva som gikk galt
                        </AlertStripeFeil>
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Fagsakoversikt;

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const FagsakoversiktTabell: React.FC<Pick<Fagsak, 'behandlinger'>> = ({ behandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState<Behandling>(
        behandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'ascending',
        }
    );

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'opprettet'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Behandling opprettetdato"
                        onClick={() => settSortering('opprettet')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'type'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Type"
                        onClick={() => settSortering('type')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'status'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Status"
                        onClick={() => settSortering('status')}
                    />
                    <SorteringsHeader
                        rekkefolge={
                            sortConfig?.sorteringsfelt === 'resultat'
                                ? sortConfig?.rekkefolge
                                : undefined
                        }
                        tekst="Resultat"
                        onClick={() => settSortering('resultat')}
                    />
                </tr>
            </thead>
            <tbody>
                {sortertListe.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDatoTid(behandling.opprettet)}</td>
                            <td>{formatterEnumVerdi(behandling.type)}</td>
                            <td>{formatterEnumVerdi(behandling.status)}</td>
                            <td>
                                {behandling.type === Behandlingstype.TEKNISK_OPPHØR ? (
                                    <span>{formatterEnumVerdi(behandling.resultat)}</span>
                                ) : (
                                    <Link
                                        className="lenke"
                                        to={{ pathname: `/behandling/${behandling.id}` }}
                                    >
                                        {formatterEnumVerdi(behandling.resultat)}
                                    </Link>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};
