import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { nåværendeÅrOgMånedFormatert } from '../../../App/utils/formatter';
import React from 'react';
import { ISanksjonereVedtakForOvergangsstønad } from '../../../App/typer/vedtak';

interface Props {
    sanksjonertVedtak: ISanksjonereVedtakForOvergangsstønad | undefined;
}

const Sanksjonsperiode: React.FC<Props> = ({ sanksjonertVedtak }) => {
    if (!sanksjonertVedtak) {
        return <></>;
    }

    return (
        <>
            <Heading size={'small'} level={'3'}>
                Sanksjonsperiode
            </Heading>
            <BodyShortSmall>
                Måneden for sanksjon er{' '}
                <b>{nåværendeÅrOgMånedFormatert(sanksjonertVedtak.periode.årMånedFra)}</b> som er
                måneden etter dette vedtaket. Bruker vil ikke få utbetalt stønad i denne perioden.
            </BodyShortSmall>
        </>
    );
};

export default Sanksjonsperiode;
