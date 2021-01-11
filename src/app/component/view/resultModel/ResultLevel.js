import React, {Component} from "react";

import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const inlineStyle = {
    level: {
        display: "inline-block",
        position: "relative",
        height: "200px",
        borderBottom: "1px solid",
        minWidth: "100%",
        left: "0",
        right: "0"
    },
    label: {
        marginTop: "10px",
        marginLeft: "10px"
    }
};

export default class ResultLevel extends Component {

    static propTypes = {
        level: PropTypes.object,
        visible: PropTypes.bool,
        initGroup: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            nodes: []
        };
    }

    componentDidMount() {

        const {level, initGroup} = this.props;

        if (initGroup) {

            const initConfig = {
                groupId: level.key,
                element: this.rootRef
            };

            initGroup(initConfig);
        }
    }

    render() {
        const {level, visible} = this.props;

        let style = {
            ...inlineStyle.level,
            ...level.style
        };

        if (!visible) {
            style.borderBottom = "1px transparent";
        }

        return (
            <div
                id={level.key}
                ref={ref => this.rootRef = ref}
                style={style}
            >
                {visible ? (

                    <div>
                        <Typography
                            variant="subtitle1"
                            style={inlineStyle.label}
                        >
                            {level.label}
                        </Typography>

                        <Typography
                            variant="caption"
                            style={inlineStyle.label}
                        >
                            {level.description}
                        </Typography>
                    </div>
                ) : null}
            </div>
        );
    }
}
