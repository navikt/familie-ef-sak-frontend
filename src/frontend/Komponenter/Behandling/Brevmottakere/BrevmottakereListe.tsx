import React, { Dispatch, FC, SetStateAction } from 'react';
import { Ingress, Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';

interface Props {
    valgtePersonMottakere: IBrevmottaker[];
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

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
            <Ingress>Brevmottakere</Ingress>
            {valgtePersonMottakere.map((mottaker) => (
                <StyledMottakerBoks>
                    <Flexboks>
                        <Normaltekst>
                            {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                            <KopierbartNullableFødselsnummer fødselsnummer={mottaker.personIdent} />
                        </Normaltekst>
                    </Flexboks>
                    <LenkeKnapp onClick={fjernPersonMottaker(mottaker.personIdent)}>
                        <SlettSøppelkasse withDefaultStroke={false} />
                    </LenkeKnapp>
                </StyledMottakerBoks>
            ))}
            {valgteOrganisasjonMottakere.map((mottaker) => (
                <StyledMottakerBoks>
                    <div>
                        <Normaltekst>{`${mottaker.navnHosOrganisasjon}`}</Normaltekst>
                        <Normaltekst>
                            {`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}
                        </Normaltekst>
                    </div>
                    <LenkeKnapp onClick={fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}>
                        <SlettSøppelkasse withDefaultStroke={false} />
                    </LenkeKnapp>
                </StyledMottakerBoks>
            ))}
        </>
    );
};
