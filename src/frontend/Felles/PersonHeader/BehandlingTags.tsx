import { Behandling, BehandlingKategori, kategoriTilTekst } from '../../App/typer/fagsak';
import { Hide, Tag } from '@navikt/ds-react';
import { stønadstypeTilTekst, stønadstypeTilTekstKort } from '../../App/typer/behandlingstema';
import {
    behandlingstypeTilTekst,
    behandlingstypeTilTekstKort,
    regelverkLabel,
    RegelverkType,
} from '../../App/typer/behandlingstype';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/behandlingsårsak';
import React from 'react';

interface Props {
    behandling: Behandling;
}

interface ResponsivTagProps extends Omit<React.ComponentProps<typeof Tag>, 'children' | 'size'> {
    kortTekst: string;
    tekst: string;
}

const ResponsivTag: React.FC<ResponsivTagProps> = ({ kortTekst, tekst, ...tagProps }) => {
    return (
        <>
            <Hide below="md" above="xl" asChild>
                <Tag {...tagProps} size={'small'}>
                    {kortTekst}
                </Tag>
            </Hide>
            <Hide below="xl" asChild>
                <Tag {...tagProps} size={'small'}>
                    {tekst}
                </Tag>
            </Hide>
        </>
    );
};

const utledBehandlingsårsakKortTekst = (behandlingÅrsak: Behandlingsårsak) => {
    switch (behandlingÅrsak) {
        case Behandlingsårsak.PAPIRSØKNAD:
            return 'P..';
        case Behandlingsårsak.MANUELT_OPPRETTET:
            return 'M..';
        default:
            return '';
    }
};

const BehandlingTags: React.FC<Props> = ({ behandling }) => {
    const { behandlingsårsak, kategori, stønadstype, type, erRegelendring2026, status } =
        behandling;
    const skalViseBehandlingsårsak =
        behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD ||
        behandlingsårsak === Behandlingsårsak.MANUELT_OPPRETTET;

    const erBehandlingFerdigstilt = status === 'FERDIGSTILT';

    const regelverkNøkkel: RegelverkType = erRegelendring2026
        ? 'NYTT_REGELVERK'
        : 'GAMMELT_REGELVERK';

    const valgtRegelverkLabel = regelverkLabel[regelverkNøkkel];

    return (
        <>
            {kategori === BehandlingKategori.EØS && (
                <Tag variant={'warning-filled'} size={'small'}>
                    {kategoriTilTekst[kategori]}
                </Tag>
            )}
            <ResponsivTag
                variant={'success'}
                kortTekst={stønadstypeTilTekstKort[stønadstype]}
                tekst={stønadstypeTilTekst[stønadstype]}
            />
            <ResponsivTag
                variant={'info'}
                kortTekst={behandlingstypeTilTekstKort[type]}
                tekst={behandlingstypeTilTekst[type]}
            />
            {erBehandlingFerdigstilt && (
                <ResponsivTag
                    data-color="meta-purple"
                    kortTekst={valgtRegelverkLabel.kortTekst}
                    tekst={valgtRegelverkLabel.tekst}
                />
            )}
            {skalViseBehandlingsårsak && (
                <ResponsivTag
                    variant={'warning'}
                    kortTekst={utledBehandlingsårsakKortTekst(behandlingsårsak)}
                    tekst={behandlingsårsakTilTekst[behandlingsårsak]}
                />
            )}
        </>
    );
};

export default BehandlingTags;
