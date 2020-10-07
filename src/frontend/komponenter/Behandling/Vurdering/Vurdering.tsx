import * as React from 'react';
import { ChangeEvent, FC, useState } from 'react';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    VilkårResultat,
    vilkårsResultatTypeTilTekst,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

const StyledVurdering = styled.div`
    > div,
    button {
        margin-top: 15px;
    }
`;

type Config = {
    vilkår: string;
    unntak?: UnntakType[];
};
type IVurderingConfig = {
    [key in VilkårType]: Config;
};
const VurderingConfig: IVurderingConfig = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkår: 'Vilkår for vurdering om utenlandsopphold er oppfylt',
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
        ],
    },
};

interface Props {
    vurdering: IVurdering;
    className?: string;
    onChangeRadioButton?: (valgtSvar: ChangeEvent<HTMLInputElement>) => void;
}
const Vurdering: FC<Props> = ({ vurdering, className }) => {
    const config = VurderingConfig[vurdering.vilkårType];
    const [vurderingState, setVurderingState] = useState<IVurdering>(vurdering);
    {
        /* TODO propagerare opp? */
    }
    return (
        <StyledVurdering className={className}>
            {/* TODO lagret/ikke lagret */}
            <RadioGruppe legend={config.vilkår}>
                {/* TODO Kanskje? */}
                {[VilkårResultat.JA, VilkårResultat.NEI].map((vilkårResultat) => (
                    <Radio
                        key={vilkårResultat}
                        label={vilkårsResultatTypeTilTekst[vilkårResultat]}
                        name={vurderingState.vilkårType}
                        onChange={() => {
                            setVurderingState({
                                ...vurderingState,
                                resultat: vilkårResultat,
                            });
                        }}
                        value={vilkårResultat}
                        checked={vurderingState.resultat === vilkårResultat}
                    />
                ))}
            </RadioGruppe>
            {config.unntak && (
                <Select
                    label="Unntak"
                    value={vurderingState.unntak || undefined}
                    onChange={(e) => {
                        setVurderingState({
                            ...vurderingState,
                            unntak: e.target.value,
                        });
                    }}
                >
                    <option value={undefined}>Velg...</option>
                    {config.unntak.map((unntak) => (
                        <option key={unntak} value={unntak}>
                            {unntakTypeTilTekst[unntak]}
                        </option>
                    ))}
                </Select>
            )}
            <Textarea
                label="Begrunnelse"
                maxLength={0}
                placeholder="Skriv inn tekst"
                value={vurderingState.begrunnelse || ''}
                onChange={(e) => {
                    setVurderingState({
                        ...vurderingState,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            <Hovedknapp>Lagre</Hovedknapp>
        </StyledVurdering>
    );
};
export default Vurdering;
