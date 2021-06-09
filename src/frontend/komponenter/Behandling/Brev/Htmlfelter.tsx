import { EBehandlingResultat, IVedtak } from '../../../typer/vedtak';

export const delmalTilHtlmFelt: { [delmalNavn: string]: { [htmlfelt: string]: string } } = {
    htmlDelmal: { inntektsperioder: "<div style='color:red'>asd</div>" },
};

export const delmalTilHtml = (
    delmalNavn: string,
    vedtak?: IVedtak
): { [htmlFeltNavn: string]: string } => {
    switch (delmalNavn) {
        case 'htmlDelmal':
            return { inntektsperioder: lagInntektsperioder(vedtak) };
        default:
            return {};
    }
};

const lagInntektsperioder = (vedtak?: IVedtak): string => {
    return `<table><thead><tr><th>Periode</th><th>Inntekt</th><th>Utbetaling</th></tr></thead>
<tbody>${lagRaderForVedtak(vedtak)}</tbody>
</table>`;
};

const lagRaderForVedtak = (vedtak?: IVedtak): string => {
    if (!vedtak || vedtak.resultatType === EBehandlingResultat.AVSLÅ) {
        return '';
    }
    return vedtak.perioder
        .map(
            (periode) =>
                `<tr><td>${periode.årMånedFra} - ${periode.årMånedTil}</td><td>inntekt</td><td>hade</td></tr>`
        )
        .join('');
};
