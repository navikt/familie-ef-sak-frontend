import React from 'react';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { BrevStruktur } from './BrevTyper';
import styled from 'styled-components';

const StyledBrevMenyHtmlFelter = styled.div``;

interface Props {
    dokument: BrevStruktur;
    htmlfelterSomVises: any;
    settHtmlfelterSomVises: any;
}

export const BrevMenyHtmlfelter: React.FC<Props> = ({ dokument, settHtmlfelterSomVises }) => {
    const { htmlfelter } = dokument;

    return (
        <StyledBrevMenyHtmlFelter>
            {htmlfelter?.htmlfeltReferanse?.map((felt: any) => {
                return (
                    <CheckboxGruppe legend="Tabell">
                        <Checkbox
                            onClick={(e) => {
                                if ((e.target as HTMLInputElement).checked) {
                                    settHtmlfelterSomVises((prevHtmlfelter: any) => [
                                        ...prevHtmlfelter,
                                        felt.felt,
                                    ]);
                                } else {
                                    settHtmlfelterSomVises((prevHtmlfelter: any) => {
                                        const nyListe = [...prevHtmlfelter];

                                        nyListe.splice(nyListe.indexOf(felt.felt), 1);

                                        return nyListe;
                                    });
                                }
                            }}
                            label={felt.felt}
                        />
                    </CheckboxGruppe>
                );
            })}
        </StyledBrevMenyHtmlFelter>
    );
};
