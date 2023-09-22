import React, { useCallback, useEffect, useState } from 'react';
import { Td } from '../../../../Felles/Personopplysninger/TabellWrapper';
import { ISøkeresultatPerson } from '../../../../App/typer/personopplysninger';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { AlertStripeVariant } from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { Button } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IPersonalia } from '../vilkår';

interface BeboereTabellProps {
    vis: boolean;
}

interface BostedsadresseProps {
    behandlingId: string;
    personalia: IPersonalia;
}

const BeboereTabell = styled.table<BeboereTabellProps>`
    grid-column: 1 / span 3;
    background-color: #f9f9f9;
    margin-top: 2rem;

    display: ${(props) => (props.vis ? 'block' : 'none')};
`;

const KnappMedMarginTop = styled(Button)`
    margin-top: 0.5rem;
`;

export const Bostedsadresse = ({ behandlingId, personalia }: BostedsadresseProps) => {
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

    const { bostedsadresse } = personalia;

    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.REGISTER}
                label="Brukers bostedsadresse"
                verdiSomString={false}
                verdi={
                    <div>
                        <BodyShortSmall>
                            {bostedsadresse?.visningsadresse || 'Mangler bostedsadresse'}
                        </BodyShortSmall>
                        {bostedsadresse && (
                            <KnappMedMarginTop
                                type={'button'}
                                variant={'tertiary'}
                                icon={visBeboere ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                iconPosition={'right'}
                                onClick={() => {
                                    settVisBeboere(!visBeboere);
                                }}
                                size={'small'}
                            >
                                Se beboere
                            </KnappMedMarginTop>
                        )}
                    </div>
                }
            />
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
