import _regeneratorRuntime from "babel-runtime/regenerator";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default function fromFile(file) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    //options
    if (!options.stroke) options.stroke = 10;

    var audio = new Audio();
    audio.src = file;

    var audioCtx = new AudioContext();
    var analyser = audioCtx.createAnalyser();

    var source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);

    analyser.fftSize = 64;
    var bufferLength = analyser.frequencyBinCount;

    var file_data = void 0;
    var temp_data = new Uint8Array(bufferLength);
    var getWave = void 0;
    var fdi = 0;
    var self = this;

    audio.addEventListener('loadedmetadata', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(audio.duration === Infinity)) {
                            _context.next = 6;
                            break;
                        }

                        _context.next = 3;
                        return new Promise(function (r) {
                            return setTimeout(r, 1000);
                        });

                    case 3:
                        audio.currentTime = 10000000 * Math.random();
                        _context.next = 0;
                        break;

                    case 6:

                        audio.currentTime = 0;
                        audio.play();

                    case 8:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    })));

    audio.onplay = function () {
        var findSize = function findSize(size) {

            for (var range = 1; range <= 40; range++) {
                var power = Math.pow(2, range);

                if (size <= power) return power;
            }
        };
        var d = audio.duration;
        audio.playbackRate = 16;

        d = d / audio.playbackRate;

        var drawRate = 20; //ms

        var size = d / (drawRate / 1000) * (analyser.fftSize / 2);
        size = findSize(size);
        file_data = new Uint8Array(size);

        getWave = setInterval(function () {
            analyser.getByteFrequencyData(temp_data);

            for (var data in temp_data) {
                data = temp_data[data];
                file_data[fdi] = data;
                fdi++;
            }
        }, drawRate);
    };

    audio.onended = function () {

        if (audio.currentTime === audio.duration && file_data !== undefined) {

            clearInterval(getWave);

            var canvas = document.createElement("canvas");
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;

            self.visualize(file_data, canvas, options);
            var image = canvas.toDataURL("image/jpg");
            self.onFileLoad(image);

            canvas.remove();
        }
    };
}