import Modal from 'nav-frontend-modal';
import { Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { IModal } from '../../App/typer/modal';
import classNames from 'classnames';

interface IProps {
    modal: IModal;
    children?: React.ReactNode;
}

const UIModalWrapper: React.FunctionComponent<IProps> = ({ modal, children }) => {
    const { tittel, visModal, onClose, lukkKnapp, actions, className } = modal;

    return (
        <Modal
            className={classNames(className, 'uimodal')}
            isOpen={visModal}
            onRequestClose={(): void => onClose && onClose()}
            contentLabel="ui-modal"
            closeButton={lukkKnapp}
        >
            <div className="uimodal__content">
                <Undertittel children={tittel} />
                <div className="uimodal__content--inner-content">{children}</div>
                {actions && <div className="uimodal__content--actions"> {actions} </div>}
            </div>
        </Modal>
    );
};

export default UIModalWrapper;
