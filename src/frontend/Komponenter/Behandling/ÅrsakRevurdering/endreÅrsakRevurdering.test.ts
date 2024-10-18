import { describe, expect, test } from 'vitest';
import { initiellStateMedDefaultOpplysningskilde, Opplysningskilde, Årsak } from './typer';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { BehandlingKategori, BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Steg } from '../Høyremeny/Steg';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';

describe('årsak revurdering tilstand', () => {
    test('skal sette opplysningstype til SØKNAD dersom årsak revurdering er tom og behandlingen er søknadsrevurdering', () => {
        const initiellState = initiellStateMedDefaultOpplysningskilde(
            { kravMottatt: '2024-05-20' },
            opprettBehandling(Behandlingstype.REVURDERING, Behandlingsårsak.SØKNAD)
        );

        expect(initiellState.årsakRevurdering?.opplysningskilde).toBe(
            Opplysningskilde.INNSENDT_SØKNAD
        );
        expect(initiellState.kravMottatt).toBe('2024-05-20');
        expect(initiellState.årsakRevurdering?.årsak).toBeUndefined;
        expect(initiellState.årsakRevurdering?.beskrivelse).toBeUndefined;
        expect(initiellState.endretTid).toBeUndefined;
    });

    test('skal ikke ha årsak revurdering dersom behandlingen er førstegangsbehandling søknad', () => {
        const initiellState = initiellStateMedDefaultOpplysningskilde(
            { kravMottatt: '2024-05-20' },
            opprettBehandling(Behandlingstype.FØRSTEGANGSBEHANDLING, Behandlingsårsak.SØKNAD)
        );

        expect(initiellState.årsakRevurdering).toBeUndefined;
        expect(initiellState.kravMottatt).toBe('2024-05-20');
        expect(initiellState.endretTid).toBeUndefined;
    });

    test.each(årsakerUtenomSøknad)(
        'skal ikke sette opplysningstype dersom årsak revurdering er tom og behandlingen er revurdering utenom søknad %årsak',
        (årsak: Behandlingsårsak) => {
            const initiellState = initiellStateMedDefaultOpplysningskilde(
                {
                    kravMottatt: '2024-05-20',
                },
                opprettBehandling(Behandlingstype.REVURDERING, årsak)
            );

            expect(initiellState.årsakRevurdering?.opplysningskilde).toBeUndefined;
            expect(initiellState.kravMottatt).toBe('2024-05-20');
            expect(initiellState.årsakRevurdering?.årsak).toBeUndefined;
            expect(initiellState.årsakRevurdering?.beskrivelse).toBeUndefined;
            expect(initiellState.endretTid).toBeUndefined;
        }
    );

    test('skal ikke sette opplysningstype dersom årsak revurdering eksisterer', () => {
        const initiellState = initiellStateMedDefaultOpplysningskilde(
            {
                kravMottatt: '2024-05-20',
                årsakRevurdering: {
                    årsak: Årsak.ENDRING_INNTEKT,
                    opplysningskilde: Opplysningskilde.MELDING_MODIA,
                },
            },
            opprettBehandling(Behandlingstype.REVURDERING, Behandlingsårsak.SØKNAD)
        );

        expect(initiellState.årsakRevurdering?.opplysningskilde).toBe(
            Opplysningskilde.MELDING_MODIA
        );
        expect(initiellState.kravMottatt).toBe('2024-05-20');
        expect(initiellState.årsakRevurdering?.årsak).toBe(Årsak.ENDRING_INNTEKT);
        expect(initiellState.årsakRevurdering?.beskrivelse).toBeUndefined;
        expect(initiellState.endretTid).toBeUndefined;
    });
});

const årsakerUtenomSøknad: Behandlingsårsak[] = Object.values(Behandlingsårsak).filter(
    (årsak) => årsak !== Behandlingsårsak.SØKNAD
);

const opprettBehandling = (
    behandlingstype: Behandlingstype,
    behandlingsårsak: Behandlingsårsak
) => {
    return {
        type: behandlingstype,
        kategori: BehandlingKategori.NASJONAL,
        behandlingsårsak: behandlingsårsak,
        stønadstype: Stønadstype.OVERGANGSSTØNAD,
        fagsakId: '123',
        opprettet: '',
        resultat: BehandlingResultat.IKKE_SATT,
        id: '',
        steg: Steg.VILKÅR,
        sistEndret: '',
        status: BehandlingStatus.UTREDES,
    };
};
