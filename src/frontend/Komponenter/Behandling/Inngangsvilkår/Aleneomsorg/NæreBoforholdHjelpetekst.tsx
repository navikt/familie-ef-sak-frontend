import React from 'react';
import { BodyLong } from '@navikt/ds-react';

const NæreBoforholdHjelpetekst: React.FC = () => {
    return (
        <BodyLong as={'div'}>
            <p>Det er definert som nære boforhold når:</p>
            <ul>
                <li>
                    Søker bor i samme hus som den andre forelderen og huset har 4 eller færre
                    boenheter
                </li>
                <li>
                    Søker bor i samme hus som den andre forelderen og huset har flere enn 4
                    boenheter, men boforholdet er vurdert nært
                </li>
                <li>Foreldrene bor i selvstendige boliger på samme tomt eller gårdsbruk</li>
                <li>Foreldrene bor i selvstendige boliger på samme gårdstun</li>
                <li>Foreldrene bor i nærmeste bolig eller rekkehus i samme gate</li>
                <li>Foreldrene bor i tilstøtende boliger eller rekkehus i samme gate</li>
            </ul>
        </BodyLong>
    );
};

export default NæreBoforholdHjelpetekst;
