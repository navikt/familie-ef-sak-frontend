import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import {
    ITidligereInnvilgetVedtak,
    ITidligereVedtaksperioder,
} from '../../TidligereVedtaksperioder/typer';
import { Normaltekst } from 'nav-frontend-typografi';
import { Tooltip } from '@navikt/ds-react';
import { mapTrueFalse } from '../../../../App/utils/formatter';
import TabellVisning, { TabellIkon } from '../../Tabell/TabellVisning';
import { nonNull } from '../../../../App/utils/utils';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../../../App/typer/personopplysninger';

interface AnnenForelderTidligereVedtaksperioder {
    fødselsnummer: string;
    navn: string;
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const unikeForeldre = (foreldre: AnnenForelderTidligereVedtaksperioder[]) => {
    const unikeForeldre = foreldre.reduce(
        (acc, forelder) => ({
            ...acc,
            [forelder.fødselsnummer]: forelder,
        }),
        {} as Record<string, AnnenForelderTidligereVedtaksperioder>
    );
    return Object.values(unikeForeldre);
};

const mapAndreForeldrerMedTidligereVedaksperioder = (
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[]
): AnnenForelderTidligereVedtaksperioder[] => {
    const foreldre: (AnnenForelderTidligereVedtaksperioder | null)[] = registergrunnlagNyttBarn
        .map((barn) => barn.annenForelderRegister)
        .map((forelder) => {
            return forelder?.fødselsnummer && forelder.tidligereVedtaksperioder
                ? {
                      fødselsnummer: forelder.fødselsnummer,
                      // En person med fødselsnummer burde ha navn
                      navn: forelder.navn ?? '',
                      tidligereVedtaksperioder: forelder.tidligereVedtaksperioder,
                  }
                : null;
        });

    return unikeForeldre(nonNull(foreldre));
};

const jaNeiMedToolTip = (tidligereVedtak: ITidligereInnvilgetVedtak | undefined) => {
    if (!tidligereVedtak) return null;
    const { harTidligereOvergangsstønad, harTidligereBarnetilsyn, harTidligereSkolepenger } =
        tidligereVedtak;
    const harTidligereVedtak: boolean =
        harTidligereOvergangsstønad || harTidligereBarnetilsyn || harTidligereSkolepenger;
    return (
        <Tooltip
            content={`OS: ${harTidligereOvergangsstønad} BT: ${harTidligereBarnetilsyn} SP: ${harTidligereSkolepenger}`}
        >
            <Normaltekst>{mapTrueFalse(harTidligereVedtak)}</Normaltekst>
        </Tooltip>
    );
};

const mapSøker = (
    personopplysninger: IPersonopplysninger,
    tidligereVedtaksperioder: ITidligereVedtaksperioder
): AnnenForelderTidligereVedtaksperioder | undefined => {
    const tidligereVedtakFinnesIkke =
        !tidligereVedtaksperioder.sak && !tidligereVedtaksperioder.infotrygd;
    if (tidligereVedtakFinnesIkke) {
        return undefined;
    }
    return {
        navn: `${personopplysninger.navn.visningsnavn} (bruker)`,
        fødselsnummer: personopplysninger.personIdent,
        tidligereVedtaksperioder: tidligereVedtaksperioder,
    };
};

const TidligereVedtaksperioderSøkerOgAndreForeldre: FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[];
}> = ({ tidligereVedtaksperioder, registergrunnlagNyttBarn }) => {
    const { personopplysningerResponse } = useBehandling();

    return (
        <DataViewer response={{ personopplysningerResponse }}>
            {({ personopplysningerResponse: personopplysninger }) => {
                const søker = mapSøker(personopplysninger, tidligereVedtaksperioder);
                const andreForeldrer =
                    mapAndreForeldrerMedTidligereVedaksperioder(registergrunnlagNyttBarn);
                const verdier: AnnenForelderTidligereVedtaksperioder[] = søker
                    ? [søker, ...andreForeldrer]
                    : andreForeldrer;
                if (verdier.length === 0) {
                    return null;
                }
                return (
                    <FlexDiv>
                        <TabellVisning
                            ikon={TabellIkon.REGISTER}
                            tittel={
                                'Har brukeren eller annen forelder mottatt stønader etter kap. 15 før?'
                            }
                            verdier={verdier}
                            kolonner={[
                                {
                                    overskrift: 'Stønad',
                                    tekstVerdi: (d) => d.navn,
                                },
                                {
                                    overskrift: 'EF Sak',
                                    tekstVerdi: (d) =>
                                        jaNeiMedToolTip(d.tidligereVedtaksperioder.sak),
                                },
                                {
                                    overskrift: 'Infotrygd',
                                    underskrift: '(inkluderer kun EF VP, ikke PE PP)',
                                    tekstVerdi: (d) =>
                                        jaNeiMedToolTip(d.tidligereVedtaksperioder.infotrygd),
                                },
                            ]}
                        />
                    </FlexDiv>
                );
            }}
        </DataViewer>
    );
};

export default TidligereVedtaksperioderSøkerOgAndreForeldre;
