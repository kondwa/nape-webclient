import React, {Children, Component, cloneElement} from "react";

import PropTypes from "prop-types";

export default class ResultLevelContainer extends Component {

    static propTypes = {
        children: PropTypes.array,
        initGroup: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            nodes: []
        };
    }

    render() {

        const {children, initGroup} = this.props;

        return (
            <div>
                {Children.map(children, child => {
                    if (typeof child === "string" || typeof child === "number" || child === null || typeof child === "undefined") {
                        return child;
                    }

                    return cloneElement(child, {
                        ...child.props,
                        initGroup: initGroup
                    });
                })}
            </div>
        );
    }

}
