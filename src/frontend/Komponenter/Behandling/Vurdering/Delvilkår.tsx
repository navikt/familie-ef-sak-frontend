import * as React from 'react';
import { FC } from 'react';
import { Regel } from './typer';
import { DelvilkårContainer } from './DelvilkårContainer';
import { hjelpeTekstConfig } from './hjelpetekstconfig';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from './tekster';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { HelpText, Radio, RadioGroup } from '@navikt/ds-react';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const Delvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const hjelpetekst = hjelpeTekstConfig[regel.regelId];
    return (
        <DelvilkårContainer>
            <RadioGroup legend={delvilkårTypeTilTekst[regel.regelId]} value={vurdering.svar}>
                {Object.keys(regel.svarMapping).map((svarId) => (
                    <Radio
                        key={`${regel.regelId}_${svarId}`}
                        name={`${regel.regelId}_${svarId}`}
                        value={svarId}
                        onChange={() =>
                            settVurdering({
                                svar: svarId,
                                regelId: regel.regelId,
                            })
                        }
                    >
                        {svarTypeTilTekst[svarId]}
                    </Radio>
                ))}
            </RadioGroup>
            {hjelpetekst && (
                <HelpText placement={hjelpetekst.plassering}>
                    {React.createElement(hjelpetekst.komponent)}
                </HelpText>
            )}
        </DelvilkårContainer>
    );
};

export default Delvilkår;
