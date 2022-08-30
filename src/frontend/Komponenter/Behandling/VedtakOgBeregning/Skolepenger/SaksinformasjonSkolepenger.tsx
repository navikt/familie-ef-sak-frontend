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
import { formaterNullableIsoDato, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import {
    utledBegrunnelseFraVilkårOgRegel,
    utledVisningForStudiebelastning,
} from '../../Inngangsvilkår/utils';

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

const BreakWordBody = styled(BodyLong)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const HøyrestiltBodyShort = styled(BodyShort)`
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
                    <BodyShort size={'small'}>Skole/utdanningssted</BodyShort>
                    <BodyShort size={'small'}>{utdanning.skoleUtdanningssted}</BodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Linje/kurs/grad</BodyShort>
                    <BodyShort size={'small'}>{utdanning.linjeKursGrad}</BodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Utdanningstype</BodyShort>
                    <BodyShort size={'small'}>
                        {UtdanningsformTilTekst[utdanning.offentligEllerPrivat]}
                    </BodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Studieperiode</BodyShort>
                    <BodyShort size={'small'}>{`${formaterNullableIsoDato(
                        utdanning.fra
                    )} - ${formaterNullableIsoDato(utdanning.til)}`}</BodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Studiebelastning</BodyShort>
                    <BodyShort size={'small'}>
                        {utledVisningForStudiebelastning(utdanning)}
                    </BodyShort>
                </TokolonnersGrid>
            ) : (
                <Detail>Ingen informasjon å vise</Detail>
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
                <Detail>Ingen begrunnelse</Detail>
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
                <Detail>Ingen begrunnelse</Detail>
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
                    <BodyShort size={'small'}>Semesteravgift</BodyShort>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.semesteravgift)}
                    </HøyrestiltBodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Studieavgift</BodyShort>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.studieavgift)}
                    </HøyrestiltBodyShort>
                    <Søknad height={20} />
                    <BodyShort size={'small'}>Eksamemensgebyr</BodyShort>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.eksamensgebyr)}
                    </HøyrestiltBodyShort>
                </TokolonnersGrid>
            ) : (
                <Detail>Ingen informasjon å vise</Detail>
            )}
        </div>
    );
};
