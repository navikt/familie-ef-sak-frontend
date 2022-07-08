import React from 'react';
import { AktivitetsvilkårType, IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { BodyLong, BodyShort, Detail, Heading } from '@navikt/ds-react';
import Søknad from '../../../../Felles/Ikoner/Søknad';
import { UtdanningsformTilTekst } from '../../Aktivitet/Aktivitet/typer';
import {
    formaterNullableIsoDato,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';

type Props = {
    vilkår: IVilkår;
};
export const SøknadsinformasjonSkolepenger: React.FC<Props> = ({ vilkår }) => {
    const utdanning = vilkår.grunnlag.aktivitet?.underUtdanning;

    return (
        <FlexBoks>
            <GråBoks>
                <SøknadsinformajsonUtdanning utdanning={utdanning} />
                <SaksbehanldingsinformasjonUtdanning vilkår={vilkår} />
            </GråBoks>
            <GråBoks>
                <SøknadsinformajsonUtgifter utdanning={utdanning} />
                <SaksbehanldingsinformasjonUtdanning vilkår={vilkår} />
            </GråBoks>
        </FlexBoks>
    );
};

const FlexBoks = styled.div`
    height: max-content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const GråBoks = styled.div`
    background-color: #e5e5e5;
    max-width: 750px;
    min-width: 400px;
    padding: 1rem;
    margin: 2rem 0 1rem 2rem;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    &:before {
        content: '';
        border: 0.5px solid #d3d3d3;
        align-self: stretch;
    }
`;

const TokolonnersGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5rem 3fr 5fr;
    gap: 0.5rem;
`;

const BreakWordBody = styled(BodyLong)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const SøknadsinformajsonUtdanning: React.FC<{ utdanning?: IUnderUtdanning }> = ({ utdanning }) => {
    return utdanning ? (
        <div style={{ order: -1 }}>
            <Heading spacing size="small">
                Søknadsinformasjon - Utdanning
            </Heading>
            <TokolonnersGrid>
                <Søknad height={24} />
                <BodyShort>Skole/utdanningssted</BodyShort>
                <BodyShort>{utdanning.skoleUtdanningssted}</BodyShort>
                <Søknad height={24} />
                <BodyShort>Linje/kurs/grad</BodyShort>
                <BodyShort>{utdanning.linjeKursGrad}</BodyShort>
                <Søknad height={24} />
                <BodyShort>Utdanningstype</BodyShort>
                <BodyShort>{UtdanningsformTilTekst[utdanning.offentligEllerPrivat]}</BodyShort>
                <Søknad height={24} />
                <BodyShort>Studieperiode</BodyShort>
                <BodyShort>{`${formaterNullableIsoDato(utdanning.fra)} - ${formaterNullableIsoDato(
                    utdanning.til
                )}`}</BodyShort>
            </TokolonnersGrid>
        </div>
    ) : (
        <Detail>Ingen informasjon å vise</Detail>
    );
};

const SaksbehanldingsinformasjonUtdanning: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const begrunnelseDokumentasjonUtdanning = vilkår.vurderinger.find(
        (vurdering) => vurdering.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING
    )?.delvilkårsvurderinger[0].vurderinger[0].begrunnelse;

    return (
        <div style={{ order: 1 }}>
            <Heading spacing size="small">
                Saksbehandlers vurdering - Utdanning
            </Heading>
            {begrunnelseDokumentasjonUtdanning ? (
                <BreakWordBody>{begrunnelseDokumentasjonUtdanning}</BreakWordBody>
            ) : (
                <Detail>Ingen begrunnelse</Detail>
            )}
        </div>
    );
};

const SøknadsinformajsonUtgifter: React.FC<{ utdanning?: IUnderUtdanning }> = ({ utdanning }) => {
    return utdanning ? (
        <div style={{ order: -1, paddingBottom: '2rem' }}>
            <Heading spacing size="small">
                Søknadsinformasjon - Utdanning
            </Heading>
            <TokolonnersGrid>
                <Søknad height={24} />
                <BodyShort>Semesteravgift</BodyShort>
                <BodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.semesteravgift)}
                </BodyShort>
                <Søknad height={24} />
                <BodyShort>Studieavgift</BodyShort>
                <BodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.studieavgift)}
                </BodyShort>
                <Søknad height={24} />
                <BodyShort>Eksamemensgebyr</BodyShort>
                <BodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.eksamensgebyr)}
                </BodyShort>
            </TokolonnersGrid>
        </div>
    ) : (
        <Detail>Ingen informasjon å vise</Detail>
    );
};
