import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { BodyShort, Button, Ingress } from '@navikt/ds-react';
import { Delete } from '@navikt/ds-icons';

interface Props {
    valgtePersonMottakere: IBrevmottaker[];
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

const Undertittel = styled(Ingress)`
    margin-bottom: 1rem;
`;

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Flexboks = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BrevmottakereListe: FC<Props> = ({
    valgtePersonMottakere,
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const fjernPersonMottaker = (personIdent: string) => () => {
        settValgtePersonMottakere((prevState) =>
            prevState.filter((mottaker) => mottaker.personIdent !== personIdent)
        );
    };
    const fjernOrganisasjonMottaker = (organisasjonsnummer: string) => () => {
        settValgteOrganisasjonMottakere((prevState) =>
            prevState.filter((mottaker) => mottaker.organisasjonsnummer !== organisasjonsnummer)
        );
    };
    return (
        <>
            <Undertittel>Brevmottakere</Undertittel>
            {valgtePersonMottakere.map((mottaker, index) => (
                <StyledMottakerBoks key={mottaker.navn + index}>
                    <Flexboks>
                        <BodyShort>
                            {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                            <KopierbartNullableFødselsnummer fødselsnummer={mottaker.personIdent} />
                        </BodyShort>
                    </Flexboks>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={fjernPersonMottaker(mottaker.personIdent)}
                        icon={<Delete />}
                    />
                </StyledMottakerBoks>
            ))}
            {valgteOrganisasjonMottakere.map((mottaker, index) => (
                <StyledMottakerBoks key={mottaker.navnHosOrganisasjon + index}>
                    <div>
                        <BodyShort>{`${mottaker.navnHosOrganisasjon}`}</BodyShort>
                        <BodyShort>
                            {`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}
                        </BodyShort>
                    </div>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}
                        icon={<Delete />}
                    />
                </StyledMottakerBoks>
            ))}
        </>
    );
};
