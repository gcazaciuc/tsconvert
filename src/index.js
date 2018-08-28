const convertFile = require('./CSSConverter');
const glob = require("glob");
const fs = require('fs');
const path = require('path');

const convert = (argv) => {
    const getFiles = (f, e) => {
        const ext = e || 'css,scss';
        const extensions = ext.split(',').length > 1 ? `{${ext}}` : ext;
        const dir = f || process.cwd();
        if (fs.existsSync(dir) && fs.lstatSync(dir).isFile()) {
            return [path.resolve(dir)];
        }
        const normalizedDir = dir.substr(dir.length -1) === '/' ?  dir.substr(0, dir.length -1) : dir;
        const pathToSearch = `${normalizedDir}/**/*.${extensions}`;
        return glob.sync(pathToSearch, {})
    }
    
    const writeTypestyleFile = (file) => (typestyle) => {
        const [basename] = path.basename(file).split('.');
        const dir = path.dirname(file);
        const typestyleFile = path.join(dir, `${basename}Style.ts`);
        if (fs.existsSync(typestyleFile) && !argv['overwrite']) {
            console.log(`Output file ${typestyleFile} exists. Pass --overwrite flag in order to overwrite it!`);
        } else {
            fs.writeFileSync(typestyleFile, typestyle);
        }
    }

    getFiles(argv['f'], argv['ext']).forEach((f) => convertFile(f).then(writeTypestyleFile(f)));
}

module.exports = convert;