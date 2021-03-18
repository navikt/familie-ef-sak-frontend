import { VurderingProps } from '../../Vurdering/VurderingProps';
import React, { ReactNode } from 'react';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';
import Delvilkår from '../../Vurdering/Delvilkår';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import {
    DelvilkårType,
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
} from '../../Inngangsvilkår/vilkår';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { RadioContainer } from '../../../Felleskomponenter/Visning/StyledFormElements';
import { Normaltekst } from 'nav-frontend-typografi';

const hjelpetekstRimeligGrunn = (
    <>
        <Normaltekst>
            Arbeid som er til hinder for omsorgen for barn, som for eksempel overveiende nattarbeid,
            arbeid som forutsetter lange fraværsperioder eller lang reisevei, kan anses som rimelig
            grunn til å avslutte et arbeidsforhold. Det samme gjelder dersom arbeidsforholdet er
            lønnet under tariff eller sedvane, eller dersom omfanget av arbeidet var så lite at det
            i svært liten grad bidro til selvforsørgelse.
        </Normaltekst>
        <br />
        <Normaltekst>
            Søker bør fortsatt ha rett til å avslutte et arbeidsforhold for å gå over i et nytt,
            eller redusere arbeidstiden, jf. krav til omfanget av aktivitetsplikten.
        </Normaltekst>
    </>
);

const SagtOppEllerRedusertVurdering: React.FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled, config } = props;

    const sagtOppEllerRedusertDelvilkår = vurdering.delvilkårsvurderinger.find(
        (dellvilkår) => dellvilkår.type === DelvilkårType.SAGT_OPP_ELLER_REDUSERT
    );

    const rimeligGrunnUnntak = config.unntak.find(
        (unntak) => unntak === UnntakType.RIMELIG_GRUNN_SAGT_OPP
    );

    if (sagtOppEllerRedusertDelvilkår === undefined) {
        return null;
    }

    const visUnntak = sagtOppEllerRedusertDelvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT;
    const visLagreKnapp =
        sagtOppEllerRedusertDelvilkår.resultat === Vilkårsresultat.OPPFYLT ||
        (vurdering.unntak && vurdering.begrunnelse);
    const begrunnelsePåkrevd =
        sagtOppEllerRedusertDelvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT;
    return (
        <>
            <KomponentGruppe key={sagtOppEllerRedusertDelvilkår.type}>
                <Delvilkår
                    key={sagtOppEllerRedusertDelvilkår.type}
                    delvilkår={sagtOppEllerRedusertDelvilkår}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                />
            </KomponentGruppe>
            {visUnntak && rimeligGrunnUnntak && (
                <RimeligGrunnUnntak
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={rimeligGrunnUnntak}
                />
            )}
            <Begrunnelse
                label={begrunnelsePåkrevd ? 'Begrunnelse' : 'Begrunnelse (valgfritt)'}
                value={vurdering.begrunnelse || ''}
                onChange={(e) => {
                    settVurdering({
                        ...vurdering,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            {visLagreKnapp && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};

interface EnkeltUnntakProps {
    unntak: UnntakType;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
    hjelpetekst?: ReactNode;
}

const RimeligGrunnUnntak: React.FC<EnkeltUnntakProps> = (props) => {
    const { vurdering, unntak, settVurdering } = props;
    return (
        <RadioContainer>
            <RadioGruppe key={vurdering.id} legend={unntakTypeTilTekst[unntak]}>
                {[Vilkårsresultat.OPPFYLT, Vilkårsresultat.IKKE_OPPFYLT].map((resultat) => {
                    return (
                        <Radio
                            key={resultat}
                            label={vilkårsresultatTypeTilTekst[resultat]}
                            name={unntak}
                            onChange={() => {
                                settVurdering({
                                    ...vurdering,
                                    unntak,
                                    resultat,
                                });
                            }}
                        />
                    );
                })}
            </RadioGruppe>
            <Hjelpetekst type={PopoverOrientering.OverHoyre}>{hjelpetekstRimeligGrunn}</Hjelpetekst>
            )
        </RadioContainer>
    );
};

export default SagtOppEllerRedusertVurdering;
