import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { IBrevmottaker } from './typer';
import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { Button } from '@navikt/ds-react';
import '@navikt/ds-css';

interface Props {
    valgteMottakere: IBrevmottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
}

const StyledIngress = styled(Ingress)`
    margin-bottom: 1rem;
`;

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Kolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

const ButtonContainer = styled.div`
    display: flex;
`;

const StyledButton = styled(Button)``;

export const VergerOgFullmektigeFraRegister: FC<Props> = ({
    valgteMottakere,
    settValgteMottakere,
    verger,
    fullmakter,
}) => {
    const muligeMottakere = [
        ...verger.map(vergemålTilBrevmottaker),
        ...fullmakter.map(fullmaktTilBrevMottaker),
    ];

    const toggleMottaker = (mottaker: IBrevmottaker) => (e: ChangeEvent<HTMLInputElement>) => {
        settValgteMottakere((prevState) => {
            return e.target.checked
                ? [...prevState, mottaker]
                : [
                      ...prevState.filter(
                          (valgtMottaker) => valgtMottaker.personIdent !== mottaker.personIdent
                      ),
                  ];
        });
    };
    return (
        <>
            <StyledIngress>Verge/Fullmektig fra register</StyledIngress>
            {muligeMottakere.map((mottaker, index) => {
                const mottakerValgt = !!valgteMottakere.find(
                    (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
                );
                return (
                    <>
                        <StyledMottakerBoks>
                            <Kolonner>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </Kolonner>
                            <ButtonContainer>
                                <StyledButton variant="secondary" size="medium">
                                    Legg til
                                </StyledButton>
                            </ButtonContainer>
                        </StyledMottakerBoks>
                        <Checkbox
                            key={index}
                            label={`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                            onChange={toggleMottaker(mottaker)}
                            checked={mottakerValgt}
                        />
                    </>
                );
            })}
        </>
    );
};
