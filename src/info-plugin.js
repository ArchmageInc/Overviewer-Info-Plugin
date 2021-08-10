const SocketClient = require('./socket-client.js').default;
const PlayerLocations = require('./player-locations.js').default;
const PlayerList = require('./player-list.js').default;
const Clock = require('./clock.js').default;
const OptionManager = require('./option-manager.js').default;
const ExclusionManager = require('./exclusion-manager.js').default;
const _ = require('lodash');

export default class InfoPlugin {
  _client = null
  _options = {
    showClock: true,
    showPlayerLocations: true,
    showPlayerList: true,
    showCreatureLocations: true,
    debug: false
  }
  _layer = null
  clock = null
  playerLocations = null
  playerList = null
  creatureLocations = null
  optionManager = null
  exclusionManager = null

  constructor(options) {
    this._client = new SocketClient(options);
    this._layer = L.layerGroup();
    this.optionManager = new OptionManager();
    this.exclusionManager = new ExclusionManager(this._client, options);
    this.playerLocations = new PlayerLocations(this._client, this._layer, options);
    this.playerList = new PlayerList(this._client, this._layer, this.playerLocations, options);
    this.clock = new Clock(this._client, options);
    this.setOptions(options);
    overviewer.util.ready(this.initialize.bind(this));
  }

  initialize() {
    if (!this._client.isConnected()) {
      this._client.connect();
    }
    this._layer.addTo(overviewer.map);
    this.playerList.addTo(overviewer.map);
    this.clock.addTo(overviewer.map);
  }

  setOptions(options) {
    _.merge(this._options, _.pick(options, _.keys(this._options)));
    this._client.setOptions(options);
    this.playerLocations.setOptions(options);
    this.playerList.setOptions(options);
    this.clock.setOptions(options);
  }

  debug() {
    this.setOptions({debug: true});
  }
}