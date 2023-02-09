import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import {
    ITidligereInnvilgetVedtak,
    ITidligereVedtaksperioder,
} from '../../TidligereVedtaksperioder/typer';
import { Tooltip } from '@navikt/ds-react';
import { formatterBooleanEllerUkjent, mapTrueFalse } from '../../../../App/utils/formatter';
import { nonNull } from '../../../../App/utils/utils';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import TabellVisning from '../../Tabell/TabellVisning';
import { IVilkårRegistergrunnlag } from '../vilkår';

interface TidligereVedtaksperioderPåPartISak {
    fødselsnummer: string;
    navn: string;
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const unikeForeldre = (foreldre: TidligereVedtaksperioderPåPartISak[]) => {
    const unikeForeldre = foreldre.reduce(
        (acc, forelder) => ({
            ...acc,
            [forelder.fødselsnummer]: forelder,
        }),
        {} as Record<string, TidligereVedtaksperioderPåPartISak>
    );
    return Object.values(unikeForeldre);
};

const mapAndreForeldrerMedTidligereVedaksperioder = (
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[]
): TidligereVedtaksperioderPåPartISak[] => {
    const foreldre: (TidligereVedtaksperioderPåPartISak | null)[] = registergrunnlagNyttBarn
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
    if (!tidligereVedtak) return 'Ukjent';
    const { harTidligereOvergangsstønad, harTidligereBarnetilsyn, harTidligereSkolepenger } =
        tidligereVedtak;
    const harTidligereVedtak: boolean =
        harTidligereOvergangsstønad || harTidligereBarnetilsyn || harTidligereSkolepenger;
    return (
        <Tooltip
            content={`OS: ${mapTrueFalse(harTidligereOvergangsstønad)} BT: ${mapTrueFalse(
                harTidligereBarnetilsyn
            )} SP: ${mapTrueFalse(harTidligereSkolepenger)}`}
        >
            <BodyShortSmall>{mapTrueFalse(harTidligereVedtak)}</BodyShortSmall>
        </Tooltip>
    );
};

const mapSøker = (
    registergrunnlag: IVilkårRegistergrunnlag,
    tidligereVedtaksperioder: ITidligereVedtaksperioder
): TidligereVedtaksperioderPåPartISak | undefined => {
    const tidligereVedtakFinnesIkke =
        !tidligereVedtaksperioder.sak && !tidligereVedtaksperioder.infotrygd;
    if (tidligereVedtakFinnesIkke) {
        return undefined;
    }
    return {
        navn: `${registergrunnlag.navn.visningsnavn} (bruker)`,
        fødselsnummer: registergrunnlag.personIdent,
        tidligereVedtaksperioder: tidligereVedtaksperioder,
    };
};

const TidligereVedtaksperioderSøkerOgAndreForeldre: FC<{
    registergrunnlag: IVilkårRegistergrunnlag;
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[];
}> = ({ registergrunnlag, tidligereVedtaksperioder, registergrunnlagNyttBarn }) => {
    const søker = mapSøker(registergrunnlag, tidligereVedtaksperioder);
    const andreForeldrer = mapAndreForeldrerMedTidligereVedaksperioder(registergrunnlagNyttBarn);
    const verdier: TidligereVedtaksperioderPåPartISak[] = søker
        ? [søker, ...andreForeldrer]
        : andreForeldrer;
    if (verdier.length === 0) {
        return null;
    }
    return (
        <TabellVisning
            tittel={'Har brukeren eller annen forelder mottatt stønader etter kap. 15 før?'}
            ikonVisning={false}
            verdier={verdier}
            kolonner={[
                {
                    overskrift: 'Navn',
                    tekstVerdi: (d) => d.navn,
                },
                {
                    overskrift: 'EF Sak',
                    tekstVerdi: (d) => jaNeiMedToolTip(d.tidligereVedtaksperioder.sak),
                },
                {
                    overskrift: 'Infotrygd (EF VP)',
                    tekstVerdi: (d) => jaNeiMedToolTip(d.tidligereVedtaksperioder.infotrygd),
                },
                {
                    overskrift: 'Infotrygd (PE PP)',
                    tekstVerdi: (d) =>
                        formatterBooleanEllerUkjent(d.tidligereVedtaksperioder.historiskPensjon),
                },
            ]}
        />
    );
};

export default TidligereVedtaksperioderSøkerOgAndreForeldre;
