const Clock = L.Control.extend({
    _clock: null,
    _client: null,
    initialize: function(socketClient, options) {
        this.setOptions(this,options);
        this._client = socketClient;
        this._clock = L.DomUtil.create('div','clock');
        this._client.addHandler(this._update.bind(this));
    },
    render: function(gameTime) {
        let i = -32 * Math.floor(gameTime/375);
        this._clock.setAttribute('style', `background-position-y: ${i}px`);
    },
    onAdd: function () {
        return this._clock;
    },
    setOptions: function (options) {
        L.Util.setOptions(this, options);
    },
    _update(data) {
        this.render(data.timeOfDay);
    }
});

export default Clock;