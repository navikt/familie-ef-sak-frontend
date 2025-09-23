import { ISøkeresultat, Søk } from '@navikt/familie-header';
import React, { useCallback, useState } from 'react';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { ISøkPerson } from '../../App/typer/personsøk';
import { useApp } from '../../App/context/AppContext';
import { IPersonIdent } from '../../App/typer/felles';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { MannIkon } from '../Ikoner/MannIkon';
import { KvinneIkon } from '../Ikoner/KvinneIkon';
import { Kjønn } from '../../App/typer/personopplysninger';
import { utledSøkeresultatVisning } from './SøkeresultatVisning';
import { EToast } from '../../App/typer/toast';
import styled from 'styled-components';
import { ModalWrapper } from '../Modal/ModalWrapper';
import { BodyShort } from '@navikt/ds-react';

const tilSøkeresultatListe = (resultat: ISøkPerson): ISøkeresultat[] => [
    {
        harTilgang: true, //Alltid true hvis har status RessursStatus.SUKSESS
        ident: resultat.personIdent,
        fagsakId: resultat.fagsakPersonId, // hak for å få Søk til å virke riktig med fagsakPersonId
        navn: resultat.visningsnavn,
        ikon: resultat.kjønn === Kjønn.MANN ? <MannIkon /> : <KvinneIkon />,
    },
];

const erPositivtTall = (verdi: string) => /^\d+$/.test(verdi) && Number(verdi) !== 0;

const SøkContainer = styled.div`
    display: flex;
`;

const PersonSøk: React.FC = () => {
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const [resultat, settResultat] = useState<Ressurs<ISøkeresultat[]>>(byggTomRessurs());
    const [uuidSøk, settUuidSøk] = useState(uuidv4());
    const [fokuserSøkeresultat, settFokuserSøkeresultat] = useState<boolean>(false);
    const [personIdentUtenFagsak, settPersonIdentUtenFagsak] = useState<string>('');
    const [visModal, settVisModal] = useState<boolean>(false);

    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    const onInputKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                if (resultat.status === RessursStatus.SUKSESS) {
                    settFokuserSøkeresultat((prevState) => !prevState);
                } else {
                    settFokuserSøkeresultat(false);
                }
                break;
            default:
                break;
        }
    };

    const lukkModal = () => {
        settPersonIdentUtenFagsak('');
        settVisModal(false);
    };

    const opprettFagsakPersonOgNaviger = (personIdent: string) => {
        axiosRequest<string, { personIdent: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak-person`,
            data: { personIdent: personIdent },
        }).then((res: Ressurs<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                window.open(`${window.location.origin}/person/${res.data}`, '_SELF');
            } else {
                settToast(EToast.REDIRECT_FAGSAK_PERSON_FEILET);
            }
        });
    };

    const søkeresultatOnClick = (søkeresultat: ISøkeresultat) => {
        if (søkeresultat.fagsakId) {
            navigate(`/person/${søkeresultat.fagsakId}`); // fagsakId er mappet fra fagsakPersonId
        } else {
            settPersonIdentUtenFagsak(søkeresultat.ident);
            settVisModal(true);
        }
        settUuidSøk(uuidv4()); // Brukes for å fjerne søkeresultatene ved å rerendre søkekomponenten
        nullstillResultat();
    };

    const oppdaterResultat = (response: RessursSuksess<ISøkPerson> | RessursFeilet): void => {
        if (response.status === RessursStatus.SUKSESS) {
            const søkeresultater: ISøkeresultat[] = tilSøkeresultatListe(response.data);
            settResultat(byggSuksessRessurs(søkeresultater));
        } else {
            settResultat(response);
        }
    };

    const søkPerson = useCallback(
        (personIdent: string) => {
            axiosRequest<ISøkPerson, IPersonIdent>({
                method: 'POST',
                url: `/familie-ef-sak/api/sok/person`,
                data: { personIdent: personIdent },
            }).then(oppdaterResultat);
        },
        [axiosRequest]
    );

    const søkPersonEksternFagsakId = useCallback(
        (eksternFagsakId: string) => {
            axiosRequest<ISøkPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/person/fagsak-ekstern/${eksternFagsakId}`,
            }).then(oppdaterResultat);
        },
        [axiosRequest]
    );

    const søk = (verdi: string): void => {
        if (!verdi || resultat.status === RessursStatus.HENTER) return;

        settResultat(byggHenterRessurs());
        if (erPositivtTall(verdi) && verdi.length !== 11) {
            søkPersonEksternFagsakId(verdi);
        } else {
            søkPerson(verdi);
        }
    };

    return (
        <>
            <SøkContainer onKeyDown={onInputKeyDown}>
                <Søk
                    key={uuidSøk}
                    søk={søk}
                    label="Søk etter fagsak for en person"
                    placeholder="Fnr/saksnr"
                    søkeresultater={resultat}
                    nullstillSøkeresultater={nullstillResultat}
                    søkeresultatOnClick={søkeresultatOnClick}
                    formaterResultat={(søkeresultat: ISøkeresultat, erSøkeresultatValgt: boolean) =>
                        utledSøkeresultatVisning(
                            søkeresultat,
                            erSøkeresultatValgt,
                            søkeresultatOnClick,
                            fokuserSøkeresultat
                        )
                    }
                />
            </SøkContainer>
            <ModalWrapper
                tittel={'Bekreft opprettelse av person'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => {
                            if (personIdentUtenFagsak) {
                                opprettFagsakPersonOgNaviger(personIdentUtenFagsak);
                                lukkModal();
                            }
                        },
                        tekst: 'Opprett',
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft opprettelse av person'}
            >
                <BodyShort>Fødselsnummer: {personIdentUtenFagsak}</BodyShort>
            </ModalWrapper>
        </>
    );
};

export default PersonSøk;
