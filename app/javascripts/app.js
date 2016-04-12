'use strict';

let React = require('react');
let Login = require('./login');

module.exports = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            users: {},
            errs: {}
        };
    }

    componentDidMount () {
        this.socket = io();
        this.socket.on('game', this.updateGame.bind(this));
        this.socket.on('joined', this.onJoin.bind(this));
        this.socket.on('joinErr', this.handleErr.bind(this, 'join'));
    }

    updateGame (game) {
        this.setState(game);
    }

    /**
     * On a successful join, set username and clear out any
     * previous join errors
     *
     * @param  {String} username
     */
    onJoin (username) {
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
                        <div className="board">
                            {this.state.board.spaces.map((row, index) => {
                                return (
                                    <div className="row" key={index}>
                                        {row.map((cell, index) => {
                                            return (
                                                <div className={`cell ${cell.walls}`} key={index}>
                                                    {cell.robot ?
                                                        <span className={`robot ${cell.robot}`}></span> :
                                                        null
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
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
