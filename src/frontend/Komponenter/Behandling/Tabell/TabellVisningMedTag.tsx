import * as React from 'react';
import { IStonader } from '../TidligereVedtaksperioder/typer';
import { Tag } from '@navikt/ds-react';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

const TabellVisningMedTag: React.FC<{ stonad: IStonader }> = ({ stonad }) => {
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
        <>
            <table>
                <tbody>
                    <tr>
                        <th>{'Historikk i EF Sak'}</th>
                        <th>{'Historikk i Infotrygd'}</th>
                    </tr>
                    <tr>
                        {renderTag(stonad.verdier?.sak)}
                        {renderTag(stonad.verdier?.infotrygd)}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default TabellVisningMedTag;
