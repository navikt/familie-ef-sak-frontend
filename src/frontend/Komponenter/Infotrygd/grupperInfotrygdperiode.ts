import { InfotrygdPeriode, Kode } from '../../App/typer/infotrygd';
import { InfotrygdPeriodeMedFlereEndringer } from './typer';

/**
 * Då det finnes flere endringer på en periode/vedtak så har noen av de høyere presedense en andre
 * Vanligt er att man har Førstegangsvedtak/Endring/G-omregning, og sen får ett opphør, då skal opphøret vises primært
 */
const mapKode = (kode: Kode): number => {
    switch (kode) {
        case Kode.OVERTFØRT_NY_LØSNING:
            return 5;
        case Kode.UAKTUELL:
            return 4;
        case Kode.OPPHØRT:
            return 3;
        default:
            return 0;
    }
};

const grupperPerioderPerVedtak = (
    perioder: InfotrygdPeriode[]
): { [key: string]: InfotrygdPeriode[] } =>
    perioder.reduce((acc, periode) => {
        const prev = acc[periode.vedtakId] || [];
        prev.push(periode);
        acc[periode.vedtakId] = prev;
        return acc;
    }, {} as { [key: string]: InfotrygdPeriode[] });

/**
 * Et vedtak kan inneholde 1-2 endringer. Hvis det er 2 endringer blir det duplikat av vedtak, med ulike koder.
 * Denne sammenslåingen slår sammen disse, basert på hvilken typ av kode det er. Eks Opphør og Førstegangsbehandling slås ihop der
 * opphør er koden, mens Førstegangsbehandling initialKode
 * Det finnes 2 vedtak der det finnes 3 endringer, disse blir ikke direkt håndtert her
 */
const slåSammenVedtak = (
    perioderPerVedtak: InfotrygdPeriode[][]
): InfotrygdPeriodeMedFlereEndringer[] =>
    perioderPerVedtak.reduce((acc: InfotrygdPeriodeMedFlereEndringer[], perioder) => {
        if (perioder.length === 1) {
            acc.push(perioder[0]);
        } else {
            const sortertePerioder = perioder.sort((a, b) =>
                mapKode(a.kode) > mapKode(b.kode) ? -1 : 1
            );
            acc.push({
                ...sortertePerioder[0],
                initialKode: sortertePerioder[1].kode,
            } as InfotrygdPeriodeMedFlereEndringer);
        }
        return acc;
    }, [] as InfotrygdPeriodeMedFlereEndringer[]);

/**
 * Sorterer perioder, stønadFom desc, og sen på vedtakId desc, då senere vedtakId har høyere presedens
 * `||` i sortering blir som sortBy(..).andThen(..)
 * I dette tilfellet, sortBy(stønadFom desc).andThen(vedtakId desc)
 */
const sortPerioder = (
    perioder: InfotrygdPeriodeMedFlereEndringer[]
): InfotrygdPeriodeMedFlereEndringer[] =>
    perioder.sort((a, b) => {
        return (
            new Date(b.stønadFom).getTime() - new Date(a.stønadFom).getTime() ||
            b.vedtakId - a.vedtakId
        );
    });

export const slåSammenOgSorterPerioder = (
    perioder: InfotrygdPeriode[]
): InfotrygdPeriodeMedFlereEndringer[] => {
    const perioderPerVedtak = Object.values(grupperPerioderPerVedtak(perioder));
    const sammenslåtteVedtak = slåSammenVedtak(perioderPerVedtak);
    return sortPerioder(sammenslåtteVedtak);
};
