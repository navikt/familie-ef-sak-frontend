import { formaterFødselsnummer } from './formatter';

describe('utils/formatter', () => {
    describe('formaterIsoDato', () => {
        const fnr = formaterFødselsnummer('12345678901');
        test('skal formatere fnr med space etter 6 tegn', () => {
            expect(fnr).toEqual('123456 78901');
        });
    });
});
