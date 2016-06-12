'use strict';

let React = require('react');
let constants = require('./constants');

class Board extends React.Component {
    componentDidMount () {
    let doc = window.document;
        doc.addEventListener('keydown', this.handleKeyEvent);
        doc.addEventListener('keypress', this.handleKeyEvent);

    },

    componentWillUnmount () {
        let doc = window.document;
        doc.removeEventListener('keydown', this.handleKeyEvent);
        doc.removeEventListener('keypress', this.handleKeyEvent);
    },

    handleKeyEvent (evt) {
        // None of the keyboard shortcuts will use these modifiers
        if (evt.ctrlKey || evt.altKey || evt.metaKey || !_.size(this.state.shortcuts))
            return;

        const charCode = evt.which;

        // TODO: complete
    }

    render () {
        return <div className="board">
            {this.props.spaces.map((row, index) => {
                return (
                    <div className="row" key={index}>
                        {row.map((cell, index) => {
                            return (
                                <div className={`cell ${cell.walls}`} key={index}>
                                    {cell.robot ?
                                        <span className={`robot ${cell.robot}`}></span>
                                        : null
                                    }
                                    { cell.token ?
                                        <span className={`token ${cell.token}`}></span>
                                        : null
                                    }
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>;
    }
};

Board.propTypes = {
    spaces: React.PropTypes.array.isRequired,
    userHasAcceptedBid: React.PropTypes.bool.isRequired,
};

module.exports = Board;
