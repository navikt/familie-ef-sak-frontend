import React from 'react';
import SivilstandVisning from './SivilstandVisning';
import { SivilstandType } from '../../../../typer/personopplysninger';
import { VilkårStatus } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ISivilstandInngangsvilkår } from './typer';

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
        const container = document.createElement('div');

        test('skal vise sivilstand og dato ', () => {
            act(() => {
                render(
                    <SivilstandVisning
                        sivilstand={sivilstand}
                        vilkårStatus={VilkårStatus.IKKE_VURDERT}
                    />,
                    container
                );
            });
            expect(container.textContent).toContain('Ugift');
            expect(container.textContent).toContain('2000-01-01');
        });
    });
});
