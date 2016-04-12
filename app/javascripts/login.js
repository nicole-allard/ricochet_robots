'use strict';

let React = require('react');

class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    login (evt) {
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
                    <button type="button">
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
