import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { IPersonopplysninger, IVergemål } from '../../../App/typer/personopplysninger';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Footer, MidtstiltInnhold, StyledHovedknapp } from './SendTilBeslutterFooter';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { ModalAction, ModalType, useModal } from '../../../App/context/ModalContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';

export const SendTilBeslutterFooterVerge: React.FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ personopplysninger, behandlingId }) => {
    const [visModal, settVisModal] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);
    const [valgteMottakere, setteValgteMottaker] = useState<IBrevmottaker[]>([]);
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentTotrinnskontroll } = useBehandling();

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    const sendTilBeslutterMedMottakere = () => {
        settLaster(true);
        settFeilmelding('');
        axiosRequest<string, IBrevmottaker[]>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter/verge`,
            data: valgteMottakere,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    hentTotrinnskontroll.rerun();

                    modalDispatch({
                        type: ModalAction.VIS_MODAL,
                        modalType: ModalType.SENDT_TIL_BESLUTTER,
                    });
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => settLaster(false));
    };

    const bruker: IBrevmottaker = {
        navn: personopplysninger.navn.visningsnavn,
        personIdent: personopplysninger.personIdent,
        mottakerRolle: EBrevmottakerRolle.BRUKER,
    };
    const verger = personopplysninger.vergemål
        .filter((vergemål, indeks, self) => self.indexOf(vergemål) === indeks)
        .map((vergemål) => vergemålTilBrevmottaker(vergemål));

    const muligeBrevmottakere: IBrevmottaker[] = [bruker, ...verger];

    const toggleMottaker = (mottaker: IBrevmottaker) => (e: ChangeEvent<HTMLInputElement>) => {
        setteValgteMottaker((prevState) => {
            return e.target.checked
                ? [...prevState, mottaker]
                : [
                      ...prevState.filter(
                          (valgtMottaker) => valgtMottaker.personIdent !== mottaker.personIdent
                      ),
                  ];
        });
    };

    return (
        <>
            <Footer>
                <MidtstiltInnhold>
                    Bruker er under vergemål. Du må ta stilling til hvem vedtaksbrevet skal sendes
                    til før vedtak kan sendes til godkjenning.
                    <StyledHovedknapp onClick={() => settVisModal(true)}>
                        Velg mottakere
                    </StyledHovedknapp>
                </MidtstiltInnhold>
            </Footer>
            {visModal && (
                <UIModalWrapper
                    modal={{
                        tittel: 'Bruker er under vergemål. Du må ta stilling til hvem vedtaksbrevet skal sendes til før vedtak kan sendes til godkjenning.',
                        lukkKnapp: true,
                        visModal: true,
                        onClose: lukkModal,
                    }}
                >
                    {feilmelding && (
                        <AlertStripeFeil>Send til beslutter feilet. {feilmelding}</AlertStripeFeil>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendTilBeslutterMedMottakere();
                        }}
                    >
                        <CheckboxGruppe
                            legend={'Velg inntil 2 mottakere av brevet'}
                            feil={
                                valgteMottakere.length > 2
                                    ? 'Brevet kan ikke ha mer enn 2 mottakere'
                                    : ''
                            }
                        >
                            {muligeBrevmottakere.map((mottaker, index) => (
                                <Checkbox
                                    key={index}
                                    label={`${
                                        mottaker.navn
                                    } (${mottaker.mottakerRolle.toLowerCase()})`}
                                    onChange={toggleMottaker(mottaker)}
                                />
                            ))}
                        </CheckboxGruppe>
                        <Knapp onClick={lukkModal}>Avbryt</Knapp>
                        <Hovedknapp htmlType={'submit'} disabled={laster}>
                            Send til godkjenning
                        </Hovedknapp>
                    </form>
                </UIModalWrapper>
            )}
        </>
    );
};

const vergemålTilBrevmottaker = (vergemål: IVergemål): IBrevmottaker => ({
    navn: vergemål.navn,
    personIdent: vergemål.motpartsPersonident,
    mottakerRolle: EBrevmottakerRolle.VERGE,
});
