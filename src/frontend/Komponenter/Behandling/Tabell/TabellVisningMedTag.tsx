import * as React from 'react';
import styled from 'styled-components';
import { ITidligereVedtaksperioder } from '../TidligereVedtaksperioder/typer';
import { Heading, Tag } from '@navikt/ds-react';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

export interface IStonader {
    overskrift: string;
    historikk?: undefined | ITidligereVedtaksperioder;
    verdier?: IVerdier;
}

interface IVerdier {
    stønad: string;
    verdi: [{ sak: boolean | undefined }, { infotrygd: boolean | undefined }];
}

const Tittel = styled(Heading)`
    text-decoration: underline;
`;

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
            <Tittel level="3" size="small">
                {stonad.overskrift}
            </Tittel>
            <table>
                <tbody>
                    <tr>
                        <th>{'Historikk i EF Sak'}</th>
                        <th>{'Historikk i Infotrygd'}</th>
                    </tr>
                    <tr>
                        {renderTag(stonad.verdier?.verdi[0].sak)}
                        {renderTag(stonad.verdier?.verdi[1].infotrygd)}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default TabellVisningMedTag;
