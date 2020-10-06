import * as React from 'react';
import { IVurdering } from '../vilkår';
import { ChangeEvent, FC } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { SvarType } from '../../../../utils/standardSvar';

interface Props {
    vurderinger?: IVurdering[];
    className?: string;
    svarRadioButton?: SvarType;
    onChangeRadioButton?: (valgtSvar: ChangeEvent<HTMLInputElement>) => void;
}
const MedlemskapVurdering: FC<Props> = ({
    vurderinger,
    svarRadioButton,
    onChangeRadioButton,
    className,
}) => {
    return (
        <div className={className}>
            <RadioGruppe legend="Vilkår for vurdering om utenlandsopphold er oppfylt">
                <Radio
                    label={SvarType.Ja}
                    name={vurderinger[0].vilkårType}
                    onChange={onChangeRadioButton}
                    value={svarRadioButton}
                />
                <Radio label={SvarType.Nei} name={vurderinger[0].vilkårType} />
            </RadioGruppe>
        </div>
    );
};
export default MedlemskapVurdering;
