import fromElement from './fromElement.js';
import fromFile from './fromFile.js';
import fromStream from './fromStream.js';
import visualize from './visualize.js';

'use strict';

function Wave() {
  this.current_stream = {};
  this.sources = {};
  this.onFileLoad = null;
  this.activeElements = {};
  this.activated = false;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

Wave.prototype = Object.assign({
  fromElement: fromElement,
  fromFile: fromFile
}, fromStream, {
  visualize: visualize
});

export default Wave;