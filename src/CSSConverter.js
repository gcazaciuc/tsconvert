const csstree = require('css-tree');
const sass = require('node-sass');
const prettier = require('prettier');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const createValue = (v) => {
    switch(v.type) {
        case 'Dimension':
            return `${v.value}${v.unit}`;
        case 'Identifier':
            return v.name;
        case 'HexColor':
            return `#${v.value}`;
        case 'Number':
            return Number(v.value);
        case 'Url':
            return `url(${v.vale.value}`;
        case 'String':
            return v.value;
        case 'WhiteSpace':
            return ' ';
    }
};
const getName = (c) => {
    switch (c.type) {
        case 'IdSelector':
        case 'TypeSelector':
        case 'ClassSelector':
            return c.name;
        default:
            return null;
    }
};

const generateTypestyle = (classRegistry, ruleNode) => {
    const selectorList = ruleNode.prelude.children;
    const selectorNames = selectorList[0].children.map(getName);
    const pseudoClass = selectorList[0].children.find((c) => c.type === 'PseudoClassSelector')
    const pseudoElement = selectorList[0].children.find((c) => c.type === 'PseudoElementSelector')
    const definedSelectorNames = selectorNames.filter(_.negate(_.isNull));
    const generatedClass = _.camelCase(definedSelectorNames.join('-'));

    const generatedContent = ruleNode.block.children.reduce((styles, c) => {
        switch(c.type) {
            case 'Declaration':
                styles[_.camelCase(c.property)] = c.value.children.map(createValue).join(' ');
        }
        return styles;
    }, {});

    classRegistry[generatedClass] = classRegistry[generatedClass] || {};
    classRegistry[generatedClass].$nest = classRegistry[generatedClass].$nest || {};
    if (pseudoClass) {
        classRegistry[generatedClass].$nest[`&:${pseudoClass.name}`] = generatedContent;
    }
    if (pseudoElement) {
        classRegistry[generatedClass].$nest[`&::${pseudoElement.name}`] = generatedContent;
    }
    if (!pseudoClass && !pseudoElement) {
        Object.assign(classRegistry[generatedClass], generatedContent, {
            $debugName: generatedClass
        });
    }

    if (Object.keys(classRegistry[generatedClass].$nest).length === 0) {
        delete classRegistry[generatedClass].$nest;
    }
}

const convertCss = (code) => {
    return new Promise((resolve) => {
        const cssAst =  csstree.toPlainObject(csstree.parse(code));
        const generatedClasses = {};
        csstree.walk(cssAst, (node) => {
            switch(node.type) {
                case 'Rule':
                    generateTypestyle(generatedClasses, node);
                    break;
            }
        });

        resolve(printTypestyle(generatedClasses));
    });
}

const printTypestyle = (defs) => {
    const code = Object.keys(defs).reduce((code, cls) => {
        code.push(`export const ${cls} = style(${JSON.stringify(defs[cls])});`);
        return code;
    }, [`import { style } from 'typestyle';`]).join('\n');

    return prettier.format(code, { parser: 'babylon' });
}

const convertFile = (file) => {
    const [basename, extension] = path.basename(file).split('.');
    const isSassFile = extension === 'scss' || extension === 'sass';
    const fileContent = { css: String(fs.readFileSync(file)) };
    const { css:regularCSS } = isSassFile ? sass.renderSync({ file }) : fileContent;
    console.log(`Processing file ${file}`);
    return convertCss(regularCSS);
};

module.exports = convertFile;