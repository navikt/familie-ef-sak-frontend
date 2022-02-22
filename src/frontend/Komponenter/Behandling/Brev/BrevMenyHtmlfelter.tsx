import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { BrevStruktur, Htmlfelt } from './BrevTyper';
import styled from 'styled-components';

const StyledBrevMenyHtmlFelter = styled.div``;

interface Props {
    dokument: BrevStruktur;
    htmlfelterSomVises: string[];
    settHtmlfelterSomVises: Dispatch<SetStateAction<string[]>>;
}

export const BrevMenyHtmlfelter: React.FC<Props> = ({ dokument, settHtmlfelterSomVises }) => {
    const { htmlfelter } = dokument;

    return (
        <StyledBrevMenyHtmlFelter>
            {htmlfelter?.htmlfeltReferanse?.map((felt: Htmlfelt) => {
                return (
                    <CheckboxGruppe legend="HTML-felt">
                        <Checkbox
                            onClick={(e) => {
                                if ((e.target as HTMLInputElement).checked) {
                                    settHtmlfelterSomVises((prevHtmlfelter: string[]) => [
                                        ...prevHtmlfelter,
                                        felt.felt,
                                    ]);
                                } else {
                                    settHtmlfelterSomVises((prevHtmlfelter: string[]) => {
                                        const nyListe = [...prevHtmlfelter];

                                        nyListe.splice(nyListe.indexOf(felt.felt), 1);

                                        return nyListe;
                                    });
                                }
                            }}
                            label={felt.htmlfeltVisningsnavn}
                        />
                    </CheckboxGruppe>
                );
            })}
        </StyledBrevMenyHtmlFelter>
    );
};
