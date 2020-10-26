import { createGlobalStyle } from 'styled-components';
import HelveticaNeueFontWoff from '../../static/font/font.woff'
import HelveticaNeueFontWoff2 from '../../static/font/font.woff2'

export default createGlobalStyle`
    @font-face {
        font-family: 'Helvetica Neue';
        src: local('Helvetica Neue'), local('Helvetica Neue'),
        url(${HelveticaNeueFontWoff2}) format('woff2'),
        url(${HelveticaNeueFontWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
`