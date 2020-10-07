import EndreDokumentTittel from './EndreDokumentTittel';
import { Knapp } from 'nav-frontend-knapper';
import Rediger from '../../ikoner/Rediger';
import React, { useState } from 'react';
import VisPdf from '../../ikoner/VisPdf';
import { IJournalpost } from './journalforing';
import { OrNothing } from '../../hooks/useSorteringState';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
}

const DokumentVisning: React.FC<DokumentVisningProps> = ({ journalPost, hentDokument }) => {
    const [journalPostKopi, settJournalPostKopi] = useState<IJournalpost>(journalPost);

    const [dokumentForRedigering, settDokumentForRedigering] = useState<OrNothing<string>>();

    const endreDokumentNavn = (dokumentInfoId: string) => {
        return (nyttDokumentNavn: string) => {
            settJournalPostKopi({
                ...journalPostKopi,
                dokumenter: journalPostKopi.dokumenter.map((dokument) => {
                    if (dokument.dokumentInfoId === dokumentInfoId) {
                        return { ...dokument, tittel: nyttDokumentNavn };
                    }
                    return dokument;
                }),
            });
            settDokumentForRedigering(null);
        };
    };

    return (
        <ul>
            {journalPostKopi.dokumenter.map((dokument) => (
                <li key={dokument.dokumentInfoId}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex' }}>
                            {dokumentForRedigering === dokument.dokumentInfoId ? (
                                <EndreDokumentTittel
                                    endreDokumentNavn={endreDokumentNavn(dokument.dokumentInfoId)}
                                    avbrytEndring={() => settDokumentForRedigering(null)}
                                />
                            ) : (
                                <>
                                    <span>{dokument.tittel}</span>
                                    <Knapp
                                        kompakt={true}
                                        onClick={() =>
                                            settDokumentForRedigering((prevState) => {
                                                if (prevState) {
                                                    return undefined;
                                                }
                                                return dokument.dokumentInfoId;
                                            })
                                        }
                                    >
                                        <Rediger />
                                    </Knapp>
                                </>
                            )}
                        </div>

                        <Knapp kompakt={true} onClick={() => hentDokument(dokument.dokumentInfoId)}>
                            <VisPdf />
                        </Knapp>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default DokumentVisning;
