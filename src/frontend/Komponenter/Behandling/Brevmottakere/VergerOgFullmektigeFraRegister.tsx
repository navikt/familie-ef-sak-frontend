import React, { Dispatch, FC, SetStateAction } from 'react';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { IBrevmottaker } from './typer';
import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { Ingress, Button, BodyShort } from '@navikt/ds-react';
import { VertikalSentrering } from '../../../App/utils/styling';

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

    const settMottaker = (mottaker: IBrevmottaker) => () => {
        settValgteMottakere((prevState) => {
            return [...prevState, mottaker];
        });
    };

    return (
        <>
            <StyledIngress>Verge/Fullmektig fra register</StyledIngress>
            {muligeMottakere.length ? (
                muligeMottakere.map((mottaker, index) => {
                    const mottakerValgt = !!valgteMottakere.find(
                        (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
                    );
                    return (
                        <StyledMottakerBoks key={mottaker.navn + index}>
                            <Kolonner>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </Kolonner>
                            {!mottakerValgt && (
                                <VertikalSentrering>
                                    <div>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={settMottaker(mottaker)}
                                        >
                                            Legg til
                                        </Button>
                                    </div>
                                </VertikalSentrering>
                            )}
                        </StyledMottakerBoks>
                    );
                })
            ) : (
                <BodyShort>Ingen verge/fullmektig i register</BodyShort>
            )}
        </>
    );
};
