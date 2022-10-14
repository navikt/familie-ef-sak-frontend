import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import React, { FC, useState } from 'react';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { BodyShort } from '@navikt/ds-react';
import { IUtestengelse } from '../../../App/typer/utestengelse';
import { formaterIsoDato } from '../../../App/utils/formatter';

export const SlettUtestengelseModal: FC<{
    fagsakPersonId: string;
    utestengelseTilSletting: IUtestengelse | undefined;
    fjernUtestengelseTilSletting: () => void;
    hentUtestengelser: (fagsakPersonId: string) => void;
}> = ({
    fagsakPersonId,
    utestengelseTilSletting,
    fjernUtestengelseTilSletting,
    hentUtestengelser,
}) => {
    const { axiosRequest } = useApp();

    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);

    const lukkModal = () => {
        settFeilmelding('');
        settLaster(false);
        fjernUtestengelseTilSletting();
    };

    const slettUtestengelse = (fagsakPersonid: string, id: string) => {
        settFeilmelding('');
        if (laster) {
            return;
        }
        settLaster(true);
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `/familie-ef-sak/api/utestengelse/${fagsakPersonid}/${id}`,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            settLaster(false);
            if (res.status === RessursStatus.SUKSESS) {
                hentUtestengelser(fagsakPersonId);
                lukkModal();
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };
    if (!utestengelseTilSletting) {
        return null;
    }

    return (
        <ModalWrapper
            tittel={'Vil du slette utestengelsen?'}
            visModal={true}
            aksjonsknapper={{
                lukkKnapp: {
                    tekst: 'Avbryt',
                    onClick: lukkModal,
                    disabled: laster,
                },
                hovedKnapp: {
                    tekst: 'Slett utestengelsen',
                    onClick: () => slettUtestengelse(fagsakPersonId, utestengelseTilSletting.id),
                    disabled: laster,
                },
            }}
            onClose={lukkModal}
        >
            <BodyShort>
                Utestengelsen ({formaterIsoDato(utestengelseTilSletting.periode.fom)} -{' '}
                {formaterIsoDato(utestengelseTilSletting.periode.tom)}) vil bli slettet på brukeren
            </BodyShort>
            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
        </ModalWrapper>
    );
};
