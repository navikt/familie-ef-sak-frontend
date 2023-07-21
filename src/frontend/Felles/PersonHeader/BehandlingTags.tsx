import { Behandling, BehandlingKategori, kategoriTilTekst } from '../../App/typer/fagsak';
import { Tag } from '@navikt/ds-react';
import { stønadstypeTilTekst, stønadstypeTilTekstKort } from '../../App/typer/behandlingstema';
import {
    behandlingstypeTilTekst,
    behandlingstypeTilTekstKort,
} from '../../App/typer/behandlingstype';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/Behandlingsårsak';
import React from 'react';
import styled from 'styled-components';

const TagLitenSkjerm = styled(Tag)`
    @media screen and (min-width: 1190px) {
        display: none;
    }

    @media screen and (max-width: 805px) {
        display: none;
    }
`;

const TagStorSkjerm = styled(Tag)`
    @media screen and (max-width: 1189px) {
        display: none;
    }
`;

interface Props {
    behandling: Behandling;
}

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
    const { behandlingsårsak, kategori, stønadstype, type } = behandling;
    const skalViseBehandlingsårsak =
        behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD ||
        behandlingsårsak === Behandlingsårsak.MANUELT_OPPRETTET;

    return (
        <>
            {kategori === BehandlingKategori.EØS && (
                <Tag variant={'warning-filled'} size={'small'}>
                    {kategoriTilTekst[kategori]}
                </Tag>
            )}
            <TagLitenSkjerm variant={'success'} size={'small'}>
                {stønadstypeTilTekstKort[stønadstype]}
            </TagLitenSkjerm>
            <TagStorSkjerm variant={'success'} size={'small'}>
                {stønadstypeTilTekst[stønadstype]}
            </TagStorSkjerm>
            <TagLitenSkjerm variant={'info'} size={'small'}>
                {behandlingstypeTilTekstKort[type]}
            </TagLitenSkjerm>
            <TagStorSkjerm variant={'info'} size={'small'}>
                {behandlingstypeTilTekst[type]}
            </TagStorSkjerm>
            {skalViseBehandlingsårsak && (
                <>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        {utledBehandlingsårsakKortTekst(behandlingsårsak)}
                    </TagLitenSkjerm>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        {behandlingsårsakTilTekst[behandlingsårsak]}
                    </TagStorSkjerm>
                </>
            )}
        </>
    );
};

export default BehandlingTags;
