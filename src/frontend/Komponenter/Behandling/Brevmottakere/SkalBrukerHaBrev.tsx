import React, { Dispatch, FC, SetStateAction } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import styled from 'styled-components';
import { Ingress, Radio, RadioGroup } from '@navikt/ds-react';

const StyledRadioGruppe = styled(RadioGroup)`
    display: flex;

    > div {
        margin-right: 2rem;
    }
`;

const StyledIngress = styled(Ingress)`
    margin-bottom: 1rem;
`;

interface Props {
    valgteBrevmottakere: IBrevmottaker[];
    settValgtBrevMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    personopplysninger: IPersonopplysninger;
}
export const SkalBrukerHaBrev: FC<Props> = ({
    valgteBrevmottakere,
    settValgtBrevMottakere,
    personopplysninger,
}) => {
    const brukerSkalHaBrev = valgteBrevmottakere.some(
        (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    const toggleBrukerSkalHaBrev = () => {
        settValgtBrevMottakere((mottakere) => {
            const brukerErIListe = mottakere.some(
                (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
            );

            if (brukerErIListe) {
                const mottakereUtenBruker = mottakere.filter(
                    (mottaker) => mottaker.mottakerRolle !== EBrevmottakerRolle.BRUKER
                );

                return mottakereUtenBruker;
            } else {
                const mottakereMedBruker = [
                    {
                        mottakerRolle: EBrevmottakerRolle.BRUKER,
                        personIdent: personopplysninger.personIdent,
                        navn: personopplysninger.navn.visningsnavn,
                    },
                    ...mottakere,
                ];
                return mottakereMedBruker;
            }
        });
    };

    return (
        <>
            <StyledIngress>Skal bruker motta brevet?</StyledIngress>
            <StyledRadioGruppe legend={'Skal bruker motta brevet?'} hideLegend>
                <Radio
                    value={'Ja'}
                    name={'brukerHaBrevRadio'}
                    checked={brukerSkalHaBrev}
                    onChange={toggleBrukerSkalHaBrev}
                >
                    Ja
                </Radio>
                <Radio
                    value={'Nei'}
                    name={'brukerHaBrevRadio'}
                    checked={!brukerSkalHaBrev}
                    onChange={toggleBrukerSkalHaBrev}
                >
                    Nei
                </Radio>
            </StyledRadioGruppe>
        </>
    );
};
