import {
    useBehandlingVilkårContext,
    useBehandlingVilkårDispatch,
    actions,
} from './BehandleVilkårProvider';
import { RadioPanelGruppe, SkjemaGruppe, TextareaControlled } from 'nav-frontend-skjema';
import React from 'react';
import { VedtakResultat } from '../../../typer/fagsak';
import { Valideringsstatus } from '../../../typer/felt';

interface IBehandlingVilkårSkjema {
    opprettelseFeilmelding: string;
    visFeilmeldinger: boolean;
}

const BehandlingVilkårSkjema: React.FunctionComponent<IBehandlingVilkårSkjema> = ({
    opprettelseFeilmelding,
    visFeilmeldinger,
}) => {
    const context = useBehandlingVilkårContext();
    const dispatch = useBehandlingVilkårDispatch();

    return (
        <SkjemaGruppe
            className={'vilkår__skjemagruppe'}
            feil={
                visFeilmeldinger && opprettelseFeilmelding !== ''
                    ? opprettelseFeilmelding
                    : undefined
            }
        >
            <RadioPanelGruppe
                name="vedtakresultat"
                legend="Vilkår for barnetrygd"
                radios={[
                    {
                        label: 'Vilkårene er oppfylt',
                        value: 'INNVILGET',
                        id: 'INNVILGET',
                        checked: context.vedtakResultat === VedtakResultat.INNVILGET,
                    },
                    {
                        label: 'Vilkårene er ikke oppfylt',
                        value: 'AVSLÅTT',
                        id: 'AVSLÅTT',
                        checked: context.vedtakResultat === VedtakResultat.AVSLÅTT,
                    },
                ]}
                onChange={(event: any) => {
                    dispatch({
                        payload: event.target.value,
                        type: actions.SETT_RESULTAT,
                    });
                }}
                feil={
                    visFeilmeldinger && !context.vedtakResultat && 'Du må velge et vedtaksresultat'
                }
            />
            <br />

            <TextareaControlled
                label={'Begrunnelse'}
                maxLength={0}
                textareaClass={'vilkår__skjemagruppe--begrunnelse'}
                placeholder={'Begrunn vurderingen din'}
                defaultValue={context.begrunnelse.verdi}
                value={context.begrunnelse.verdi}
                onBlur={(evt: any) => {
                    dispatch({
                        type: actions.SETT_BEGRUNNELSE,
                        payload: evt.target.value,
                    });
                }}
                feil={
                    context.begrunnelse.valideringsstatus !== Valideringsstatus.OK &&
                    visFeilmeldinger &&
                    context.begrunnelse.feilmelding
                        ? context.begrunnelse.feilmelding
                        : undefined
                }
            />
        </SkjemaGruppe>
    );
};

export default BehandlingVilkårSkjema;
