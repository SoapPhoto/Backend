import { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

export const scrollbar = css`
.os-theme-dark>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle{background: ${theme('styles.scrollbar.background')}}
/* .os-theme-light>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle{background:rgba(255,255,255,.4)} */
.os-theme-dark>.os-scrollbar:hover>.os-scrollbar-track>.os-scrollbar-handle{background:${theme('styles.scrollbar.hover')}}
/* .os-theme-light>.os-scrollbar:hover>.os-scrollbar-track>.os-scrollbar-handle{background:rgba(255,255,255,.55)} */
.os-theme-dark>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle.active{background:${theme('styles.scrollbar.active')}}
/* .os-theme-light>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle.active{background:rgba(255,255,255,.7)} */
`;
