'use strict';

let React = require('react');

module.exports = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {}
        };
    }

    componentDidMount () {
        this.socket = io();
        this.socket.on('game', Function.bind.call(this.updateGame, this));
    }

    updateGame (game) {
        this.setState({
            users: game.users
        });
    }

    login (evt) {
        evt.preventDefault();
        const username = this.refs.username.value;
        this.socket.emit('join', username);
        return false;
    }

    render () {
        return (
            <div>
                <form name="join" onSubmit={this.login.bind(this)}>
                    <input type="text" ref="username" placeholder="username" />
                    <button type="button">
                        Join Game
                    </button>
                </form>

                <ul>
                    {Object.keys(this.state.users).map(function (username) {
                        return (<li>{JSON.stringify(this.state.users[username])}</li>);
                    }, this)}
                </ul>
            </div>
        );
    }
};
