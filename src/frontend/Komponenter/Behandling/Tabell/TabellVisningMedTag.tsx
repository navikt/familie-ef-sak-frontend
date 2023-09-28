import * as React from 'react';
import { IHistorikkForStønad } from '../TidligereVedtaksperioder/typer';
import { Tag } from '@navikt/ds-react';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

const TabellVisningMedTag: React.FC<{ stønad: IHistorikkForStønad }> = ({ stønad }) => {
    const JaEllerNeiTag: React.FC<{ verdi: boolean | undefined }> = ({ verdi }) => {
        const tagVariant = verdi ? 'success-filled' : 'neutral';
        const tagTekst = formatterBooleanEllerUkjent(verdi);

        return (
            <td>
                <Tag variant={tagVariant}>{tagTekst}</Tag>
            </td>
        );
    };

    return (
        <table>
            <tbody>
                <tr>
                    <th>{'Historikk i EF Sak'}</th>
                    <th>{'Historikk i Infotrygd'}</th>
                </tr>
                <tr>
                    <JaEllerNeiTag verdi={stønad.harHistorikkISak} />
                    <JaEllerNeiTag verdi={stønad.harHistorikkIInfotrygd} />
                </tr>
            </tbody>
        </table>
    );
};

export default TabellVisningMedTag;
