import * as React from 'react';
import { IHistorikkForStønad } from '../TidligereVedtaksperioder/typer';
import { Tag } from '@navikt/ds-react';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

const TabellVisningMedTag: React.FC<{ stønad: IHistorikkForStønad }> = ({ stønad }) => {
    const renderTag = (verdi: boolean | undefined) => {
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
                    {renderTag(stønad.harHistorikkISak)}
                    {renderTag(stønad.harHistorikkIInfotrygd)}
                </tr>
            </tbody>
        </table>
    );
};

export default TabellVisningMedTag;
