const _ = require('lodash');
const PlayerMarker = require('./player-marker.js').default;

export default class PlayerLocations {
    _options = {
        debug: false,
        showPlayerLocations: true
    }
    _players = []
    _markers = {}
    _client = null
    _layer = null
    _parentLayer = null;

    constructor(socketClient, parentLayer, options) {
        this._parentLayer = parentLayer;
        this._layer = L.layerGroup();
        this.setOptions(options);
        this._client = socketClient;
        this._client.addHandler(this._onMessage.bind(this));
        overviewer.util.ready(this.initialize.bind(this));
    }

    initialize() {
        this._layer.addTo(this._parentLayer);
        overviewer.map.on('baselayerchange', this.updatePlayers.bind(this));
    }

    updatePlayers() {
        this._clearOfflinePlayers();
        this._players.forEach((player) => {
            let marker = this._markers[player.name];
            if (!marker) {
                marker = new PlayerMarker(player, this._layer);
                this._markers[player.name] = marker;
            }
            marker.updatePlayer(player);
        });
    }

    setOptions(options) {
        _.merge(this._options, _.pick(options, _.keys(this._options)));
        if (!options.showPlayerLocations) {
            this._layer.removeFrom(this._parentLayer)
        }else{
            this._layer.addTo(this._parentLayer);
        }
    }

    getMarker(player) {
        return this._markers[player.name];
    }

    _clearOfflinePlayers() {
        for (let name in this._markers) {
            if (!this._players.filter((player) => {return player.name === name}).length) {
                this._markers[name].remove();
                delete this._markers[name];
            }
        }
    }
    _onMessage(data) {
        this._players = data.players;
        this.updatePlayers();
    }
}