import React, {Component} from "react";

import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const inlineStyle = {
    result: {
        display: "flex",
        padding: "5px",
        cursor: "move",
        position: "absolute",
        width: "200px",
        minHeight: "50px",
        textAlign: "center",
        borderRadius: "5px",
        border: "1px solid transparent",
        color: "#383836",
        background: "#d8e1e9",
        boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        overflow: "hidden",
        fontSize: "0.825rem",
        fontWeight: "500",
        /*display: "-webkit-box",
        WebkitLineClamp: "4",
        WebkitBoxOrient: "vertical"*/
    },
    info: {
        padding: 0,
        position: "absolute",
        borderRadius: "50%",
        display: "flex",
        top: "-10px",
        left: "-10px",
        backgroundColor: "#868785",
        color: "white",
        width: "25px",
        height: "25px",
        fontSize: "small",
        justifyContent: "center",
        alignItems: "center"
    },
    infoIcon: {
        width: "0.9em",
        height: "0.9em"
    },
    badge: {
        position: "absolute",
        borderRadius: "50%",
        display: "flex",
        top: "-10px",
        right: "-10px",
        backgroundColor: "#868785",
        color: "white",
        width: "25px",
        height: "25px",
        fontSize: "small",
        justifyContent: "center",
        alignItems: "center"
    },
    endpoint: {
        position: "absolute",
        top: "7px",
        right: "-35px",
        height: "2.5em",
        cursor: "pointer",
        color: "577a9b",
        border: "1px solid #577a9b",
        borderRadius: "0.5em",
        padding: "11px 2px",
        backgroundColor: "white",
        opacity: "0.8",
        zIndex: "400",
        WebkitTransition: "background-color 0.25s ease-in",
        MozTransition: "background-color 0.25s ease-in",
        transition: "background-color 0.25s ease-in"
    }
};

const ARROW_PATH = "/images/graphEditor/arrow.png";

export default class ResultNode extends Component {

    static propTypes = {
        result: PropTypes.object,
        level: PropTypes.object,
        indicatorSize: PropTypes.number,
        initNode: PropTypes.func,
        updateNode: PropTypes.func,
        removeNode: PropTypes.func,
        draggable: PropTypes.bool,
        selected: PropTypes.bool,
        showBadges: PropTypes.bool,
        onSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleOnClick = :: this.handleOnClick;
    }

    componentDidMount() {

        const {result, initNode} = this.props;

        if (initNode) {

            initNode({
                nodeId: this.rootRef.id,
                group: result.level,
                element: this.rootRef
            });
        }
    }

    componentDidUpdate() {
        const {result, updateNode} = this.props;

        if (updateNode) {
            updateNode({
                nodeId: result.key,
                group: result.level,
                element: this.rootRef
            });
        }
    }

    componentWillUnmount() {
        const {result, removeNode} = this.props;

        if (removeNode) {
            removeNode({
                nodeId: result.key,
                group: result.level,
                element: this.rootRef
            });
        }
    }

    handleOnClick(event) {
        const {result, onSelect} = this.props;

        event.stopPropagation();

        if (onSelect) {
            onSelect(result.key);
        }

        event.target.focus();
    }

    render() {
        const {result, level, indicatorSize, selected, draggable, showBadges} = this.props;

        const levelStyle = level ? level.nodeStyle : {};

        let style = {
            ...inlineStyle.result,
            ...levelStyle,
            ...result.style
        };

        if (selected) {
            style.background = "#A0C52A";
            style.zIndex = "500";
        }

        if (!draggable) {
            style.cursor = "pointer";
        }

        return (
            <div
                id={result.key}
                style={style}
                ref={ref => this.rootRef = ref}
                onClick={this.handleOnClick}
                tabIndex="-1"
            >

                <Typography style={inlineStyle.label}>{result.label}</Typography>

                {showBadges ? (
                    <div>

                        {result.description ? (

                            <Tooltip
                                title={result.description}
                                placement="left-start"
                            >
                                <IconButton style={inlineStyle.info}>
                                    <InfoIcon style={inlineStyle.infoIcon}/>
                                </IconButton>
                            </Tooltip>

                        ) : null}

                        <div style={inlineStyle.badge}>
                            <Typography>{indicatorSize}</Typography>
                        </div>

                    </div>
                ) : null}

                {selected ? (

                    <img
                        className="ep fade-in"
                        style={inlineStyle.endpoint}
                        alt="S"
                        src={ARROW_PATH}
                    />

                ) : null}

            </div>
        );
    }
}
