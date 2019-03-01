var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate message object correctly', () => {
        var from = 'Tester';
        var text = 'Some message';
        var message = generateMessage(from, text);
        
        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});