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
import TabellVisning from '../../Tabell/TabellVisning';
import { nonNull } from '../../../../App/utils/utils';

interface AnnenForelderMedTidligereVedtaksperioder {
    fødselsnummer: string;
    navn: string;
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const unikeForeldre = (foreldre: AnnenForelderMedTidligereVedtaksperioder[]) => {
    const unikeForeldre = foreldre.reduce((acc, forelder) => ({
        ...acc,
        [forelder.fødselsnummer]: forelder,
    }));
    return Object.values(unikeForeldre);
};

const mapAndreForeldrerMedTidligereVedaksperioder = (
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[]
): AnnenForelderMedTidligereVedtaksperioder[] => {
    const foreldre: (AnnenForelderMedTidligereVedtaksperioder | null)[] = registergrunnlagNyttBarn
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
            content={`OS: ${tidligereVedtak.harTidligereOvergangsstønad} BT: ${tidligereVedtak.harTidligereBarnetilsyn} SP: ${tidligereVedtak.harTidligereSkolepenger}`}
        >
            <Normaltekst>{mapTrueFalse(harTidligereVedtak)}</Normaltekst>
        </Tooltip>
    );
};

const AnnenForelderTidligereVedtaksperioder: FC<{
    registergrunnlagNyttBarn: RegistergrunnlagNyttBarn[];
}> = ({ registergrunnlagNyttBarn }) => {
    const andreForeldrer = mapAndreForeldrerMedTidligereVedaksperioder(registergrunnlagNyttBarn);

    if (andreForeldrer.length === 0) {
        return null;
    }

    return (
        <FlexDiv>
            <TabellVisning
                tittel={'Har brukeren eller annen forelder mottatt stønader etter kap. 15 før?'}
                verdier={andreForeldrer}
                kolonner={[
                    {
                        overskrift: 'Stønad',
                        tekstVerdi: (d) => d.navn,
                    },
                    {
                        overskrift: 'EF Sak',
                        tekstVerdi: (d) => jaNeiMedToolTip(d.tidligereVedtaksperioder.sak),
                    },
                    {
                        overskrift: 'Infotrygd',
                        tekstVerdi: (d) => jaNeiMedToolTip(d.tidligereVedtaksperioder.infotrygd),
                    },
                ]}
            />
        </FlexDiv>
    );
};

export default AnnenForelderTidligereVedtaksperioder;
