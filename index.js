// Jaimito - Speech API Wrapper
(function () {
  var Jaimito = {
    _defaults: function _defaults() {
      return {
        lang: 'en-US',
        voice: this.getVoiceByName('Ellen'),
        text: 'Hello World!',
        volume: 1, // 0 to 1
        rate: 1, // 0.1 to 10
        pitch: 1 //0 to 2
      }
    },
    // This is expecting an Array of Arrays
    // [['message1', 'message2', 'message3'], ['message1']]
    say: function talk(messages, config) {
      this._sayArray(messages, config);
    },
    getVoiceByName: function getVoiceByName(name) {
      var selectedVoice;

      return window.speechSynthesis.getVoices().some(function (voice) {
        if (voice.name === name) {
          return selectedVoice = voice;
        }
      });
    },
    _sayArray: function sayArray(messages, config) {
      messages.forEach(function (message) {
        if (typeof message === 'Array') {
          return this._sayArray(message, config);
        }

        this._say(message, config);
      }, this);
    },
    _say: function _say(message, config) {
      var msg = new SpeechSynthesisUtterance(message);
      Object.assign(msg, this._defaults(), config);
      msg.text = message;

      window.speechSynthesis.speak(msg);
    }
  };

  window.Jaimito = Jaimito;
}());

// Tuit - Tweet DOM wrapper
(function () {
  function Tuit(params, tuitero) {
    this.tuitero = tuitero;
    this.box = params.box;

    this.init();
  }

  Tuit.prototype = {
    playEntity: '<div class="tuit-play" style="position: absolute; top: 5px; right: 5px; cursor: pointer;">&#9658; Play</div>',
    tuitTextSelector: '.js-tweet-text',
    init: function init() {
      this._setText();
      this._appendPlayEntity();
    },
    _appendPlayEntity: function _appendPlayEntity() {
      this.box.style.position = 'relative';
      this.box.insertAdjacentHTML('beforeend', this.playEntity);
      this._bindPlayEntityEvents();
    },
    _bindPlayEntityEvents: function _bindPlayEntityEvents() {
      var that = this;
      this.box.querySelector('.tuit-play').addEventListener('click', function () {
        that.tuitero.say(that.text);
      });
    },
    _setText: function _setText() {
      var authorName = this.box.querySelector('.fullname').textContent;
      var authorHandler = this.box.querySelector('.username').textContent;
      var date = this.box.querySelector('._timestamp').textContent;
      var textWrapper = this.box.querySelector(this.tuitTextSelector);

      this.text = [authorName, authorHandler, date];

      if (textWrapper !== null) {
        var text = this._sanitizeText(textWrapper.textContent);
        this.text.push(text);
      } else {
        this.text.push('No text');
      }
    },
    _sanitizeText: function _sanitizeText(text) {
      var picTwitter = /pic.twitter.com.*\s?$/g
      var urls = /(?:https?|ftp):\/\/[\n\S]+/g
      text = text.replace(picTwitter, '');
      text = text.replace(urls, '');

      return text;
    },
    addText: function addText(text) {
      this.text.push(text);
    }
  };

  window.Tuit = Tuit;
}());

// Tuitero - Tweet reader
(function () {
  function Tuitero() {
    this.init();
  }

  Tuitero.prototype = {
    playAllEntity: '<button id="tuitero-say-all" type="button" class="btn"><span class="button-text">&#9658; Play All</span></button>',
    init: function init() {
      this.brain = {tuits: []};
      this._appendEachTuit();
      this._appendPlayAll();
    },
    _appendEachTuit: function _appendEachTuit() {
      var that = this;
      Array.prototype.forEach.call(document.querySelectorAll('.js-stream-item[data-item-type="tweet"]'), function (item) {
        that.brain.tuits.push(new Tuit({box: item}, that));
      });
    },
    _appendPlayAll: function _appendPlayAll() {
      document.querySelector('.ProfileNav-list .UserActions').insertAdjacentHTML('beforeend', this.playAllEntity);
      this._bindPlayAllEntityEvents();
    },
    _bindPlayAllEntityEvents: function _bindPlayEntityEvents() {
      var that = this;
      document.getElementById('tuitero-say-all').addEventListener('click', function (event) {
        that.brain.tuits.forEach(function (tuit) {
          that.say(tuit.text)
        });
      });
    },
    say: function say(input) {
      window.Jaimito.say(input);
    }
  };

  window.Tuitero = Tuitero;
}());

window.tuitero = new Tuitero();
