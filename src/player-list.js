const PlayerCard = require('./player-card.js').default;

const PlayerList = L.Control.extend({
    options: {
        debug: false,
        showPlayerList: true,
        position: 'topleft'
    },
    _client: null,
    _players: [],
    _oldPlayers: [],
    _state: {
        open: true
    },
    _parentLayer: null,
    _listContainer: null,
    _listToggle: null,
    _toggelButton: null,
    _listProper: null,
    _playerLocations: null,

    initialize: function(socketClient, parentLayer, playerLocations, options) {
        this._client = socketClient;
        this._parentLayer = parentLayer;
        this._playerLocations = playerLocations;
        this._client.addHandler(this._onMessage.bind(this));
        this.setOptions(options);

        this._listContainer = L.DomUtil.create('div', 'player-list-container');
        this._listToggle = L.DomUtil.create('div', 'list-toggle', this._listContainer);
        this._listProper = L.DomUtil.create('ul', 'player-list', this._listContainer);
    },

    render: function() {
        _.differenceBy(this._oldPlayers,this._players,'name').forEach((player)=>{
            player.card.getElement().remove();
        });
        _.differenceBy(this._players,this._oldPlayers,'name').forEach((player)=>{
            this._playerHTML(player);
        });
        _.intersectionBy(this._oldPlayers,this._players,'name').forEach((player)=>{
            let newPlayer = _.find(this._players,{name: player.name});
            newPlayer.card = player.card;
            newPlayer.card.updatePlayer(newPlayer);
        });
        this._listToggleHTML();
    },

    onAdd: function() {
        return this._listContainer;
    },

    toggle: function() {
        this._state.open = !this._state.open;
        this.render(this._players);
    },

    setOptions: function(options) {
        _.merge(this.options, _.pick(options, _.keys(this.options)));
        L.Util.setOptions(this,options);
    },

    _playerHTML: function(player) {
        let card = new PlayerCard(player, this._playerLocations.getMarker(player))
        player.card = card;
        this._listProper.appendChild(card.getElement());
    },

    _listToggleHTML: function() {
        if(!this._toggleButton) {
            this._toggleButton = L.DomUtil.create('div', 'toggle-button', this._listToggle);
            L.DomEvent.on(this._toggleButton, 'click', this.toggle, this);
        }
        if (this._state.open) {
            this._toggleButton.innerHTML = '◀';
            this._listProper.removeAttribute('style');
        } else {
            this._toggleButton.innerHTML = '▶';
            this._listProper.setAttribute('style','display:none;');
        }
    },

    _onMessage: function(data) {
        this._oldPlayers = this._players;
        this._players = data.players;
        this.render();
    }
});

export default PlayerList;