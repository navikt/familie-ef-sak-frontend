import React, { useState, useCallback, useEffect } from 'react';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { Td } from '../../../../Felles/Personopplysninger/TabellWrapper';
import { AdresseType, ISøkeresultatPerson } from '../../../../App/typer/personopplysninger';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import LenkeKnapp from '../../../../Felles/Knapper/LenkeKnapp';
import { Collapse, Expand } from '@navikt/ds-icons';
import { useBehandling } from '../../../../App/context/BehandlingContext';

interface BeboereTabellProps {
    vis: boolean;
}

interface BostedsadresseProps {
    behandlingId: string;
}

const BeboereTabell = styled.table<BeboereTabellProps>`
    grid-column: 1 / span 3;
    background-color: #f9f9f9;
    margin-top: 2rem;

    display: ${(props) => (props.vis ? 'block' : 'none')};
`;

const LenkeIkon = styled.div`
    margin-left: 0.5rem;
    top: 2px;

    display: inline-block;
    position: relative;
`;

export const Bostedsadresse = ({ behandlingId }: BostedsadresseProps) => {
    const { personopplysningerResponse } = useBehandling();
    const { axiosRequest } = useApp();

    const [beboere, settBeboere] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());
    const [visBeboere, settVisBeboere] = useState<boolean>(false);

    const hentBeboerePåSammeAdresse = useCallback(
        (behandlingId: string) => {
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/${behandlingId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson>) => {
                settBeboere(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        if (visBeboere && beboere.status !== RessursStatus.SUKSESS) {
            hentBeboerePåSammeAdresse(behandlingId);
        }
    }, [behandlingId, hentBeboerePåSammeAdresse, visBeboere, beboere.status]);

    return (
        <>
            <DataViewer response={{ personopplysningerResponse }}>
                {({ personopplysningerResponse }) => {
                    const bostedsadresse = personopplysningerResponse.adresse.find(
                        (adresse) => adresse.type === AdresseType.BOSTEDADRESSE
                    );

                    return (
                        <>
                            <Registergrunnlag />
                            <Normaltekst>Brukers bostedsadresse</Normaltekst>
                            <div>
                                <Normaltekst>{bostedsadresse?.visningsadresse}</Normaltekst>
                                <LenkeKnapp
                                    onClick={() => {
                                        settVisBeboere(!visBeboere);
                                    }}
                                >
                                    Se beboere
                                    <LenkeIkon>{visBeboere ? <Collapse /> : <Expand />}</LenkeIkon>
                                </LenkeKnapp>
                            </div>
                        </>
                    );
                }}
            </DataViewer>
            <DataViewer response={{ beboere }}>
                {({ beboere }) => {
                    return (
                        <>
                            <BeboereTabell vis={visBeboere} className="tabell">
                                <thead>
                                    <Td>Navn</Td>
                                    <Td>Fødselsnummer</Td>
                                    <Td>Adresse</Td>
                                </thead>
                                <tbody>
                                    {beboere.hits.map((beboer) => {
                                        return (
                                            <tr>
                                                <Td>{beboer.visningsnavn}</Td>
                                                <Td>{beboer.personIdent}</Td>
                                                <Td>{beboer.visningsadresse}</Td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </BeboereTabell>
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};
