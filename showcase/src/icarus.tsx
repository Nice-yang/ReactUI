import * as React from 'react';
import { injectGlobal } from 'styled-components';
import AlbumArt from './components/AlbumArt';
import Page from './components/Page';
import Seeker from './components/Seeker';

export const ContextProvider = props => props.children;

// tslint:disable-next-line no-unused-expression
injectGlobal`
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css?family=Roboto:400,600,700');

body {
  font-family: 'Roboto', sans-serif;
}

* {
  box-sizing: border-box;
}
`;

export const workspace = [
  {
    title: 'Page',
    instances: [<Page />],
  },
  {
    title: 'Album Art',
    instances: [
      <div style={{ width: 200, height: 200 }}>
        <AlbumArt src="https://upload.wikimedia.org/wikipedia/en/6/6e/Opus_Eric_Prydz_cover_artwork.jpg" />
      </div>,
      <div style={{ width: 200, height: 200 }}>
        <AlbumArt src="https://consequenceofsound.files.wordpress.com/2015/05/unnamed.png?w=760&h=760&crop=1" />
      </div>,
    ],
  },
  {
    title: 'Seeker',
    instances: [<Seeker currentTime={108} endTime={671} />],
  },
];

const event = new CustomEvent('icarus-build', {
  detail: {
    workspace,
    ContextProvider,
    mainFile:
      '/Users/atifafzal/scratch/personal/icarus/showcase/src/icarus.tsx',
    prettierConfig:
      '/Users/atifafzal/scratch/personal/icarus/showcase/.prettierrc',
  },
});

document.dispatchEvent(event);
