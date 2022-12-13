import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import {
    AvsnittMedId,
    BrevtyperTilAvsnitt,
    BrevtyperTilOverskrift,
    BrevtyperTilSelectNavn,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    stønadstypeTilBrevtyper,
} from './BrevTyper';
import { skjulAvsnittUtenVerdi } from './BrevUtils';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Alert, Button, Panel, Select, Textarea, TextField } from '@navikt/ds-react';
import { Delete } from '@navikt/ds-icons';
import NedKnapp from '../../../Felles/Knapper/NedKnapp';
import OppKnapp from '../../../Felles/Knapper/OppKnapp';
import TilbakestillKnapp from '../../../Felles/Knapper/TilbakestillKnapp';

const StyledSelect = styled(Select)`
    margin-top: 1rem;
`;

const Innholdsrad = styled(Panel)`
    width: 95%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ToKolonneLayout = styled.div`
    display: flex;
`;

const Overskrift = styled(TextField)`
    margin-top: 1rem;
`;

const LeggTilKnappWrapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
`;

const BrevKolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

const SlettKnapp = styled(Button)`
    width: fit-content;
    place-self: center;
`;

const FlyttAvsnittKnappWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 0.5rem;
    margin-top: 1rem;
`;

const Varsel = styled(Alert)`
    margin-top: 1rem;
    width: 95%;
`;

type Props = {
    brevType: FrittståendeBrevtype | FritekstBrevtype | undefined;
    endreBrevType: (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => void;
    overskrift: string;
    endreOverskrift: (nyOverskrift: string) => void;
    avsnitt: AvsnittMedId[];
    endreAvsnitt: (avsnitt: AvsnittMedId[]) => void;
    endreDeloverskriftAvsnitt: (radId: string) => ChangeEventHandler<HTMLInputElement>;
    endreInnholdAvsnitt: (radId: string) => ChangeEventHandler<HTMLTextAreaElement>;
    fjernRad: (radId: string) => void;
    leggTilAvsnittFørst: () => void;
    leggAvsnittBakSisteSynligeAvsnitt: () => void;
    flyttAvsnittOpp: (avsnittId: string) => void;
    flyttAvsnittNed: (avsnittId: string) => void;
    context: FritekstBrevContext;
    behandlingsårsak?: Behandlingsårsak;
    stønadstype: Stønadstype;
    settVisNullstillBrevModal?: (visModal: boolean) => void;
};

const BrevInnhold: React.FC<Props> = ({
    brevType,
    endreBrevType,
    overskrift,
    endreOverskrift,
    avsnitt,
    endreAvsnitt,
    endreDeloverskriftAvsnitt,
    endreInnholdAvsnitt,
    fjernRad,
    leggTilAvsnittFørst,
    leggAvsnittBakSisteSynligeAvsnitt,
    flyttAvsnittOpp,
    flyttAvsnittNed,
    context,
    behandlingsårsak,
    stønadstype,
    settVisNullstillBrevModal,
}) => {
    const ikkeRedigerBareBrev: (FrittståendeBrevtype | FritekstBrevtype | undefined)[] = [
        FrittståendeBrevtype.VARSEL_OM_AKTIVITETSPLIKT,
        FrittståendeBrevtype.BREV_OM_SVARTID_KLAGE,
        FrittståendeBrevtype.INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE,
        FrittståendeBrevtype.INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE,
    ];
    const finnesSynligeAvsnitt = avsnitt.some((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);
    const brevSkalKunneRedigeres = !ikkeRedigerBareBrev.includes(brevType);
    const avsnittSomSkalVises = avsnitt.filter((avsnitt) => !avsnitt.skalSkjulesIBrevbygger);

    const brevtyper = stønadstypeTilBrevtyper[stønadstype];
    const skalViseVarselOmManuelleFlettefelter =
        brevType === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID_KLAGE ||
        brevType === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID;

    return (
        <BrevKolonner>
            <StyledSelect
                label="Brevtype"
                onChange={(e) => {
                    const nyBrevType = e.target.value as FrittståendeBrevtype | FritekstBrevtype;
                    endreBrevType(nyBrevType);
                    endreOverskrift(nyBrevType ? BrevtyperTilOverskrift[nyBrevType] : '');
                    endreAvsnitt(
                        nyBrevType ? skjulAvsnittUtenVerdi(BrevtyperTilAvsnitt[nyBrevType]) : []
                    );
                }}
                value={brevType || ''}
            >
                <option value={''}>Ikke valgt</option>
                {Object.values(
                    context === FritekstBrevContext.FRITTSTÅENDE ? FrittståendeBrevtype : brevtyper
                )
                    .filter(
                        (type: FrittståendeBrevtype | FritekstBrevtype) =>
                            type !== FritekstBrevtype.SANKSJON ||
                            behandlingsårsak === Behandlingsårsak.SANKSJON_1_MND
                    )
                    .map((type: FrittståendeBrevtype | FritekstBrevtype) => (
                        <option value={type} key={type}>
                            {
                                BrevtyperTilSelectNavn[
                                    type as FrittståendeBrevtype | FritekstBrevtype
                                ]
                            }
                        </option>
                    ))}
            </StyledSelect>
            {brevType && (
                <>
                    {brevSkalKunneRedigeres && (
                        <Overskrift
                            label="Overskrift"
                            value={overskrift}
                            onChange={(e) => {
                                endreOverskrift(e.target.value);
                            }}
                        />
                    )}
                    {finnesSynligeAvsnitt && brevSkalKunneRedigeres && (
                        <LeggTilKnappWrapper>
                            <LeggTilKnapp
                                onClick={leggTilAvsnittFørst}
                                knappetekst="Legg til avsnitt"
                            />
                        </LeggTilKnappWrapper>
                    )}
                    {skalViseVarselOmManuelleFlettefelter && (
                        <Varsel variant={'warning'}>
                            {brevType === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID_KLAGE && (
                                <>
                                    Husk å fylle ut antall uker forventet svartid i{' '}
                                    <span style={{ fontWeight: 'bold' }}>[antall]</span> i avsnittet
                                    under
                                </>
                            )}
                            {brevType === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID && (
                                <>
                                    Husk å fylle ut hvilken stønad det gjelder og antall uker
                                    forventet svartid i avsnittet under.
                                </>
                            )}
                        </Varsel>
                    )}
                    {avsnittSomSkalVises.map((rad, index) => {
                        const deloverskriftId = `deloverskrift-${rad.id}`;
                        const innholdId = `innhold-${rad.id}`;
                        const toKolonneId = `toKolonne-${rad.id}`;
                        const knappWrapperId = `knappWrapper-${rad.id}`;

                        return (
                            <ToKolonneLayout key={toKolonneId} id={toKolonneId}>
                                <Innholdsrad key={rad.id} border>
                                    <TextField
                                        onChange={endreDeloverskriftAvsnitt(rad.id)}
                                        label="Deloverskrift (valgfri)"
                                        id={deloverskriftId}
                                        value={rad.deloverskrift}
                                    />
                                    <Textarea
                                        onChange={endreInnholdAvsnitt(rad.id)}
                                        label="Innhold"
                                        id={innholdId}
                                        value={rad.innhold}
                                        maxLength={0}
                                    />
                                    <SlettKnapp
                                        type={'button'}
                                        variant={'secondary'}
                                        onClick={() => fjernRad(rad.id)}
                                        icon={<Delete />}
                                    >
                                        Slett avsnitt
                                    </SlettKnapp>
                                </Innholdsrad>
                                <FlyttAvsnittKnappWrapper id={knappWrapperId}>
                                    {index > 0 && (
                                        <OppKnapp
                                            onClick={() => {
                                                flyttAvsnittOpp(rad.id);
                                            }}
                                            ikontekst={'Flytt avsnitt opp'}
                                        />
                                    )}
                                    {index + 1 < avsnittSomSkalVises.length && (
                                        <NedKnapp
                                            onClick={() => {
                                                flyttAvsnittNed(rad.id);
                                            }}
                                            ikontekst={'Flytt avsnitt ned'}
                                        />
                                    )}
                                </FlyttAvsnittKnappWrapper>
                            </ToKolonneLayout>
                        );
                    })}
                    <LeggTilKnappWrapper>
                        {brevSkalKunneRedigeres && (
                            <LeggTilKnapp
                                onClick={leggAvsnittBakSisteSynligeAvsnitt}
                                knappetekst="Legg til avsnitt"
                            />
                        )}
                        {settVisNullstillBrevModal && (
                            <TilbakestillKnapp
                                onClick={() => settVisNullstillBrevModal(true)}
                                knappetekst={'Nullstill brev'}
                            />
                        )}
                    </LeggTilKnappWrapper>
                </>
            )}
        </BrevKolonner>
    );
};
export default BrevInnhold;
