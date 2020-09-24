import { Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';

const OppgaveHeader: React.FunctionComponent = () => {
    const [personIdent, settPersonIdent] = React.useState('');

    return (
        <div className={'oppgave-header'}>
            <div>
                <Systemtittel className={'oppgave-header__tittel'}>Oppgavebenken</Systemtittel>


            </div>
            <div className={'oppgave-header__opprett-fagsak'}>
                <Input
                    label={'Opprett eller hent fagsak'}
                    value={personIdent}
                    bredde={'XXL'}
                    placeholder={'Skriv inn fnr/dnr 11 siffer'}
                    onChange={(event) => {
                        settPersonIdent(event.target.value.trim());
                    }}
                />
                <Knapp
                    type={'hoved'}
                    onClick={() => console.log('lag fagsak??')
                    }
                    children={'Fortsett'}
                />
            </div>
        </div>
    );
};

export default OppgaveHeader;
