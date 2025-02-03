import React, { useEffect, useState } from 'react';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårPropsMedBehandling } from '../vilkårprops';
import { InngangsvilkårType } from '../vilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useApp } from '../../../../App/context/AppContext';
import { IBarnMedLøpendeStønad } from './typer';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { SamværKalkulator } from '../../../../Felles/Kalkulator/SamværKalkulator';
import styled from 'styled-components';
import { AGray300, AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { Button, HStack } from '@navikt/ds-react';
import { CalculatorIcon } from '@navikt/aksel-icons';

const Samværskalkulator = styled(SamværKalkulator)`
    padding: 1rem;
    background-color: white;
    border: 1rem solid ${AGray50};
`;

const StyledHStack = styled(HStack)<{ $borderBottom: boolean }>`
    border-bottom: ${(props) => (props.$borderBottom ? `1px solid ${AGray300}` : 'none')};
`;

const Divider = styled.div`
    margin: 1rem;
    border-bottom: 1px solid ${AGray300};
`;

export const Aleneomsorg: React.FC<VilkårPropsMedBehandling> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
    behandling,
}) => {
    const [skalViseSamværskalkulatorPåBarn, settSkalViseSamværskalkulatorPåBarn] = useState<
        Set<string>
    >(new Set());
    const [barnMedLøpendeStønad, settBarnMedLøpendeStønad] =
        useState<Ressurs<IBarnMedLøpendeStønad>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (behandling.stønadstype === Stønadstype.BARNETILSYN) {
            axiosRequest<IBarnMedLøpendeStønad, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/tilkjentytelse/barn/${behandling.id}`,
            }).then((respons: Ressurs<IBarnMedLøpendeStønad>) => {
                settBarnMedLøpendeStønad(respons);
            });
        }
    }, [axiosRequest, behandling.stønadstype, behandling.id, settBarnMedLøpendeStønad]);

    const vilkårsresultatAleneomsorg = vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusForBarn(vilkårsresultatAleneomsorg);

    const lukkSamværskalkulatorForBarn = (barnId: string) => {
        const kopi = new Set(skalViseSamværskalkulatorPåBarn);
        kopi.delete(barnId);
        settSkalViseSamværskalkulatorPåBarn(kopi);
    };

    return (
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Aleneomsorg"
            vilkårsresultat={utleddResultat}
            vilkår={InngangsvilkårType.ALENEOMSORG}
        >
            {grunnlag.barnMedSamvær.map((barn, indeks) => {
                const vurdering = vurderinger.find(
                    (v) =>
                        v.barnId === barn.barnId && v.vilkårType === InngangsvilkårType.ALENEOMSORG
                );
                if (!vurdering) return null;

                const erSisteBarn = indeks === grunnlag.barnMedSamvær.length - 1;

                const skalViseBorderBottom =
                    indeks !== grunnlag.barnMedSamvær.length - 1 &&
                    grunnlag.barnMedSamvær.length > 1;

                return (
                    <React.Fragment key={barn.barnId}>
                        <VilkårpanelInnhold>
                            {{
                                venstre: (
                                    <>
                                        <AleneomsorgInfo
                                            gjeldendeBarn={barn}
                                            skalViseSøknadsdata={skalViseSøknadsdata}
                                            barnMedLøpendeStønad={barnMedLøpendeStønad}
                                            stønadstype={behandling.stønadstype}
                                            personalia={grunnlag.personalia}
                                        />
                                        {erSisteBarn && skalViseSøknadsdata && (
                                            <>
                                                <DokumentasjonSendtInn
                                                    dokumentasjon={
                                                        grunnlag.dokumentasjon?.avtaleOmDeltBosted
                                                    }
                                                    tittel={'Avtale om delt fast bosted'}
                                                />
                                                <DokumentasjonSendtInn
                                                    dokumentasjon={
                                                        grunnlag.dokumentasjon
                                                            ?.skalBarnetBoHosSøkerMenAnnenForelderSamarbeiderIkke
                                                    }
                                                    tittel={
                                                        'Dokumentasjon som viser at barnet bor hos deg'
                                                    }
                                                />
                                                <DokumentasjonSendtInn
                                                    dokumentasjon={
                                                        grunnlag.dokumentasjon?.samværsavtale
                                                    }
                                                    tittel={'Samværsavtale'}
                                                />
                                            </>
                                        )}
                                    </>
                                ),
                                høyre: (
                                    <VisEllerEndreVurdering
                                        key={vurdering.id}
                                        ikkeVurderVilkår={ikkeVurderVilkår}
                                        vurdering={vurdering}
                                        feilmelding={feilmeldinger[vurdering.id]}
                                        lagreVurdering={lagreVurdering}
                                        nullstillVurdering={nullstillVurdering}
                                    />
                                ),
                            }}
                        </VilkårpanelInnhold>
                        {skalViseSamværskalkulatorPåBarn.has(barn.barnId) ? (
                            <>
                                <Samværskalkulator
                                    onClose={() => lukkSamværskalkulatorForBarn(barn.barnId)}
                                />
                                {skalViseBorderBottom && <Divider />}
                            </>
                        ) : (
                            <StyledHStack
                                $borderBottom={skalViseBorderBottom}
                                justify="end"
                                margin="4"
                                padding="4"
                            >
                                <Button
                                    type="button"
                                    size="small"
                                    onClick={() =>
                                        settSkalViseSamværskalkulatorPåBarn(
                                            new Set(skalViseSamværskalkulatorPåBarn).add(
                                                barn.barnId
                                            )
                                        )
                                    }
                                >
                                    <CalculatorIcon aria-hidden fontSize="1.5rem" />
                                </Button>
                            </StyledHStack>
                        )}
                    </React.Fragment>
                );
            })}
        </Vilkårpanel>
    );
};
