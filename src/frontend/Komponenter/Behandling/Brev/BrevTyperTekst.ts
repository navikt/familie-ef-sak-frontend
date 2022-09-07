import { AvsnittMedId } from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';

export const initielleAvsnittTom: AvsnittMedId[] = [
    {
        deloverskrift: '',
        innhold: '',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakInvilgelse: AvsnittMedId[] = [
    {
        deloverskrift: 'Du må si ifra om endringer',
        innhold:
            'Hvis det skjer endringer som kan ha betydning for stønaden din, må du si ifra til oss. Du finner oversikten over endringer du må si ifra om på nav.no/familie/alene-med-barn/overgangsstonad#melde. Du sier ifra om endringer ved å logge inn på nav.no/skriv-til-oss.',
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

export const initielleAvsnittVedtakAvslag: AvsnittMedId[] = [
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

export const initielleAvsnittVedtakInvilgelseBarnetilsyn: AvsnittMedId[] = [
    {
        deloverskrift: 'Du må si ifra om endringer',
        innhold:
            'Hvis det skjer endringer som kan ha betydning for stønaden din, må du si ifra til oss. Du finner oversikten over endringer du må si ifra om på nav.no/barnetilsyn-enslig#melde. Du sier ifra om endringer ved å logge inn på nav.no/skriv-til-oss.',
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
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakAvslagBarnetilsyn: AvsnittMedId[] = [
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
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVarselOmAktivitetsplikt: AvsnittMedId[] = [
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
            '\n\nDette må du gjøre innen barnet fyller 1 år.' +
            '\n\nVi minner om at du har plikt til å gi de opplysningene og levere de dokumentene som er nødvendige' +
            '\nfor at vi skal kunne vurdere om du fortsatt har rett til stønaden. Dersom vi ikke har fått' +
            '\nopplysningene innen fristens utløp, kan vi stanse stønaden din. Dette står i folketrygdloven § 21-3.',
        id: uuidv4(),
    },
];

export const initielleAvsnittInnhentingAvKarakterutskriftHovedperiode: AvsnittMedId[] = [
    {
        deloverskrift: '',
        innhold:
            'Du får overgangsstønad og er i utdanning.' +
            '\n\t\nVi følger opp saken din, og ber deg om å sende oss:' +
            '\n\n\t•\tkarakterutskrift for skoleåret 2021/2022' +
            '\n\t•\tdokumentasjon som viser at du fortsetter i samme utdanning, eller' +
            '\n\t•\tdokumentasjon som viser at du starter i ny utdanning, eller\n' +
            '\t•\tdokumentasjon som viser ny aktivitet fra 01.07.2022\n' +
            '\nDu må sende oss dokumentasjonen innen 21.07.2022.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Dokumentere at du har gjennomført skoleåret',
        innhold:
            'Du må sende inn karakterutskrift for skoleåret 2021/2022, både høst- og vårsemesteret. Det må gå frem av dokumentasjonen at du har gjennomført skoleåret, og at du har studert minst 50 prosent.\n' +
            '\t\n' +
            'Hvis du ikke kan sende inn karakterutskrift, må du sende inn annen dokumentasjon som viser at du har gjennomført skoleåret, og at du har studert minst 50 prosent. Dette kan for eksempel være en bekreftelse fra skolen. På dokumentasjonen må det stå tydelig at det gjelder deg.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Hvis du har avsluttet utdanningen underveis',
        innhold:
            'Har du avsluttet utdanningen i løpet av skoleåret, må du sende oss dokumentasjon fra skolen som viser hvilken dato du sluttet. \n' +
            '\t\n' +
            'Du må sende oss sykemelding eller uttalelse fra lege hvis du avbrøt utdanningen av helsemessige årsaker. Hvis du ikke fikk godkjent eksamen eller fullført skoleåret av andre grunner, kan du forklare dette i en melding til oss på nav.no/beskjedtilnav. Dette gjelder også hvis koronapandemien har vært grunnen til at du avsluttet eller ikke fikk fullført utdanningen.\n' +
            '\n' +
            'Hvis du ikke sender oss karakterutskrift eller annen dokumentasjon innen fristen, kan vi kreve tilbake penger du har fått utbetalt dette skoleåret.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Videre aktivitet',
        innhold:
            'Hvis du fortsetter i utdanning skoleåret 2022/2023, må du dokumentere dette. Fortsetter du i samme utdanning, må du dokumentere at du fortsatt skal studere minst 50 prosent. Starter du i ny utdanning, må du sende oss dokumentasjon som viser hvilken utdanning du skal ta. Da kan vi vurdere om utdanningen er nødvendig og hensiktsmessig for å få eller beholde arbeid. Dokumentasjonen må inneholde navnet ditt, hvilken periode du skal studere og hvor mye du skal studere.' +
            '\n\nHvis du ikke fortsetter i utdanning, må du dokumentere hvordan du fyller aktivitetsplikten fra 01.07.2022. Du må enten jobbe minst 50 prosent eller være registrert som arbeidssøker hos oss til minst 50 prosent stilling for fortsatt å ha rett til overgangsstønad.' +
            '\n\nAktivitetsplikten gjelder ikke for deg hvis' +
            '\n\n\t•\tdu har barn med behov for særlig tilsyn, og dette hindrer deg i å jobbe, søke arbeid eller' +
            '\n\t\t studere fulltid. Du må dokumentere dette med legeerklæring.' +
            '\n\t•\t du eller barnet ditt har en sykdom som hindrer deg i å jobbe, søke arbeid eller studere mer enn' +
            '\n\t\t  50 prosent. Du må dokumentere dette med legeerklæring.' +
            '\n\t•\tdu har gjort det du kan for å skaffe deg barnepass. Dette må du dokumentere med avslag på' +
            '\n\t\t  barnehageplass/SFO-plass, eventuelt dokumentasjon som viser at du står på venteliste.' +
            '\n\nDu kan lese mer om aktivitetsplikten på nav.no/overgangsstonad-enslig#aktivitet.' +
            '\n\nVi minner om at du har plikt til å gi de opplysningene og levere de dokumentene som er nødvendige for at vi skal kunne vurdere om du har rett til stønaden. Hvis vi ikke får opplysningene innen fristen, vil vi behandle saken din ut fra de opplysningene vi har. Dette går frem av folketrygdloven § 21-3.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Har du spørsmål?',
        innhold:
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittInnhentingAvKarakterutskriftUtvidetPeriode: AvsnittMedId[] = [
    {
        deloverskrift: '',
        innhold:
            'Du får utvidet tid med overgangsstønad fordi du er i utdanning.' +
            '\n\nVi følger opp saken din, og ber deg om å sende oss:' +
            '\n\n•\tKarakterutskrift for skoleåret 2021/2022' +
            '\n\nDu må sende oss dokumentasjonen innen 21.07.22.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Dokumentere at du har gjennomført skoleåret',
        innhold:
            'Du må sende inn karakterutskrift for skoleåret 2021/2022, både høst- og vårsemesteret. Det må gå frem av dokumentasjonen at du har gjennomført skoleåret, og at du har studert minst 50 prosent.' +
            '\n\nHvis du ikke kan sende inn karakterutskrift, må du sende inn annen dokumentasjon som viser at du har gjennomført skoleåret, og at du har studert minst 50 prosent. Dette kan for eksempel være en bekreftelse fra skolen. På dokumentasjonen må det stå tydelig at det gjelder deg.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Hvis du har avsluttet utdanningen underveis',
        innhold:
            'Har du avsluttet utdanningen i løpet av skoleåret, må du sende oss dokumentasjon fra skolen som viser hvilken dato du sluttet.' +
            '\n\nDu må sende oss sykemelding eller uttalelse fra lege hvis du avbrøt utdanningen av helsemessige årsaker. Hvis du ikke fikk godkjent eksamen eller fullført skoleåret av andre grunner, kan du forklare dette i en melding til oss på nav.no/beskjedtilnav. Dette gjelder også hvis koronapandemien har vært grunnen til at du avsluttet eller ikke fikk fullført utdanningen.' +
            '\n\nHvis du ikke sender oss karakterutskrift eller annen dokumentasjon innen fristen, kan vi kreve tilbake penger du har fått utbetalt dette skoleåret.' +
            '\n\nVi minner om at du har plikt til å gi de opplysningene og levere de dokumentene som er nødvendige for at vi skal kunne vurdere om du har rett til stønaden. Hvis vi ikke får opplysningene innen fristen, vil vi behandle saken din ut fra de opplysningene vi har. Dette går fram av folketrygdloven § 21-3.',
        id: uuidv4(),
    },
    {
        deloverskrift: 'Har du spørsmål?',
        innhold:
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakInvilgelseSkolepenger: AvsnittMedId[] = [
    {
        deloverskrift: 'Du må si ifra om endringer',
        innhold:
            'Hvis det skjer endringer som kan ha betydning for stønaden din, må du si ifra til oss. Du finner oversikten over endringer du må si ifra om på nav.no/skolepenger-enslig#melde. Du sier ifra om endringer ved å logge inn på nav.no/skriv-til-oss.',
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
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];

export const initielleAvsnittVedtakAvslagSkolepenger: AvsnittMedId[] = [
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
            'Du finner informasjon som kan være nyttig for deg på nav.no/familie/alene-med-barn. Du kan også kontakte oss på nav.no/kontakt.',
        id: uuidv4(),
    },
];
