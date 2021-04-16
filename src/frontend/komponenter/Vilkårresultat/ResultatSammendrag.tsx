import React, { useEffect } from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { Steg } from '../Høyremeny/Steg';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    TidligereVedtaksperioderType,
    Vilkårsresultat,
} from '../Behandling/Inngangsvilkår/vilkår';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { useBehandling } from '../../context/BehandlingContext';
import { useHentVilkår } from '../../hooks/useHentVilkår';
import { VilkårsresultatIkon } from '../Felleskomponenter/Visning/VilkårsresultatIkon';
import { mapVilkårtypeTilResultat, summerVilkårsresultat } from './utils';

export function withResultatSammendrag<PROPS>(Component: React.ComponentType<PROPS>) {
    return (props: PROPS & { behandlingId: string }) => {
        const { behandling } = useBehandling();
        const { behandlingId, ...rest } = props as any;
        if (behandling.status === RessursStatus.SUKSESS && behandling.data.steg === Steg.VILKÅR) {
            return <ResultatSammendrag behandlingId={behandlingId} />;
        }
        return <Component {...rest} />;
    };
}

const resultatTilTekst: Record<Vilkårsresultat, string> = {
    IKKE_AKTUELL: 'ikke aktuell',
    IKKE_OPPFYLT: 'ikke oppfylt',
    IKKE_TATT_STILLING_TIL: 'ikke tatt stilling til',
    OPPFYLT: 'oppfylt',
    SKAL_IKKE_VURDERES: 'ikke vurdert',
};

const ResultatSummering: React.FC<{
    vilkårsresultat: Vilkårsresultat;
    summering: number;
    antall: number;
}> = ({ summering, vilkårsresultat, antall }) => {
    return (
        <>
            <VilkårsresultatIkon
                vilkårsresultat={(vilkårsresultat as unknown) as Vilkårsresultat}
            />
            <Normaltekst>
                {`${summering} av ${antall} ${resultatTilTekst[vilkårsresultat]}`}
            </Normaltekst>
        </>
    );
};

const ResultatSammendrag: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkår, hentVilkår } = useHentVilkår();

    useEffect(() => {
        hentVilkår(behandlingId);
    }, [behandlingId]);

    if (vilkår.status === RessursStatus.SUKSESS) {
        const vurderingerUtenTidligereVedtaksperioder = vilkår.data.vurderinger.filter(
            (v) => v.vilkårType !== TidligereVedtaksperioderType.TIDLIGERE_VEDTAKSPERIODER
        );

        const inngangsvilkår = vurderingerUtenTidligereVedtaksperioder.filter(
            (v) => v.vilkårType in InngangsvilkårType
        );
        const aktivitetsvilkår = vurderingerUtenTidligereVedtaksperioder.filter(
            (v) => v.vilkårType in AktivitetsvilkårType
        );

        const ingangsvilkårResultat = summerVilkårsresultat(
            mapVilkårtypeTilResultat(inngangsvilkår)
        );
        const aktivitetsvilkårResultat = summerVilkårsresultat(
            mapVilkårtypeTilResultat(aktivitetsvilkår)
        );

        return (
            <>
                <Systemtittel>Inngangsvilkår</Systemtittel>
                {Object.entries(ingangsvilkårResultat).map(([vilkårsresultat, sum]) => (
                    <ResultatSummering
                        vilkårsresultat={vilkårsresultat as Vilkårsresultat}
                        summering={sum}
                        antall={7}
                    />
                ))}
            </>
        );
    }
    return null;
};

export default ResultatSammendrag;
