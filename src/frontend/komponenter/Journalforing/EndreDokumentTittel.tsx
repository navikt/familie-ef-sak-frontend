import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';

/*
'Uttalelse tilbakekreving',
    'Uttalelse',
    'Tilmelding til NAV som reell arbeidssøker ved krav om overgangsstønad',
    'Søknad om stønad til skolepenger - enslig mor eller far',
    'Søknad om stønad til barnetilsyn - enslig mor eller far i arbeid',
    'Søknad om overgangsstønad - enslig mor eller far',
    'Stevning',
    'Skatteopplysninger',
    'Rettsavgjørelse',
    'Refusjonskrav/faktura',
    'Oppholdstillatelse',
    'Merknader i ankesak',
    'Medisinsk dokumentasjon',
    'Krav om gjenopptak av ankesak',
    'Klage/Anke',
    'Klage på tilbakekreving',
    'Inntektsopplysninger',
    'Grunnblankett',
    'Fødselsmelding/Fødselsattest',
    'Forespørsel',
    'EØS-dokument',
    'Erklæring samlivsbrudd',
    'Enslig mor eller far som er arbeidssøker',
    'Endring i sivilstand',
    'Bekreftelse på utdanning / utgifter',
    'Bekreftelse på tilsynsutgifter',
    'Bekreftelse på termindato',
    'Bekreftelse fra barnevernet',
    'Avtale / avgjørelse om samvær',
    'Arbeidsforhold',
    'Annet (=fritekst)',
    'Anke på tilbakekreving'

*/

const EndreDokumentTittel: React.FC<{
    endreDokumentNavn: (nyttDokumentNavn: string) => void;
    avbrytEndring: () => void;
}> = (props) => {
    const [nyttDokumentNavn, settNyttDokumentNavn] = useState('');

    return (
        <div>
            <input type={'text'} onChange={(e) => settNyttDokumentNavn(e.target.value)} />
            <Knapp
                kompakt
                onClick={() => {
                    props.endreDokumentNavn(nyttDokumentNavn);
                    settNyttDokumentNavn('');
                }}
            >
                Lagre
            </Knapp>
            <Knapp
                kompakt
                onClick={() => {
                    props.avbrytEndring();
                    settNyttDokumentNavn('');
                }}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default EndreDokumentTittel;
