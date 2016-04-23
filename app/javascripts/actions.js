'use strict';

let React = require('react');
let constants = require('./constants');

class Actions extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            numMoves: 0
        };
    }

    updateNumMoves (evt) {
        // TODO: make this work :(
        // for ex: it shouldn't parse input value if it wasn't a number
        let delta = typeof(evt) === 'number' ?
            evt :
            parseInt(evt.target.value);

        this.setState({
            numMoves: this.state.numMoves + delta
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
                        <input type="text" value={this.state.numMoves} onChange={this.updateNumMoves.bind(this)} />
                        <button onClick={this.updateNumMoves.bind(this, 1)}>
                            +
                        </button>
                    </div>
                    : null
                }
            </div>
        );
    }
};

Actions.PropTypes = {
    newRound: React.PropTypes.func.isRequired,
    isRoundActive: React.PropTypes.bool
};

module.exports = Actions;
