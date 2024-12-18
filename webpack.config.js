import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './js/src/index.js',
    mode: 'none',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'abusefilter-analyzer.js',
    },
    plugins: [
        new webpack.BannerPlugin(`
This is a script for analyzing AbuseFilter syntax tree.
The file is generated from the source code at https://github.com/whpac/abusefilter-analyzer

@author [[w:pl:User:Msz2001]]
@license GPLv2 <https://github.com/whpac/abusefilter-analyzer/blob/master/LICENSE>
`),
    ],
};