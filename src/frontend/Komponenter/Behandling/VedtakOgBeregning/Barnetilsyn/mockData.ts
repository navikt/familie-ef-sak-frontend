export interface IBarnForBarnetilsyn {
    navn: string;
    alder: string;
    barnepassordning: IBarnepassOrdning;
    aleneomsorg: boolean;
}

export interface IBarnepassOrdning {
    navn: string;
    type: string;
    datoFra: string;
    datoTil: string;
    utgift: string;
}

const sfoHaugestua: IBarnepassOrdning = {
    navn: 'Haugestua Barnehage',
    type: 'Barnehage, SFO eller liknende',
    datoFra: '02.08.2021',
    datoTil: '30.06.2022',
    utgift: '3000',
};

const andedammenSkole: IBarnepassOrdning = {
    navn: 'Andedammen Skole',
    type: 'Barnehage, SFO eller liknende',
    datoFra: '03.08.2021',
    datoTil: '25.07.2022',
    utgift: '3654',
};

const ole: IBarnForBarnetilsyn = {
    navn: 'Ole Duck',
    alder: '1 år',
    barnepassordning: sfoHaugestua,
    aleneomsorg: true,
};

const alfonso: IBarnForBarnetilsyn = {
    navn: 'Alfonso Schmidt Gerhardsen',
    alder: '5 år',
    barnepassordning: andedammenSkole,
    aleneomsorg: true,
};

const pål: IBarnForBarnetilsyn = {
    navn: 'Ola Nordmann',
    alder: '11 år',
    barnepassordning: sfoHaugestua,
    aleneomsorg: false,
};

export const barn = [ole, alfonso, pål];
