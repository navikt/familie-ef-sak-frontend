import React from 'react';
import { render } from '@testing-library/react';
import { SivilstandType } from '../../../../typer/personopplysninger';
import { act } from 'react-dom/test-utils';
import { ISivilstandInngangsvilkår } from './typer';
import SivilstandVurdering from './SivilstandVurdering';
import { IVilkårConfig, VurderingConfig } from '../config/VurderingConfig';
import { DelvilkårType, IVurdering, Vilkår, Vilkårsresultat } from '../vilkår';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import { IBosituasjon } from '../Samliv/typer';
import { IMedlemskap } from '../Medlemskap/typer';
const domTestingLib = require('@testing-library/dom');
const { queryHelpers } = domTestingLib;

describe('inngangsvilkar/sivilstand', () => {
    describe('sivilstandsvisning', () => {
        const sivilstand: ISivilstandInngangsvilkår = {
            søknadsgrunnlag: {
                erUformeltGift: false,
            },
            registergrunnlag: {
                type: SivilstandType.UGIFT,
                gyldigFraOgMed: '2000-01-01',
            },
        };

        const delvilkår = {
            type: DelvilkårType.KRAV_SIVILSTAND,
            resultat: Vilkårsresultat.OPPFYLT,
        };
        const vurdering: IVurdering = {
            id: 'id-1234',
            resultat: Vilkårsresultat.IKKE_OPPFYLT,
            behandlingId: 'beh-id-1234',
            vilkårType: Vilkår.SIVILSTAND,
            delvilkårsvurderinger: [delvilkår],
            endretAv: 'EndretAv',
            endretTid: '2020-01-01',
        };

        test('skal vise vilkårsvurdering for sivilstand ', () => {
            act(() => {
                const config: IVilkårConfig = VurderingConfig['SIVILSTAND'];
                // @ts-ignore
                const bosituasjon: IBosituasjon = {};
                // @ts-ignore
                const medlemskap: IMedlemskap = {};
                const vilkårProps: VurderingProps = {
                    config: config,
                    vurdering: vurdering,
                    settVurdering: () => {
                        return;
                    },
                    oppdaterVurdering: () => {
                        return;
                    },
                    lagreknappDisabled: false,
                    inngangsvilkårgrunnlag: {
                        sivilstand: sivilstand,
                        medlemskap: medlemskap,
                        bosituasjon: bosituasjon,
                        sivilstandsplaner: {},
                        barnMedSamvær: [],
                    },
                };
                const { container } = render(<SivilstandVurdering props={vilkårProps} />);

                const getByName = queryHelpers.queryAllByAttribute.bind(null, 'name');
                const sivilstandKravRadio: HTMLElement[] = getByName(
                    container,
                    DelvilkårType.KRAV_SIVILSTAND
                );

                const oppfylt = sivilstandKravRadio.find(
                    (r) => r.getAttribute('value') === Vilkårsresultat.OPPFYLT
                );
                expect(oppfylt?.getAttributeNames().includes('checked')).toBeTruthy();
                const ikkeOppfylt = sivilstandKravRadio.find(
                    (r) => r.getAttribute('value') === Vilkårsresultat.IKKE_OPPFYLT
                );
                expect(ikkeOppfylt?.getAttributeNames().includes('checked')).toBeFalsy();
            });
        });
    });
});
