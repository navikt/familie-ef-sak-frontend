import React from 'react';
import {
    AktivitetsvilkårType,
    IVilkår,
    RegelIdDDokumentasjonUtdanning,
} from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { BodyLong, BodyShort, Detail, Heading } from '@navikt/ds-react';
import Søknad from '../../../../Felles/Ikoner/Søknad';
import { UtdanningsformTilTekst } from '../../Aktivitet/Aktivitet/typer';
import {
    formaterNullableIsoDato,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { utledVisningForStudiebelastning } from '../../Inngangsvilkår/utils';

type Props = {
    vilkår: IVilkår;
    behandling: Behandling;
};
export const SaksinformasjonSkolepenger: React.FC<Props> = ({ vilkår, behandling }) => {
    const utdanning = vilkår.grunnlag.aktivitet?.underUtdanning;
    const skalViseSøknadsinfo =
        !!utdanning && behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

    return (
        <FlexBoks>
            <GråBoks>
                <SøknadsinformajsonUtdanning
                    utdanning={utdanning}
                    skalViseSøknadsinfo={skalViseSøknadsinfo}
                />
                <SaksbehanldingsinformasjonUtdanning vilkår={vilkår} />
            </GråBoks>
            <GråBoks>
                <SøknadsinformajsonUtgifter
                    utdanning={utdanning}
                    skalViseSøknadsinfo={skalViseSøknadsinfo}
                />
                <SaksbehanldingsinformasjonUtgifter vilkår={vilkår} />
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

const HøyrestiltBodyShort = styled(BodyShort)`
    text-align: right;
    max-width: max-content;
    padding-left: 1.5rem;
`;

type SøknadsinfoProps = {
    utdanning?: IUnderUtdanning;
    skalViseSøknadsinfo: boolean;
};
const SøknadsinformajsonUtdanning: React.FC<SøknadsinfoProps> = ({
    utdanning,
    skalViseSøknadsinfo,
}) => {
    return utdanning && skalViseSøknadsinfo ? (
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
                <Søknad height={24} />
                <BodyShort>Studiebelastning</BodyShort>
                <BodyShort>{utledVisningForStudiebelastning(utdanning)}</BodyShort>
            </TokolonnersGrid>
        </div>
    ) : (
        <Detail>Ingen informasjon å vise</Detail>
    );
};

const SaksbehanldingsinformasjonUtdanning: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const begrunnelseDokumentasjonUtdanning = vilkår.vurderinger
        .find(
            (vurdering) => vurdering.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING
        )
        ?.delvilkårsvurderinger.flatMap((delvilkårsvurdering) => delvilkårsvurdering.vurderinger)
        ?.find(
            (vurdering) =>
                vurdering.regelId === RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTDANNING
        )?.begrunnelse;

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

const SaksbehanldingsinformasjonUtgifter: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const begrunnelseDokumentasjonUtgifterUtdanning = vilkår.vurderinger
        .find(
            (vurdering) => vurdering.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING
        )
        ?.delvilkårsvurderinger.flatMap((delvilkårsvurdering) => delvilkårsvurdering.vurderinger)
        ?.find(
            (vurdering) =>
                vurdering.regelId ===
                RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTGIFTER_UTDANNING
        )?.begrunnelse;

    return (
        <div style={{ order: 1 }}>
            <Heading spacing size="small">
                Saksbehandlers vurdering - Utgifter
            </Heading>
            {begrunnelseDokumentasjonUtgifterUtdanning ? (
                <BreakWordBody>{begrunnelseDokumentasjonUtgifterUtdanning}</BreakWordBody>
            ) : (
                <Detail>Ingen begrunnelse</Detail>
            )}
        </div>
    );
};

const SøknadsinformajsonUtgifter: React.FC<SøknadsinfoProps> = ({
    utdanning,
    skalViseSøknadsinfo,
}) => {
    return utdanning && skalViseSøknadsinfo ? (
        <div style={{ order: -1, paddingBottom: '4rem' }}>
            <Heading spacing size="small">
                Søknadsinformasjon - Utgifter
            </Heading>
            <TokolonnersGrid>
                <Søknad height={24} />
                <BodyShort>Semesteravgift</BodyShort>
                <HøyrestiltBodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.semesteravgift)}
                </HøyrestiltBodyShort>
                <Søknad height={24} />
                <BodyShort>Studieavgift</BodyShort>
                <HøyrestiltBodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.studieavgift)}
                </HøyrestiltBodyShort>
                <Søknad height={24} />
                <BodyShort>Eksamemensgebyr</BodyShort>
                <HøyrestiltBodyShort>
                    {formaterTallMedTusenSkilleEllerStrek(utdanning.eksamensgebyr)}
                </HøyrestiltBodyShort>
            </TokolonnersGrid>
        </div>
    ) : (
        <Detail>Ingen informasjon å vise</Detail>
    );
};
