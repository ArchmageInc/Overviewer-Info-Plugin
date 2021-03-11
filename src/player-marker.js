const MapUtils = require('./map-utils.js').default;

const PlayerMarker = L.Marker.extend({
    _popup: null,
    _player: null,
    _parentLayer: null,
    initialize: function(player, parentLayer) {
        this._player = player;
        this._parentLayer = parentLayer
        this.togglePopup = this.togglePopup.bind(this);
        L.Util.setOptions(this, {
            title: player.name
        });
        this.setIcon(
            L.icon({
                iconUrl: `https://overviewer.org/avatar/${player.name}`,
                iconSize: [16, 32],
                iconAnchor: [8, 32],
                popupAnchor: [0, -32]
            })
        )
        .bindPopup(
            L.popup({
                closeButton: false,
                keepInView: true,
                autoPanPadding: [40, 40],
                className: 'player-location-popup'
            })
            .setContent((layer) => { return `<div>${this._player.name}</div>
                <div class="xp"><div class="level">${this._player.level}</div></div>
                <div class="hearts health-${Math.min(Math.ceil(this._player.health),20)}"></div>
                <div class="food hunger-${Math.min(Math.ceil(this._player.food),20)}"></div>
                <div class="air air-${Math.min(Math.ceil(this._player.air / 30),10)}"></div>`
            })
        )
        .setPosition(player.position)
        .addTo(this._parentLayer);
    },
    setPosition: function(position) {
        this.setLatLng(MapUtils.getDimensionalLocation(position));
        return this;
    },
    updatePlayer: function(player) {
        this._player = player;
        this.setPosition(player.position);
        if (this.isPopupOpen()) {
            this.getPopup().update();
        }
    },
    togglePopup: function() {
        if (!this.isPopupOpen()) {
            overviewer.map.flyTo(this.getLatLng());
        }
        L.Marker.prototype.togglePopup.call(this);
    }
});

export default PlayerMarker;