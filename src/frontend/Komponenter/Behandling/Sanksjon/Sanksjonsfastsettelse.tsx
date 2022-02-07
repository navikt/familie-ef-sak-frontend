import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Select, Textarea } from 'nav-frontend-skjema';
import {
    sanksjonAdvarsel,
    sanksjonInfo,
    Sanksjonsårsak,
    sanksjonsårsaker,
    sanksjonsårsakTilTekst,
} from '../../../App/typer/Sanksjonsårsak';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';

const SanksjonVelger = styled(Select)`
    margin-top: 1rem;
`;

const Container = styled.div`
    margin: 2rem;
`;

const Seksjon = styled.div`
    margin-top: 2rem;
`;

const NormaltekstMedMargin = styled(Normaltekst)`
    margin-top: 1rem;
`;

const Advarsel = styled(AlertStripeAdvarsel)`
    margin-top: 1.5rem;
`;

interface Props {
    behandlingId: string;
}

const Sanksjonsfastsettelse: FC<Props> = ({ behandlingId }) => {
    const [valgtSanksjonsårsak, settValgtSanksjonsårsak] = useState<Sanksjonsårsak>();
    const [internBegrunnelse, settInternBegrunnelse] = useState<string>('');

    return (
        <Container>
            <section>
                <Undertittel>Sanksjon</Undertittel>
                <SanksjonVelger
                    label="Brukeren har uten rimelig grunn:"
                    value={valgtSanksjonsårsak || ''}
                    bredde={'xxl'}
                    onChange={(e) => {
                        settValgtSanksjonsårsak(e.target.value as Sanksjonsårsak);
                    }}
                >
                    <option value="">Velg</option>
                    {sanksjonsårsaker.map((sanksjonsårsak: Sanksjonsårsak, index: number) => (
                        <option key={index} value={sanksjonsårsak}>
                            {sanksjonsårsakTilTekst[sanksjonsårsak]}
                        </option>
                    ))}
                </SanksjonVelger>
            </section>
            {valgtSanksjonsårsak && (
                <>
                    <Seksjon>
                        <Undertittel>Sanksjonsperiode</Undertittel>
                        <NormaltekstMedMargin>
                            Måneden for sanksjon er <b>Februar 2022</b> som er måneden etter dette
                            vedtaket. Bruker vil ikke få utbetalt stønad i denne perioden.{' '}
                            {behandlingId}
                        </NormaltekstMedMargin>
                    </Seksjon>
                    <Seksjon>
                        <AlertStripeInfo>{sanksjonInfo}</AlertStripeInfo>
                        <Advarsel>{sanksjonAdvarsel}</Advarsel>
                    </Seksjon>
                    <Seksjon>
                        <Textarea
                            label={'Begrunnelse (intern)'}
                            value={internBegrunnelse}
                            onChange={(e) => settInternBegrunnelse(e.target.value)}
                        />
                    </Seksjon>
                    <Seksjon>
                        <Hovedknapp>Lagre vedtak</Hovedknapp>
                    </Seksjon>
                </>
            )}
        </Container>
    );
};

export default Sanksjonsfastsettelse;
