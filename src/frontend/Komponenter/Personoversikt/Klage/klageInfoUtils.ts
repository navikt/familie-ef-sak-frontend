import {
    KlageBehandling,
    Klagebehandlinger,
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    KlageinstansEventType,
} from '../../../App/typer/klage';
import { Stønadstype } from '../../../App/typer/behandlingstema';

const erKlageUnderArbeid = (klagebehandling: KlageBehandling) => {
    return (
        klagebehandling.status == KlagebehandlingStatus.OPPRETTET ||
        klagebehandling.status == KlagebehandlingStatus.UTREDES
    );
};

export const stønasatyperMedÅpenKlage = (klagebehandlinger: Klagebehandlinger): Stønadstype[] => {
    const stønadstyperMedÅpenKlage: Stønadstype[] = [];
    if (klagebehandlinger.overgangsstønad.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.OVERGANGSSTØNAD);
    }
    if (klagebehandlinger.barnetilsyn.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.BARNETILSYN);
    }
    if (klagebehandlinger.skolepenger.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.SKOLEPENGER);
    }

    return stønadstyperMedÅpenKlage;
};

export const stønadstyperMedÅpenSakNavKlageinstans = (
    klagebehandlinger: Klagebehandlinger
): Stønadstype[] => {
    const stønadstyperMedÅpenKlageNavKlageinstans: Stønadstype[] = [];

    const erKlageTilBehandlingNavKlageinstans = (klagebehandling: KlageBehandling) =>
        klagebehandling.status === KlagebehandlingStatus.VENTER &&
        klagebehandling.resultat === KlagebehandlingResultat.IKKE_MEDHOLD;

    if (klagebehandlinger.overgangsstønad.some(erKlageTilBehandlingNavKlageinstans)) {
        stønadstyperMedÅpenKlageNavKlageinstans.push(Stønadstype.OVERGANGSSTØNAD);
    }
    if (klagebehandlinger.barnetilsyn.some(erKlageTilBehandlingNavKlageinstans)) {
        stønadstyperMedÅpenKlageNavKlageinstans.push(Stønadstype.BARNETILSYN);
    }
    if (klagebehandlinger.skolepenger.some(erKlageTilBehandlingNavKlageinstans)) {
        stønadstyperMedÅpenKlageNavKlageinstans.push(Stønadstype.SKOLEPENGER);
    }

    return stønadstyperMedÅpenKlageNavKlageinstans;
};

export const personHarÅpenAnke = (klagebehandlinger: Klagebehandlinger) =>
    harÅpenAnke(klagebehandlinger.overgangsstønad) ||
    harÅpenAnke(klagebehandlinger.barnetilsyn) ||
    harÅpenAnke(klagebehandlinger.skolepenger);

const harÅpenAnke = (klagebehandlinger: KlageBehandling[]) =>
    klagebehandlinger.some(
        (klagebehandling) =>
            klagebehandling.status !== KlagebehandlingStatus.FERDIGSTILT &&
            klagebehandling.klageinstansResultat.some(
                (resultat) =>
                    resultat.type === KlageinstansEventType.ANKEBEHANDLING_OPPRETTET ||
                    resultat.type === KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET
            )
    );
