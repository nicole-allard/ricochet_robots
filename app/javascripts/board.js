'use strict';

let React = require('react');
let constants = require('./constants');

class Board extends React.Component {
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
    spaces: React.PropTypes.array
};

module.exports = Board;
