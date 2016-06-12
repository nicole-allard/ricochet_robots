'use strict';

let React = require('react');
let constants = require('../constants');
let cookieUtils = require('../utils/cookies');

class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        this.loginFromCookie();
    }

    componentDidUpdate(prevProps) {
        // If the socket was not passed during mounting then the cookie
        // login attempt will have failed. Try again.
        if (!prevProps.socket && this.props.socket)
            this.loginFromCookie();
    }

    loginFromCookie () {
        // Automatically submit username from cookie, if it exists
        let username = cookieUtils.read(constants.AUTH_COOKIE);
        if (username) {
            this.setState({
                username: username
            }, this.login.bind(this));
        }
    }

    login (evt) {
        if (!this.props.socket)
            return;

        if (evt)
            evt.preventDefault();

        this.props.socket.emit('join', this.state.username);
        this.setState({
            username: ''
        });

        return false;
    }

    updateUsername (evt) {
        this.setState({
            username: evt.target.value
        });
    }

    render () {
        return (
            <div>
                <form name="join" onSubmit={this.login.bind(this)}>
                    <input type="text" placeholder="username" value={this.state.username} onChange={this.updateUsername.bind(this)} />
                    <button type="submit">
                        Join Game
                    </button>
                </form>
                {this.props.err ?
                    this.props.err
                    : null
                }
            </div>
        );
    }
};

Login.PropTypes = {
    socket: React.PropTypes.object,
    err: React.PropTypes.string
};

module.exports = Login;
