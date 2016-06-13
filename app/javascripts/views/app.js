'use strict';

const React = require('react');

const Login = require('./login');
const Board = require('./board');
let Actions = require('./actions');

const constants = require('../constants');
const cookieUtils = require('../utils/cookies');

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
        // TODO: Handle timezones
        this.socket.emit('bid', bid, new Date().getTime());
    }

    updateGame (game) {
        this.setState(game);
    }

    getActiveBidIndex () {
        if (!this.state.round.active)
            return -1;


        return this.state.round.bids.findIndex(bid => bid.status === 'accepted');
    }

    moveRobot (color, dir) {
        let activeBidIndex = this.getActiveBidIndex();
        let activeBid = this.state.round.bids[activeBidIndex];
        if (!activeBid || activeBid.username !== this.state.username)
            return;

        let newMoves = activeBid.moves.slice(0);
        let latestMove = newMoves[newMoves.legnth - 1];
        if (latestMove.color !== color) {
            latestMove = {
                color,
                moves: [],
            };

            newMoves.push(latestMove);
        }

        let bidsCopy = this.state.round.bids.slice(0);
        bidsCopy.splice(activeBidIndex, 1, Object.assign({}, activeBid, {
            moves: newMoves
        }))

        latestMove.moves.push(dir);
        this.setState({
            round: Object.assign({}, this.state.round, {
                bids: bidsCopy
            }),
        });
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
        const activeBidIndex = this.getActiveBidIndex();
        const activeBid = activeBidIndex > -1 && this.state.round.bids[activeBidIndex];
        return (
            <div>
                <ul>
                    {Object.keys(this.state.users).map(username => {
                        return (
                            <li key={username}>
                                {JSON.stringify(this.state.users[username])}
                            </li>
                        );
                    }, this)}
                </ul>

                <ul>
                    {(this.state.round.bids || []).map((bid, i) => {
                        return (
                            <li key={i}>
                                <b>{`${bid.username} : ${bid.bid}`}</b>
                                <i>{bid.timestamp}</i>
                                {JSON.stringify(bid.moves || [])}
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
                                timeout={this.state.round.timeout}
                                activeBid={activeBid}
                                userHasAcceptedBid={activeBid.username === this.state.username}
                                moveRobot={this.moveRobot.bind(this)}
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
