export default class PlayerCard{
    _player = null;
    _marker = null;
    _li = null;
    _icon = null;
    _card = null;

    constructor(player, marker) {
        this._player = player;
        this._marker = marker;
        this._li = L.DomUtil.create('li', 'player-info');
        this._setupIcon();
        this._setupCard();
        L.DomEvent.disableClickPropagation(this._li);
    }
    _setupIcon() {
        this._icon = L.DomUtil.create('div', 'player-icon', this._li);
        L.DomEvent.on(this._icon,'click', this._marker.togglePopup)
        this._icon.innerHTML = `
            <img src="https://overviewer.org/avatar/${this._player.name}" width="16" height="32" />
        `;
    }
    _setupCard() {
        this._card = L.DomUtil.create('div', 'player-card', this._li);
        this._cardHTML();
    }
    _cardHTML() {
        this._card.innerHTML = `
            <div class="player-name">${this._player.name}</div>
            <div class="xp"><div class="level">${this._player.level}</div></div>
            <div class="hearts health-${Math.min(Math.ceil(this._player.health),20)}"></div>
            <div class="food hunger-${Math.min(Math.ceil(this._player.food),20)}"></div>
            <div class="air air-${Math.min(Math.ceil(this._player.air / 30),10)}"></div>
        `;
    }
    getElement() {
        return this._li;
    }
    updatePlayer(player) {
        if(player.name !== this._player.name) {
            console.warn('Attempted to update a player with differing names');
            return;
        }
        this._player = player;
        this._cardHTML();
    }
}