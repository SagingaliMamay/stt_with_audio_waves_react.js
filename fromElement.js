export default function fromElement(element_id, canvas_id, options) {
  var globalAccessKey = [options.globalAccessKey || '$wave'];
  var initGlobalObject = function initGlobalObject(elementId) {
    window[globalAccessKey] = window[globalAccessKey] || {};
    window[globalAccessKey][elementId] = window[globalAccessKey][elementId] || {};
  };

  var getGlobal = options['getGlobal'] || function (elementId, accessKey) {
    initGlobalObject(elementId);
    return window[globalAccessKey][elementId][accessKey];
  };

  var setGlobal = options['setGlobal'] || function (elementId, accessKey, value) {
    var returnValue = getGlobal(elementId);
    if (!returnValue) {
      window[globalAccessKey][elementId][accessKey] = window[globalAccessKey][elementId][accessKey] || value;
      returnValue = window[globalAccessKey][elementId][accessKey];
    }
    return returnValue;
  };

  var waveContext = this;
  var element = document.getElementById(element_id);
  if (!element) return;
  element.crossOrigin = 'anonymous';

  function run() {
    //user gesture has happened
    this.activated = true;

    //track current wave for canvas
    this.activeCanvas = this.activeCanvas || {};
    this.activeCanvas[canvas_id] = JSON.stringify(options);

    //track elements used so multiple elements use the same data
    this.activeElements[element_id] = this.activeElements[element_id] || {};
    if (this.activeElements[element_id].count) this.activeElements[element_id].count += 1;else this.activeElements[element_id].count = 1;

    var currentCount = this.activeElements[element_id].count;

    var audioCtx = setGlobal(element.id, 'audioCtx', new AudioContext());
    var analyser = setGlobal(element.id, 'analyser', audioCtx.createAnalyser());

    var source = getGlobal(element.id, 'source');
    if (source) {
      if (source.mediaElement !== element) {
        source = audioCtx.createMediaElementSource(element);
      }
    } else {
      source = audioCtx.createMediaElementSource(element);
    }
    setGlobal(element.id, 'source', source);

    //beep test for ios
    var oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 1;
    oscillator.connect(audioCtx.destination);
    oscillator.start(0);
    oscillator.stop(0);

    source.connect(analyser);
    source.connect(audioCtx.destination);

    analyser.fftsize = 32768;
    var bufferLength = analyser.frequencyBinCount;
    var data = new Uint8Array(bufferLength);
    var frameCount = 1;

    function renderFrame() {
      //only run one wave visual per canvas
      if (JSON.stringify(options) !== this.activeCanvas[canvas_id]) {
        return;
      }

      //if the element or canvas go out of scope, stop animation
      if (!document.getElementById(element_id) || !document.getElementById(canvas_id)) return;

      requestAnimationFrame(renderFrame);
      frameCount++;

      //check if this element is the last to be called
      if (!(currentCount < this.activeElements[element_id].count)) {
        analyser.getByteFrequencyData(data);
        this.activeElements[element_id].data = data;
      }

      this.visualize(this.activeElements[element_id].data, canvas_id, options, frameCount);
    }

    renderFrame = renderFrame.bind(this);
    renderFrame();
  }

  var create = function create() {
    //remove all events
    ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click', 'play'].forEach(function (event) {
      element.removeEventListener(event, create, { once: true });
    });

    run.call(waveContext);
  };

  if (this.activated || options['skipUserEventsWatcher']) {
    run.call(waveContext);
  } else {
    //wait for a valid user gesture
    document.body.addEventListener('touchstart', create, { once: true });
    document.body.addEventListener('touchmove', create, { once: true });
    document.body.addEventListener('touchend', create, { once: true });
    document.body.addEventListener('mouseup', create, { once: true });
    document.body.addEventListener('click', create, { once: true });
    element.addEventListener('play', create, { once: true });
  }
}