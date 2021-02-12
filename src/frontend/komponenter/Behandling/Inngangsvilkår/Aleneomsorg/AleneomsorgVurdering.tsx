import React, { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import NæreBoforhold from './NæreBoforhold';
import { skalViseLagreKnappAleneomsorg } from '../../Vurdering/VurderingUtil';
import { Normaltekst } from 'nav-frontend-typografi';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';

const hjelpetekst = (
    <Normaltekst>
        Det er definert som nære boforhold når:
        <ul>
            <li>
                Søker bor i samme hus som den andre forelderen og huset har 4 eller færre boenheter
            </li>
            <li>
                Søker bor i samme hus som den andre forelderen og huset har flere enn 4 boenheter,
                men boforholdet er vurdert nært
            </li>
            <li>Foreldrene bor i selvstendige boliger på samme tomt eller gårdsbruk</li>
            <li>Foreldrene bor i selvstendige boliger på samme gårdstun</li>
            <li>Foreldrene bor i nærmeste bolig eller rekkehus i samme gate</li>
            <li>Foreldrene bor i tilstøtende boliger eller rekkehus i samme gate</li>
        </ul>
    </Normaltekst>
);

const AleneomsorgVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;

    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );

    return (
        <>
            {delvilkårsvurderinger.map((delvilkår) => {
                return (
                    <KomponentGruppe key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                            hjelpetekst={
                                delvilkår.type === DelvilkårType.NÆRE_BOFORHOLD && hjelpetekst
                            }
                        />
                        {delvilkår.type === DelvilkårType.NÆRE_BOFORHOLD &&
                            delvilkår.resultat === Vilkårsresultat.NEI && (
                                <NæreBoforhold
                                    delvilkår={delvilkår}
                                    vurdering={vurdering}
                                    settVurdering={settVurdering}
                                />
                            )}
                        <Begrunnelse
                            label={'Begrunnelse'}
                            value={delvilkår.begrunnelse || ''}
                            onChange={(e) => {
                                const redigerteDelvilkår = vurdering.delvilkårsvurderinger.map(
                                    (delvilkårVurdering: IDelvilkår) => {
                                        if (delvilkår.type === delvilkårVurdering.type) {
                                            return {
                                                ...delvilkår,
                                                begrunnelse: e.target.value,
                                            };
                                        } else return delvilkårVurdering;
                                    }
                                );
                                settVurdering({
                                    ...vurdering,
                                    delvilkårsvurderinger: redigerteDelvilkår,
                                });
                            }}
                        />
                    </KomponentGruppe>
                );
            })}
            {skalViseLagreKnappAleneomsorg(delvilkårsvurderinger) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};

export default AleneomsorgVurdering;
