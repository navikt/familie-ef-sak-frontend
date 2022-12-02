import React from 'react';
import {
    AktivitetsvilkårType,
    IVilkår,
    RegelIdDDokumentasjonUtdanning,
} from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import Søknad from '../../../../Felles/Ikoner/Søknad';
import { UtdanningsformTilTekst } from '../../Aktivitet/Aktivitet/typer';
import { formaterNullableIsoDato, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import {
    utledBegrunnelseFraVilkårOgRegel,
    utledVisningForStudiebelastning,
} from '../../Inngangsvilkår/utils';
import {
    BodyLongSmall,
    BodyShortSmall,
    DetailSmall,
} from '../../../../Felles/Visningskomponenter/Tekster';

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

const TokolonnersGrid = styled.div<{ paddingBottom?: number }>`
    display: grid;
    grid-template-columns: 1.2rem 3fr 5fr;
    gap: 0.5rem;
    padding-bottom: ${(props) => props.paddingBottom}rem;
`;

const BreakWordBody = styled(BodyLongSmall)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const HøyrestiltBodyShort = styled(BodyShortSmall)`
    text-align: right;
    width: 5rem;
`;

type SøknadsinfoProps = {
    utdanning?: IUnderUtdanning;
    skalViseSøknadsinfo: boolean;
};
const SøknadsinformajsonUtdanning: React.FC<SøknadsinfoProps> = ({
    utdanning,
    skalViseSøknadsinfo,
}) => {
    return (
        <div style={{ order: -1 }}>
            <Heading spacing size="small">
                Søknadsinformasjon - Utdanning
            </Heading>
            {utdanning && skalViseSøknadsinfo ? (
                <TokolonnersGrid>
                    <Søknad height={20} />
                    <BodyShortSmall>Skole/utdanningssted</BodyShortSmall>
                    <BodyShortSmall>{utdanning.skoleUtdanningssted}</BodyShortSmall>
                    <Søknad height={20} />
                    <BodyShortSmall>Linje/kurs/grad</BodyShortSmall>
                    <BodyShortSmall>{utdanning.linjeKursGrad}</BodyShortSmall>
                    <Søknad height={20} />
                    <BodyShortSmall>Utdanningstype</BodyShortSmall>
                    <BodyShortSmall>
                        {UtdanningsformTilTekst[utdanning.offentligEllerPrivat]}
                    </BodyShortSmall>
                    <Søknad height={20} />
                    <BodyShortSmall>Studieperiode</BodyShortSmall>
                    <BodyShortSmall>{`${formaterNullableIsoDato(
                        utdanning.fra
                    )} - ${formaterNullableIsoDato(utdanning.til)}`}</BodyShortSmall>
                    <Søknad height={20} />
                    <BodyShortSmall>Studiebelastning</BodyShortSmall>
                    <BodyShortSmall>{utledVisningForStudiebelastning(utdanning)}</BodyShortSmall>
                </TokolonnersGrid>
            ) : (
                <DetailSmall>Ingen informasjon å vise</DetailSmall>
            )}
        </div>
    );
};

const SaksbehanldingsinformasjonUtdanning: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const begrunnelseDokumentasjonUtdanning = utledBegrunnelseFraVilkårOgRegel(
        vilkår.vurderinger,
        AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING,
        RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTDANNING
    );

    return (
        <div style={{ order: 1 }}>
            <Heading spacing size="small">
                Saksbehandlers vurdering - Utdanning
            </Heading>
            {begrunnelseDokumentasjonUtdanning ? (
                <BreakWordBody>{begrunnelseDokumentasjonUtdanning}</BreakWordBody>
            ) : (
                <DetailSmall>Ingen begrunnelse</DetailSmall>
            )}
        </div>
    );
};

const SaksbehanldingsinformasjonUtgifter: React.FC<{ vilkår: IVilkår }> = ({ vilkår }) => {
    const begrunnelseDokumentasjonUtgifterUtdanning = utledBegrunnelseFraVilkårOgRegel(
        vilkår.vurderinger,
        AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING,
        RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTGIFTER_UTDANNING
    );

    return (
        <div style={{ order: 1 }}>
            <Heading spacing size="small">
                Saksbehandlers vurdering - Utgifter
            </Heading>
            {begrunnelseDokumentasjonUtgifterUtdanning ? (
                <BreakWordBody>{begrunnelseDokumentasjonUtgifterUtdanning}</BreakWordBody>
            ) : (
                <DetailSmall>Ingen begrunnelse</DetailSmall>
            )}
        </div>
    );
};

const SøknadsinformajsonUtgifter: React.FC<SøknadsinfoProps> = ({
    utdanning,
    skalViseSøknadsinfo,
}) => {
    return (
        <div style={{ order: -1 }}>
            <Heading spacing size="small">
                Søknadsinformasjon - Utgifter
            </Heading>
            {utdanning && skalViseSøknadsinfo ? (
                <TokolonnersGrid paddingBottom={2.8}>
                    <Søknad height={20} />
                    <BodyShortSmall>Semesteravgift</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.semesteravgift)}
                    </HøyrestiltBodyShort>
                    <Søknad height={20} />
                    <BodyShortSmall>Studieavgift</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.studieavgift)}
                    </HøyrestiltBodyShort>
                    <Søknad height={20} />
                    <BodyShortSmall>Eksamemensgebyr</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.eksamensgebyr)}
                    </HøyrestiltBodyShort>
                </TokolonnersGrid>
            ) : (
                <DetailSmall>Ingen informasjon å vise</DetailSmall>
            )}
        </div>
    );
};
