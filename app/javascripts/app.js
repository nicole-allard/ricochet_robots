'use strict';

let React = require('react');

let Login = require('./login');
let Board = require('./board');

let constants = require('./constants');
let cookieUtils = require('./utils/cookies');

module.exports = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            users: {},
            errs: {},
            round: {}
        };
    }

    componentDidMount () {
        this.socket = io();
        this.socket.on('game', this.updateGame.bind(this));
        this.socket.on('joined', this.onJoin.bind(this));
        this.socket.on('joinErr', this.handleErr.bind(this, 'join'));
    }

    newRound (evt) {
        if (evt)
            evt.preventDefault();

        this.socket.emit('newRound');
    }

    updateGame (game) {
        this.setState(game);
    }

    /**
     * On a successful join, set username and clear out any
     * previous join errors. Also set a session auth cookie in
     * case the user is disconnected.
     *
     * @param  {String} username
     */
    onJoin (username) {
        cookieUtils.create(constants.AUTH_COOKIE, username);
        this.setState({
            username: username,
            errs: this.getUpdatedErrs('join', null)
        });
    }

    /**
     * Builds an object with all the current errs and a
     * newly updated key/value.
     *
     * @param  {String} key - The error key to reset
     * @param  {String} [value] - The new err value for
     *                            the given key
     * @return {Object}
     */
    getUpdatedErrs (key, value) {
        return Object.assign(this.state.errs, {
            [key]: value
        });
    }

    handleErr (key, value) {
        this.setState({
            errs: this.getUpdatedErrs(key, value)
        });
    }

    render () {
        return (
            <div>
                <ul>
                    {Object.keys(this.state.users).map((username) => {
                        return (
                            <li key={username}>
                                {JSON.stringify(this.state.users[username])}
                            </li>
                        );
                    }, this)}
                </ul>

                {this.state.username ?
                    this.state.board ?
                        <section>
                            <div>
                                {/* TODO disable button if round is currently in progress disabled={this.state.round.active}*/}
                                <button onClick={this.newRound.bind(this)} >Start New Round</button>
                            </div>
                            <Board
                                spaces={this.state.board.spaces}
                            />
                        </section>
                        : null
                    : <Login
                        socket={this.socket}
                        err={this.state.errs.join}
                    />
                }
            </div>
        );
    }
};
