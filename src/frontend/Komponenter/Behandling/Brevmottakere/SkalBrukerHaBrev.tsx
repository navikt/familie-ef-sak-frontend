import React, { Dispatch, FC, SetStateAction } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';

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
    const brukerSkalHaBrev = !!valgteBrevmottakere.find(
        (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    const toggleBrukerSkalHaBrev = () => {
        settValgtBrevMottakere((mottakere) => {
            const brukerErIListe = !!mottakere.find(
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
            <Ingress>Skal bruker motta brevet?</Ingress>
            <RadioGruppe>
                <Radio
                    label={'Ja'}
                    name={'brukerHaBrevRadio'}
                    checked={brukerSkalHaBrev}
                    onChange={toggleBrukerSkalHaBrev}
                />
                <Radio
                    label={'Nei'}
                    name={'brukerHaBrevRadio'}
                    checked={!brukerSkalHaBrev}
                    onChange={toggleBrukerSkalHaBrev}
                />
            </RadioGruppe>
        </>
    );
};
