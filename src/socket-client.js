const _ = require('lodash');

export default class SocketClient {
  _connection = null
  _handlers = []
  _options = {
    url: `ws://${window.location.hostname}:8888`,
    debug: false,
    mock: null,
    logSocketOutput:false,
    retryMs: 15000
  }

  constructor(options) {
    this.setOptions(options);
  }

  setOptions(options) {
    if (options && options.url && options.url !== this._options.url && this._connection) {
      throw('Unable to change Socket URL while connection is open.');
    }
    _.merge(this._options,_.pick(options, _.keys(this._options)));
  }

  addHandler(callback) {
    if (typeof callback !== "function") {
      throw 'Message handler is not a function!';
    }
    this._handlers.push(callback);
  }

  removeHandler(callback) {
    let index = this._handlers.indexOf(callback);
    if (index !== -1) {
      this._handlers.splice(index,1);
    }
  }

  connect() {
    if(this._options.mock) {
      console.info('Mocking socket connection');
      this._connection = {}
      setInterval(()=>{this._onMessage({data:this._options.mock()})},5000)
    }else {
      if(this._connection) {
        if (this._options.debug) {
          console.warn('Unable to connect: Already connected.');
        }
        return;
      }
      if (this._options.debug) {
        console.info('Attempting to create a new connection.');
      }
      this._connection = new WebSocket(this._options.url);
      this._connection.onopen = this._onOpen.bind(this);
      this._connection.onclose = this._onClose.bind(this);
      this._connection.onerror = this._onError.bind(this);
      this._connection.onmessage = this._onMessage.bind(this);
    }
    
  }

  disconnect() {
    this._connection.close();
  }

  isConnected() {
    return !!this._connection;
  }
  _onOpen() {
    if (this._options.debug) {
      console.info('WebSocket connection opened.');
    }
  }

  _onClose() {
    if (this._options.debug) {
      console.warn(`WebSocket connection closed while in debug mode, manually reconnect.`);
    } else {
      console.warn(`WebSocket connection closed, retrying connection in ${this._options.retryMs} ms.`);
      this._connection = null;
      setTimeout(this.connect.bind(this), this._options.retryMs);
    }
  }

  _onError(error) {
    console.error('WebSocket Error:', error);
  }

  _onMessage (msg) {
    try {
      let data = JSON.parse(msg.data);
      if(this._options.logSocketOutput) {
        console.info('WebSocket Data:', data);
      }
      this._handlers.forEach((callback) => {
        callback(data);
      });
    }catch (error) {
      console.error('Error while hanling WebSocket message:', error);
    }
  }
}