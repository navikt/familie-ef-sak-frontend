import { Ressurs, RessursStatus } from '@navikt/familie-typer/dist';
import { useState, useRef, useEffect } from 'react';
import { inputId } from '.';
import { ISøkeresultat } from '..';
import { søkKnappId, tømKnappId } from './Søk';

export interface Props {
    nullstillSøkeresultater: () => void;
    søk: (value: string) => void;
    søkeresultatOnClick: (søkResultat: ISøkeresultat) => void;
    søkeresultater: Ressurs<ISøkeresultat[]>;
}

const useSøk = ({ nullstillSøkeresultater, søk, søkeresultatOnClick, søkeresultater }: Props) => {
    const [ident, settIdent] = useState<string>('');
    const [identSistSøktPå, settIdentSistSøktPå] = useState('');
    const [valgtSøkeresultat, settValgtSøkeresultat] = useState(-1);
    const [erGyldig, settErGyldig] = useState(false);
    const ankerRef = useRef<Element | null>(null);

    useEffect(() => {
        if (erGyldig) {
            utløserSøk();
        }
    }, [erGyldig, ident]);

    useEffect(() => {
        window.addEventListener('keydown', handleGlobalKeydown);
        window.addEventListener('click', handleGlobalClick);

        return () => {
            window.removeEventListener('keydown', handleGlobalKeydown);
            window.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    const nullstillInput = (lukkPopover = false) => {
        settIdent('');
        settIdentSistSøktPå('');
        settErGyldig(false);
        if (lukkPopover) {
            ankerRef.current = null;
        }
        nullstillSøkeresultater();
    };

    const settAnkerPåInput = () => {
        const ankerElement = document.getElementById(inputId) as Element;

        ankerRef.current = ankerElement;
    };

    const utløserSøk = () => {
        const identUtenWhitespace = ident.replace(/ /g, '');
        søk(identUtenWhitespace);
        settIdentSistSøktPå(identUtenWhitespace);
        settAnkerPåInput();
    };

    const handleGlobalKeydown = (event: KeyboardEvent) => {
        if (ankerRef.current === undefined) {
            return;
        }
        if (event.key === 'Escape') {
            nullstillInput(true);
        }
    };

    const handleGlobalClick = () => {
        if (
            ankerRef.current !== undefined &&
            !ankerRef.current?.contains(document.activeElement) &&
            !document.getElementById(søkKnappId)?.contains(document.activeElement) &&
            !document.getElementById(tømKnappId)?.contains(document.activeElement)
        ) {
            nullstillInput(true);
        }
    };

    const onInputChange = (nyVerdi: string) => {
        settIdent(nyVerdi);

        if (nyVerdi === '') {
            nullstillSøkeresultater();
            ankerRef.current = null;
        }
    };

    const onInputKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                settValgtSøkeresultat(
                    valgtSøkeresultat === -1
                        ? søkeresultater.status === RessursStatus.SUKSESS
                            ? søkeresultater.data.length - 1
                            : -1
                        : valgtSøkeresultat - 1
                );
                break;
            case 'ArrowDown':
                settValgtSøkeresultat(
                    valgtSøkeresultat <
                        (søkeresultater.status === RessursStatus.SUKSESS
                            ? søkeresultater.data.length - 1
                            : -1)
                        ? valgtSøkeresultat + 1
                        : -1
                );
                break;
            case 'Enter':
                if (søkeresultater.status === RessursStatus.SUKSESS) {
                    if (
                        identSistSøktPå === ident &&
                        valgtSøkeresultat === -1 &&
                        søkeresultater.data.length === 1
                    ) {
                        søkeresultatOnClick(søkeresultater.data[0]);
                    } else if (valgtSøkeresultat !== -1) {
                        søkeresultatOnClick(søkeresultater.data[valgtSøkeresultat]);
                    } else {
                        utløserSøk();
                    }
                } else {
                    utløserSøk();
                }
                break;
            default:
                break;
        }
    };

    return {
        ankerRef,
        ident,
        nullstillInput,
        onInputChange,
        onInputKeyDown,
        settErGyldig,
        settValgtSøkeresultat,
        utløserSøk,
        valgtSøkeresultat,
    };
};

export default useSøk;
