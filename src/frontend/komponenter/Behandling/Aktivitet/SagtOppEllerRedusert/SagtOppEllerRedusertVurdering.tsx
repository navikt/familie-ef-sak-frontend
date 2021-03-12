import { VurderingProps } from '../../Vurdering/VurderingProps';
import React from 'react';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';
import Delvilkår from '../../Vurdering/Delvilkår';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
} from '../../Inngangsvilkår/vilkår';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { harBesvartPåAlleDelvilkår } from '../../Vurdering/VurderingUtil';

const SagtOppEllerRedusertVurdering: React.FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled, config } = props;
    const visUnntak =
        harBesvartPåAlleDelvilkår(vurdering.delvilkårsvurderinger) &&
        vurdering.delvilkårsvurderinger.every(
            (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT
        );
    return (
        <>
            {vurdering.delvilkårsvurderinger.map((delvilkår) => {
                return (
                    <KomponentGruppe key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                        />
                    </KomponentGruppe>
                );
            })}
            {visUnntak && (
                <EnkeltUnntak
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={config.unntak[0]}
                />
            )}
            <Begrunnelse
                label={'Begrunnelse (valgfritt)'}
                value={vurdering.begrunnelse || ''}
                onChange={(e) => {
                    settVurdering({
                        ...vurdering,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            <LagreVurderingKnapp lagreVurdering={oppdaterVurdering} disabled={lagreknappDisabled} />
        </>
    );
};

interface EnkeltUnntakProps {
    unntak: UnntakType;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const EnkeltUnntak: React.FC<EnkeltUnntakProps> = (props) => {
    const { vurdering, unntak, settVurdering } = props;
    return (
        <RadioGruppe key={vurdering.id} legend={unntakTypeTilTekst[unntak]}>
            {[Vilkårsresultat.OPPFYLT, Vilkårsresultat.IKKE_OPPFYLT].map((resultat) => {
                return (
                    <Radio
                        key={resultat}
                        label={vilkårsresultatTypeTilTekst[resultat]}
                        name={unntak}
                        onChange={() => {
                            settVurdering({
                                ...vurdering,
                                unntak,
                                resultat,
                            });
                        }}
                    />
                );
            })}
        </RadioGruppe>
    );
};

export default SagtOppEllerRedusertVurdering;
