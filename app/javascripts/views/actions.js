'use strict';

const React = require('react');
const constants = require('../constants');

class Actions extends React.Component {
    constructor (props) {
        super(props);

        this.handleKeyEvent = this.handleKeyEvent.bind(this);

        this.state = {
            numMoves: 0,
            timeRemaining: Infinity,
            activeColor: null,
        };
    }

    componentDidMount () {
        let doc = window.document;
        doc.addEventListener('keydown', this.handleKeyEvent);
    }

    componentWillUnmount () {
        let doc = window.document;
        doc.removeEventListener('keydown', this.handleKeyEvent);
    }

    handleKeyEvent (evt) {
        // None of the keyboard shortcuts will use modifiers
        // Ignore keys pressed within inputs, those should be handled elsewhere
        if (evt.ctrlKey || evt.altKey || evt.metaKey || evt.target.tagName === 'input')
            return;

        const charCode = evt.which;
        const funcArgs = constants.HOTKEYS[charCode];
        if (!funcArgs)
            return;

        const func = this[funcArgs[0]];
        if (!func)
            return;

        func.apply(this, funcArgs.slice(1));
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
        if (this.props.activeBid)
            return;

        this.setState({
            numMoves: value,
        });
    }

    submitBid () {
        if (this.props.activeBid)
            return;

        this.props.submitBid(this.state.numMoves);
    }

    newRound () {
        this.props.newRound();
    }

    switchColor (color) {
        this.setState({
            activeColor: color
        });
    }

    move (dir) {
        this.props.moveRobot(this.state.activeColor, dir);
    }

    render () {
        return (
            <div>
                <div>
                    <button onClick={this.newRound.bind(this)}>
                        Start New Round
                    </button>
                </div>
                {this.props.isRoundActive ?
                    <div>
                        {this.state.timeRemaining < Infinity ?
                            <div>
                                Time remaining: {this.state.timeRemaining}
                            </div>
                            : null
                        }

                        {!this.props.activeBid ?
                            <div>
                                <button onClick={this.updateNumMoves.bind(this, -1)}>
                                    -
                                </button>
                                <input type="text" value={this.state.numMoves} onChange={evt => { evt.preventDefault(); this.setNumMoves(evt.target.value); }} />
                                <button onClick={this.updateNumMoves.bind(this, 1)}>
                                    +
                                </button>
                                <button onClick={this.submitBid.bind(this)}>
                                    Submit
                                </button>
                            </div>
                            : null
                        }

                        {this.props.userHasActiveBid ?
                            <div>
                                Please move the robots
                            </div>
                            : null
                        }
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
    activeBid: React.PropTypes.shape({
        bid: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        moves: React.PropTypes.array.isRequired,
    }),
    userHasActiveBid: React.PropTypes.bool.isRequired,
    moveRobot: React.PropTypes.func.isRequired,
};

module.exports = Actions;
