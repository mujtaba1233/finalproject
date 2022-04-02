import React, { Component, Fragment } from 'react';

export default class ViewProductOptions extends Component {

    render() {
        return (
            <Fragment><p className="lighter-note small-p"><a href="javascript:;" data-toggle="collapse" data-target={'#' + this.props.code}>View list of options I selected</a></p>
                <div id={this.props.code} className="collapse">
                    <ul>
                        {Object.keys(this.props.options).map(key => {
                            return <li>{this.props.options[key].type}: {this.props.options[key].name}</li>
                        })}
                    </ul>
                </div>
            </Fragment>
        )
    }
}
