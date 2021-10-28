import { IAvsnitt } from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';

export const initielleAvsnittInformasjonsbrev: IAvsnitt[] = [
    {
        deloverskrift: '',
        innhold: '',
        id: uuidv4(),
    },
];

export const initielleAvsnittInnhentingAvOpplysninger: IAvsnitt[] = [
    {
        deloverskrift: '',
        innhold: '',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakInvilgelse: IAvsnitt[] = [
    {
        deloverskrift: 'Du må si ifra om endringer',
        innhold:
            'Hvis det skjer endringer som kan ha betydning for stønaden din, må du si ifra til oss. Du finner oversikten over endringer du må si ifra om på nav.no/familie/alene-med-barn/overgangsstonad#melde. Du sier ifra om endringer ved å skrive en beskjed til oss på nav.no/person/kontakt-oss/nb/skriv-til-oss.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Slik beregner vi inntekten din',
        innhold:
            'Du kan lese mer om hvordan vi beregner inntekten din på nav.no/overgangsstonad-enslig#hvor-mye.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Du har rett til å klage',
        innhold:
            'Hvis du vil klage, må du gjøre dette innen 6 uker fra den datoen du fikk dette brevet. Du finner skjema og informasjon på nav.no/klage.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Du har rett til innsyn',
        innhold: 'På nav.no/dittnav kan du se dokumentene i saken din.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Har du spørsmål?',
        innhold:
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakAvslag: IAvsnitt[] = [
    {
        deloverskrift: 'Du har rett til å klage',
        innhold:
            'Hvis du vil klage, må du gjøre dette innen 6 uker fra den datoen du fikk dette brevet. Du finner skjema og informasjon på nav.no/klage.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Du har rett til innsyn',
        innhold: 'På nav.no/dittnav kan du se dokumentene i saken din.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Har du spørsmål?',
        innhold:
            'Du finner nyttig informasjon på nav.no/overgangsstonad-enslig. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVarselOmAktivitetsplikt: IAvsnitt[] = [
    {
        deloverskrift: '',
        innhold:
            'Du får overgangsstønad. For å få stønad etter at barnet ditt har fylt 1 år, må du være i minst 50 prosent' +
            '\nyrkesrettet aktivitet.' +
            '\n\nDu må enten' +
            '\n\n\t • arbeide minst 50 prosent av full arbeidstid.' +
            '\n\t • studere minst 50 prosent. Du må sende inn dokumentasjon fra studiestedet som viser hva du' +
            '\n\t   skal studere, hvilken periode og hvor mye du skal studere. Utdanningen må være vurdert som' +
            '\n\t   nødvendig og hensiktsmessig, som hovedregel må det være offentlig utdanning.' +
            '\n\t • være registrert hos oss som arbeidssøker til minst 50 prosent stilling. Du må registrere deg på' +
            '\n\t   arbeidssokerregistrering.nav.no, og sende oss skjema «Enslig mor eller far som er arbeidssøker».' +
            '\n\t • etablere din egen virksomhet som er godkjent av oss.' +
            '\n\nDu kan kombinere flere aktiviteter, men en av dem må alene utgjøre minst 50 prosent av full' +
            '\narbeidstid. Hvis du arbeider og studerer mindre enn 50 prosent til sammen, kan du fylle' +
            '\naktivitetsplikten ved å registrere deg som arbeidssøker hos oss i tillegg.' +
            '\n\nAktivitetsplikten gjelder ikke for deg når' +
            '\n\n\t • du har barn med behov for særlig tilsyn, og dette hindrer deg i å jobbe, søke arbeid eller studere' +
            '\n\t   fulltid. Du må dokumentere dette med legeerklæring.' +
            '\n\t • du eller barnet ditt har en sykdom som hindrer deg i å jobbe, søke arbeid eller studere mer' +
            '\n\t   enn 50 prosent. Du må dokumentere dette med legeerklæring.' +
            '\n\t • du har gjort det du kan for å skaffe deg barnepass. Dette må du dokumentere med avslag på' +
            '\n\t   barnehageplass/SFO-plass, eventuelt dokumentasjon som viser at du står på venteliste. Du' +
            '\n\t   må ha søkt i alle aktuelle barnehager. Det holder ikke å bare søke om plass ett sted, hvis det' +
            '\n\t   er flere barnehager i nærheten. Du må ønske oppstart i barnehagen fra og med den dagen' +
            '\n\t   barnet fyller 1 år. Du kan få mer informasjon om søknadsfrister og opptak av kommunen din.' +
            '\n\nDu kan lese mer om aktivitetsplikten på nav.no/overgangsstonad-enslig#aktivitet.' +
            '\n\n\nVi ber deg sende inn dokumentasjon som viser hva du gjør av aktivitetene nevnt over, eventuelt' +
            '\ndokumentasjon som viser at du fyller vilkårene for å få unntak fra aktivitetsplikten.' +
            '\n\nDette må du gjøre innen [BARNETS_ETÅRSDAG].' +
            '\n\nVi minner om at du har plikt til å gi de opplysningene og levere de dokumentene som er nødvendige' +
            '\nfor at vi skal kunne vurdere om du fortsatt har rett til stønaden. Dersom vi ikke har fått' +
            '\nopplysningene innen fristens utløp, kan vi stanse stønaden din. Dette står i folketrygdloven § 21-3.',
        id: uuidv4(),
    },
];
