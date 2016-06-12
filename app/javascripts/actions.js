'use strict';

const React = require('react');

class Actions extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            numMoves: 0,
        };
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
};

module.exports = Actions;
