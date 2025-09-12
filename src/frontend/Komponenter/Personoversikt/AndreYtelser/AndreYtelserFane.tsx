import React, { useEffect } from 'react';
import { useHentAndreYtelser } from '../../../App/hooks/useHentAndreYtelser';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

interface Props {
    fagsakPersonId: string;
}

export const AndreYtelserFane: React.FC<Props> = ({ fagsakPersonId }) => {
    const { andreYtelser, hentAndreYtelser } = useHentAndreYtelser(fagsakPersonId);

    useEffect(() => {
        hentAndreYtelser();
    }, [hentAndreYtelser]);

    return (
        <DataViewer response={{ andreYtelser }}>
            {({ andreYtelser }) => {
                return (
                    <>
                        {andreYtelser.arbeidsavklaringspenger.vedtak.map(
                            (arbeidsavklaringspenger, index) => (
                                <div key={index}>
                                    <p>Barn med stønad: {arbeidsavklaringspenger.barnMedStonad}</p>
                                    <p>Barnetillegg: {arbeidsavklaringspenger.barnetillegg}</p>
                                    <p>
                                        Beregningsgrunnlag:{' '}
                                        {arbeidsavklaringspenger.beregningsgrunnlag}
                                    </p>
                                    <p>Dagsats: {arbeidsavklaringspenger.dagsats}</p>
                                    <p>
                                        Dagsats etter uføre reduksjon:{' '}
                                        {arbeidsavklaringspenger.dagsatsEtterUføreReduksjon}
                                    </p>
                                    <p>Kildesystem: {arbeidsavklaringspenger.kildesystem}</p>
                                    <p>Opphørsårsak: {arbeidsavklaringspenger.opphorsAarsak}</p>
                                    <p>
                                        Fra og med: {arbeidsavklaringspenger.periode.fraOgMedDato}
                                    </p>
                                    <p>
                                        Til og med: {arbeidsavklaringspenger.periode.tilOgMedDato}
                                    </p>
                                    <p>Rettighetstype: {arbeidsavklaringspenger.rettighetsType}</p>
                                    <p>Saksnummer: {arbeidsavklaringspenger.saksnummer}</p>
                                    <p>SamordningsId: {arbeidsavklaringspenger.samordningsId}</p>
                                    <p>Status: {arbeidsavklaringspenger.status}</p>
                                    <p>VedtakId: {arbeidsavklaringspenger.vedtakId}</p>
                                    <p>
                                        VedtaksTypeKode: {arbeidsavklaringspenger.vedtaksTypeKode}
                                    </p>
                                    <p>
                                        VedtaksTypeNavn: {arbeidsavklaringspenger.vedtaksTypeNavn}
                                    </p>
                                    <p>Vedtaksdato: {arbeidsavklaringspenger.vedtaksdato}</p>
                                </div>
                            )
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
