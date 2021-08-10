import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

export const RimeligGrunnHjelpetekst: React.FC = () => {
    return (
        <>
            <Normaltekst>
                Arbeid som er til hinder for omsorgen for barn, som for eksempel overveiende
                nattarbeid, arbeid som forutsetter lange fraværsperioder eller lang reisevei, kan
                anses som rimelig grunn til å avslutte et arbeidsforhold. Det samme gjelder dersom
                arbeidsforholdet er lønnet under tariff eller sedvane, eller dersom omfanget av
                arbeidet var så lite at det i svært liten grad bidro til selvforsørgelse.
            </Normaltekst>
            <br />
            <Normaltekst>
                Søker bør fortsatt ha rett til å avslutte et arbeidsforhold for å gå over i et nytt,
                eller redusere arbeidstiden, jf. krav til omfanget av aktivitetsplikten.
            </Normaltekst>
        </>
    );
};
