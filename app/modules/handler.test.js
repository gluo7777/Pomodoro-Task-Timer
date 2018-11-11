const rewire = require('rewire');
const handler = rewire('./handler.js');

testField('HOST','http://localhost');

test('test getContentType returns correct value', () => {
    const getContentType = handler.__get__('getContentType');
    expect(getContentType('script.js')).toBe('application/javascript');
    expect(getContentType('scripts/api/task-api.js')).toBe('application/javascript');
    expect(getContentType('index.html')).toBe('text/html');
    expect(getContentType('styles.css')).toBe('text/css');
    expect(getContentType('pic.png')).toBe('image/png');
    expect(getContentType('pic.jpeg')).toBe('image/jpeg');
    expect(getContentType('pic.gif')).toBe('image/gif');
});

test('test getContentType returns null value for unrecognized formats', () => {
    const getContentType = handler.__get__('getContentType');
    expect(getContentType('script')).toBe(null);
    expect(getContentType('script.sh')).toBe(null);
});

test('test hasExtension is true', () => {
    const hasExtension = handler.__get__('hasExtension');
    expect(hasExtension('script.js','js')).toBe(true);
    expect(hasExtension('styles.css','css')).toBe(true);
    expect(hasExtension('image.png','png')).toBe(true);
});

test('test hasExtension is false', () => {
    const hasExtension = handler.__get__('hasExtension');
    expect(hasExtension('script.jsx','js')).toBe(false);
    expect(hasExtension('somepath/script.js','js')).toBe(false);
    expect(hasExtension('script.test.js','js')).toBe(false);
});

test('Allowed image extensions.', () => {
    expect(handler.__get__('IMG')).toEqual(['png','jpeg','gif']);
});

test('test isValidPath is true', () => {
    const isValidPath = handler.__get__('isValidPath');
    for(const file of ['scripts','scripts/config.js','scripts/api/task-api.js',
        'scripts/utility/storage.js']){
        expect(isValidPath(file)).toBe(true);
    };
});

test('test isValidPath is false', () => {
    const isValidPath = handler.__get__('isValidPath');
    for(const file of ['modules','modules/handler.js','modules/handler.test.js','main.js','scripts/config.test.js']){
        expect(isValidPath(file)).toBe(false);
    };
});

function testField(field,expected,msg=`Expected ${field} to equal ${expected}.`){
    test(msg, () => {
        expect(handler.__get__(field)).toBe(expected);
    }); 
}