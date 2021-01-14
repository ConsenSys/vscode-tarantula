'use strict';
/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
 * 
 * */
const vscode = require('vscode');

function HSLtoRGB(h, s, l) {
    let r, g, b;

    const rd = (a) => {
        return Math.floor(Math.max(Math.min(a * 256, 255), 0));
    };

    const hueToRGB = (m, n, o) => {
        if (o < 0) {
            o += 1;
        }
        if (o > 1) {
            o -= 1;
        }
        if (o < 1 / 6) {
            return m + (n - m) * 6 * o;
        }
        if (o < 1 / 2) {
            return n;
        }
        if (o < 2 / 3) {
            return m + (n - m) * (2 / 3 - o) * 6;
        }
        return m;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);

    return [rd(r), rd(g), rd(b)];
}

function RGBtoHex(r, g, b) {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

const decoStyle = {
    redline: vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
            // this color will be used in light color themes
            backgroundColor: RGBtoHex(...HSLtoRGB(((5 + 5) * 19) % 255 / 255, 0.85, 0.75)) + "50"
        },
        dark: {
            // this color will be used in dark color themes
            backgroundColor: RGBtoHex(...HSLtoRGB(((5 + 5) * 19) % 255 / 255, 0.85, 0.75)) + "50"
        },
    })
};

/**
 * 
 * @param {*} editor 
 * @param {*} decorations {styleKey: ranges}
 */
async function setDecorations(editor, decorations) {

    if (!editor) {
        return;
    }

    let seenDecoStyles = {};
    let deco_map = {};

    decorations.forEach(function(deco){
        if(!deco_map[deco.decoStyle.key]){
            deco_map[deco.decoStyle.key] = [];
            seenDecoStyles[deco.decoStyle.key] = deco.decoStyle;
        }
        deco_map[deco.decoStyle.key].push(deco.range);
    });

    console.log(deco_map);
    for (let styleKey in deco_map){
        editor.setDecorations(seenDecoStyles[styleKey], deco_map[styleKey]);
    }
}



module.exports = {
    decoStyle,
    setDecorations
};