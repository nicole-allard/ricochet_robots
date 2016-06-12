'use strict';

const React = require('react');

const Login = require('./login');
const Board = require('./board');
let Actions = require('./actions');

const constants = require('./constants');
const cookieUtils = require('./utils/cookies');

module.exports = class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: null,
            users: {},
            errs: {},
            round: {},
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

        if (this.state.round.active &&
            !window.confirm('Are you sure you want to stop the current round?')
        )
            return;

        this.socket.emit('newRound');
    }

    submitBid (bid) {
        this.socket.emit('bid', bid);
    }

    updateGame (game) {
        this.setState(game);
    }

    /**
     * On a successful join, set username and clear out any
     * previous join errors. Also set a session auth cookie in
     * case the user is disconnected.
     *
     * @param  {String} username - the name of the user who has joined
     */
    onJoin (username) {
        cookieUtils.create(constants.AUTH_COOKIE, username);
        this.setState({
            username,
            errs: this.getUpdatedErrs('join', null),
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
                            <Actions
                                newRound={this.newRound.bind(this)}
                                isRoundActive={!!this.state.round.active}
                                submitBid={this.submitBid.bind(this)}
                            />
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
