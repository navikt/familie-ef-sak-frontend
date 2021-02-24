import React, { FC } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { delvilkårÅrsakTilTekst, EDelvilkårÅrsak } from './typer';
import { IDelvilkår, IVurdering } from '../vilkår';
import { oppdaterDelvilkår } from '../../Vurdering/Delvilkår';
import { RadioContainer } from '../../../Felleskomponenter/Visning/StyledFormElements';

interface Props {
    delvilkår: IDelvilkår;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const NæreBoforhold: FC<Props> = ({ vurdering, delvilkår, settVurdering }) => {
    return (
        <RadioContainer>
            <RadioGruppe key={'nære boforhold'} legend={'Om boforholdet'}>
                {[
                    EDelvilkårÅrsak.SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER,
                    EDelvilkårÅrsak.SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT,
                    EDelvilkårÅrsak.SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN,
                    EDelvilkårÅrsak.SELVSTENDIGE_BOLIGER_SAMME_TOMT,
                    EDelvilkårÅrsak.NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE,
                    EDelvilkårÅrsak.TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE,
                ].map((årsak) => (
                    <Radio
                        key={årsak}
                        label={delvilkårÅrsakTilTekst[årsak]}
                        name={årsak}
                        onChange={() =>
                            settVurdering(
                                oppdaterDelvilkår(vurdering, {
                                    ...delvilkår,
                                    årsak: årsak,
                                })
                            )
                        }
                        value={årsak}
                        checked={delvilkår.årsak === årsak}
                    />
                ))}
            </RadioGruppe>
        </RadioContainer>
    );
};

export default NæreBoforhold;
