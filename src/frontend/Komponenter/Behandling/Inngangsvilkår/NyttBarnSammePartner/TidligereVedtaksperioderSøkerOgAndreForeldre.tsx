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
import { IPersonalia } from '../vilkår';
import { LenkeTilPersonopplysningsside } from '../../../../Felles/Lenker/LenkeTilPersonopplysningsside';

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
    personalia: IPersonalia,
    tidligereVedtaksperioder: ITidligereVedtaksperioder
): TidligereVedtaksperioderPåPartISak | undefined => {
    const tidligereVedtakFinnesIkke =
        !tidligereVedtaksperioder.sak && !tidligereVedtaksperioder.infotrygd;
    if (tidligereVedtakFinnesIkke) {
        return undefined;
    }
    return {
        navn: `${personalia.navn.visningsnavn} (bruker)`,
        fødselsnummer: personalia.personIdent,
        tidligereVedtaksperioder: tidligereVedtaksperioder,
    };
};

const TidligereVedtaksperioderSøkerOgAndreForeldre: FC<{
    personalia: IPersonalia;
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[];
}> = ({ personalia, tidligereVedtaksperioder, registergrunnlagNyttBarn }) => {
    const søker = mapSøker(personalia, tidligereVedtaksperioder);
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
                    tekstVerdi: (d) =>
                        d.fødselsnummer === søker?.fødselsnummer ? (
                            d.navn
                        ) : (
                            <LenkeTilPersonopplysningsside personIdent={d.fødselsnummer}>
                                {d.navn}
                            </LenkeTilPersonopplysningsside>
                        ),
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
