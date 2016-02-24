// VanGogh - Tweet with your voice
(function () {
  var VanGogh = {
    options: {
      lang: 'es-VE',
      continuous: true,
      interimResults: false,
    },
    instance: null,
    listenEntity: '<button id="van-gogh-start" type="button" class="btn"><span class="button-text">Start Listening</span></button>',
    init: function init() {
      this._appendButton();
      this._bindOnClick();
    },
    _appendButton: function _appendButton() {
      document.querySelector('.ProfileNav-list .UserActions').insertAdjacentHTML('beforeend', this.listenEntity);
    },
    _bindOnClick: function _bindOnClick() {
      var vanGogh = this;

      document.getElementById('van-gogh-start').addEventListener('click', function () {
        if (vanGogh.instance) {
          vanGogh.instance.stop();
          vanGogh.instance = null;
        }

        vanGogh._initRecognition();
      });
    },
    _initRecognition: function _initRecognition() {
      var recognition = new webkitSpeechRecognition();
      this.instance = recognition;
      Object.assign(recognition, this.options);
      recognition.onresult = this._onResult.bind(this);
      recognition.start();

      document.getElementById('van-gogh-start').textContent = 'Listening';
    },
    _onResult: function _onResult(event) {
      var length = event.results.length - 1;
      var transcript = event.results[length][0].transcript.trim();
      var command = this.getCommand(transcript);

      console.log(transcript);

      if (this.hasOwnProperty(command)) {
        return this[command](transcript);
      }

      if (this.writing) {
        this.writeMessage(transcript);
      }
    },
    getCommand: function isCommand(transcript) {
      var command;

      Object.keys(this._commands).forEach(function (key) {
        if (this._commands[key] === transcript.toLowerCase()) {
          command = key;
        }
      }, this);

      return command;
    },
    _commands: {
      newMessage: 'nuevo mensaje',
      sendMessage: 'enviar mensaje',
      deleteMessage: 'borrar mensaje'
    },
    deleteMessage: function deleteMessage(transcript) {
      document.getElementById('tweet-box-global').textContent = '';
    },
    newMessage: function newMessage(transcript) {
      console.log('New message');
      document.getElementById('global-new-tweet-button').click();
      this.writing = true;
    },
    writeMessage: function writeMessage(transcript) {

      if (!this.writing) {
        return;
      }

      var tweetContent = document.getElementById('tweet-box-global').textContent;
      console.log('Writing: ' + transcript);
      document.getElementById('tweet-box-global').textContent = tweetContent + ' ' + transcript;
    },
    sendMessage: function sendMessage(transcript) {
      this.writing = false;
      console.log('Sending message');
      document.querySelectorAll('.js-tweet-btn:not(.disabled)')[0].click();
    },
  };

  window.VanGogh = VanGogh;
}());

window.VanGogh.init();
