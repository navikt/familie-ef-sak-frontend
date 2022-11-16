import React, { useCallback, useEffect, useState } from 'react';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { Td } from '../../../../Felles/Personopplysninger/TabellWrapper';
import {
    AdresseType,
    IAdresse,
    IPersonopplysninger,
    ISøkeresultatPerson,
} from '../../../../App/typer/personopplysninger';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { Collapse, Expand } from '@navikt/ds-icons';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { AlertStripeVariant } from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { gyldigTilOgMedErNullEllerFremITid } from '../../../../Felles/Personopplysninger/adresseUtil';
import { Button } from '@navikt/ds-react';

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

const nåværendeBostedsadresse = (
    personopplysningerResponse: IPersonopplysninger
): IAdresse | undefined => {
    const bostedsadresse = personopplysningerResponse.adresse.find(
        (adresse) => adresse.type === AdresseType.BOSTEDADRESSE
    );
    return bostedsadresse && gyldigTilOgMedErNullEllerFremITid(bostedsadresse)
        ? bostedsadresse
        : undefined;
};

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
                    const bostedsadresse = nåværendeBostedsadresse(personopplysningerResponse);

                    return (
                        <>
                            <Registergrunnlag />
                            <Normaltekst>Brukers bostedsadresse</Normaltekst>
                            <div>
                                <Normaltekst>
                                    {bostedsadresse?.visningsadresse || 'Mangler bostedsadresse'}
                                </Normaltekst>
                                {bostedsadresse && (
                                    <Button
                                        type={'button'}
                                        variant={'tertiary'}
                                        icon={visBeboere ? <Collapse /> : <Expand />}
                                        iconPosition={'right'}
                                        onClick={() => {
                                            settVisBeboere(!visBeboere);
                                        }}
                                        size={'small'}
                                    >
                                        Se beboere
                                    </Button>
                                )}
                            </div>
                        </>
                    );
                }}
            </DataViewer>
            {visBeboere && (
                <DataViewer
                    response={{ beboere }}
                    alertStripeVariant={AlertStripeVariant.SAMLIV_VILKÅR}
                >
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
            )}
        </>
    );
};
