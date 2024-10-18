export const kortNedBeskrivelse = (beskrivelse?: string) => {
    if (!beskrivelse) {
        return '';
    }

    if (beskrivelse.startsWith('---')) {
        const sluttIndeks = beskrivelse.indexOf('---', 3) + 3;
        beskrivelse = beskrivelse.slice(sluttIndeks).trim();
    }

    const klippBortIndeks = beskrivelse.indexOf('---');
    if (klippBortIndeks !== -1 && klippBortIndeks <= 75) {
        return beskrivelse.slice(0, klippBortIndeks).trim();
    } else if (beskrivelse.length > 75) {
        return beskrivelse.slice(0, 75).trim() + '...';
    }

    return beskrivelse;
};
