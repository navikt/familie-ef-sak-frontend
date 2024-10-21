import React, { useCallback, useEffect, useState } from 'react';
import { IPersonFraSøk, ISøkeresultatPerson } from '../../../../App/typer/personopplysninger';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { AlertStripeVariant } from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { Button, Table } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IPersonalia } from '../vilkår';
import { nullableDatoTilAlder } from '../../../../App/utils/dato';

interface BostedsadresseProps {
    behandlingId: string;
    personalia: IPersonalia;
}

const BeboereContainer = styled.div`
    background-color: #f9f9f9;
`;

const KnappMedMarginTop = styled(Button)`
    margin-top: 0.5rem;
`;

const StyledDataCell = styled(Table.DataCell)<{ person: IPersonFraSøk }>`
    font-weight: ${(props) => (props.person.erSøker || props.person.erBarn ? 'bold' : 'normal')};
`;

export const Bostedsadresse = ({ behandlingId, personalia }: BostedsadresseProps) => {
    const { axiosRequest } = useApp();

    const [beboere, settBeboere] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());
    const [visBeboere, settVisBeboere] = useState<boolean>(false);
    const [laster, settLaster] = useState<boolean>(false);

    const hentBeboerePåSammeAdresse = useCallback(
        (behandlingId: string) => {
            settLaster(true);
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/${behandlingId}/samme-adresse`,
            })
                .then((respons: Ressurs<ISøkeresultatPerson>) => {
                    settBeboere(respons);
                })
                .finally(() => {
                    settLaster(false);
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
                                disabled={laster}
                            >
                                {laster ? 'Laster beboere...' : 'Se beboere'}
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
                            <BeboereContainer>
                                <Table size="small">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader textSize={'small'}>
                                                Navn
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader textSize={'small'}>
                                                Fødselsnummer
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader textSize={'small'}>
                                                Adresse
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {beboere.personer.map((beboer) => {
                                            return (
                                                <Table.Row key={beboer.personIdent}>
                                                    <StyledDataCell
                                                        person={beboer}
                                                        textSize={'small'}
                                                    >
                                                        {`${beboer.visningsnavn} ${beboer.fødselsdato ? `(${nullableDatoTilAlder(beboer.fødselsdato)})` : ''}`}
                                                    </StyledDataCell>
                                                    <Table.DataCell textSize={'small'}>
                                                        {beboer.personIdent}
                                                    </Table.DataCell>
                                                    <Table.DataCell textSize={'small'}>
                                                        {beboer.visningsadresse}
                                                    </Table.DataCell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </BeboereContainer>
                        );
                    }}
                </DataViewer>
            )}
        </>
    );
};
