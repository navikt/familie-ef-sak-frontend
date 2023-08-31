import * as React from 'react';
import styled from 'styled-components';
import { ITidligereVedtaksperioder } from '../TidligereVedtaksperioder/typer';
import { Heading, Tag } from '@navikt/ds-react';

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
                        <td>
                            {stonad.verdier?.verdi[0].sak ? (
                                <Tag variant="success-filled">Ja</Tag>
                            ) : (
                                <Tag variant="neutral">Nei</Tag>
                            )}
                        </td>
                        <td>
                            {stonad.verdier?.verdi[1].infotrygd ? (
                                <Tag variant="success-filled">Ja</Tag>
                            ) : (
                                <Tag variant="neutral">Nei</Tag>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default TabellVisningMedTag;
