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
    behandling?: Behandling;
}

const BehandlingTags: React.FC<Props> = ({ behandling }) => {
    return (
        <>
            {behandling && behandling.kategori === BehandlingKategori.EØS && (
                <Tag variant={'warning-filled'} size={'small'}>
                    {kategoriTilTekst[behandling.kategori]}
                </Tag>
            )}
            {behandling && (
                <>
                    <TagLitenSkjerm variant={'success'} size={'small'}>
                        {stønadstypeTilTekstKort[behandling.stønadstype]}
                    </TagLitenSkjerm>
                    <TagStorSkjerm variant={'success'} size={'small'}>
                        {stønadstypeTilTekst[behandling.stønadstype]}
                    </TagStorSkjerm>
                </>
            )}
            {behandling && (
                <>
                    <TagLitenSkjerm variant={'info'} size={'small'}>
                        {behandlingstypeTilTekstKort[behandling.type]}
                    </TagLitenSkjerm>
                    <TagStorSkjerm variant={'info'} size={'small'}>
                        {behandlingstypeTilTekst[behandling.type]}
                    </TagStorSkjerm>
                </>
            )}
            {behandling && behandling.behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD && (
                <>
                    <TagLitenSkjerm variant={'warning'} size={'small'}>
                        P..
                    </TagLitenSkjerm>
                    <TagStorSkjerm variant={'warning'} size={'small'}>
                        {behandlingsårsakTilTekst[behandling.behandlingsårsak]}
                    </TagStorSkjerm>
                </>
            )}
        </>
    );
};

export default BehandlingTags;
