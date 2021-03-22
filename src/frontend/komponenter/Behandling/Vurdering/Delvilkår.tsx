import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import * as React from 'react';
import { FC } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { Regel } from './typer';
import { DelvilkårContainer } from '../../Felleskomponenter/Visning/StyledFormElements';
import {hjelpeTekstConfig} from "./hjelpetekstconfig";
import {delvilkårTypeTilTekst, svarTypeTilTekst} from "./tekster";
import {Vurdering} from "../Inngangsvilkår/vilkår";

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const Delvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const hjelpetekst = hjelpeTekstConfig[regel.regelId]
    return (
        <DelvilkårContainer>
            <RadioGruppe legend={delvilkårTypeTilTekst[regel.regelId]}>
                {Object.keys(regel.svarMapping).map((svarId) => (
                    <Radio
                        key={`${regel.regelId}_${svarId}`}
                        name={`${regel.regelId}_${svarId}`}
                        label={svarTypeTilTekst[svarId]}
                        value={svarId}
                        checked={svarId === vurdering.svar}
                        onChange={() =>
                            settVurdering({
                                svar: svarId,
                                regelId: regel.regelId,
                            })
                        }
                    />
                ))}
            </RadioGruppe>
            {hjelpetekst && (
                <Hjelpetekst type={PopoverOrientering.Under}>{React.createElement(hjelpetekst)}</Hjelpetekst>
            )}
        </DelvilkårContainer>
    );
};

export default Delvilkår;
