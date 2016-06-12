'use strict';

const React = require('react');

class Actions extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            numMoves: 0,
            timeRemaining: Infinity,
        };
    }

    componentWillReceiveProps (newProps) {
        if (!this.props.timeout && newProps.timeout) {
            this.setTimeRemaining(newProps.timeout);

            if (this.timer)
                clearInterval(this.timer);

            this.timer = setInterval(this.setTimeRemaining.bind(this), 1000);
        }
    }

    setTimeRemaining (timeout) {
        if (!timeout)
            timeout = this.props.timeout;

        this.setState({
            timeRemaining: Math.floor(Math.max((this.props.timeout - new Date().getTime()) / 1000, 0)),
        });
    }

    updateNumMoves (delta) {
        this.setNumMoves(Math.max(0, (parseInt(this.state.numMoves, 10) || 0) + parseInt(delta, 10)));
    }

    setNumMoves (value) {
        this.setState({
            numMoves: value,
        });
    }

    render () {
        return (
            <div>
                <div>
                    <button onClick={this.props.newRound}>
                        Start New Round
                    </button>
                </div>
                {this.props.isRoundActive ?
                    <div>
                        <div>
                            {this.state.timeRemaining < Infinity ?
                                <span>Time remaining: {this.state.timeRemaining}</span>
                                : null
                            }
                        </div>
                        <button onClick={this.updateNumMoves.bind(this, -1)}>
                            -
                        </button>
                        <input type="text" value={this.state.numMoves} onChange={evt => { this.setNumMoves(evt.target.value); }} />
                        <button onClick={this.updateNumMoves.bind(this, 1)}>
                            +
                        </button>
                        <button onClick={() => { this.props.submitBid(this.state.numMoves); }}>
                            Submit
                        </button>
                    </div>
                    : null
                }
            </div>
        );
    }
}

Actions.PropTypes = {
    newRound: React.PropTypes.func.isRequired,
    isRoundActive: React.PropTypes.bool,
    submitBid: React.PropTypes.func.isRequired,
    timeout: React.PropTypes.number,
};

module.exports = Actions;
