import {Treebeard, decorators} from "react-treebeard";

import Badge from "@material-ui/core/Badge";
import CityIcon from "@material-ui/icons/LocationCity";
import {Component} from "react";
import CountryIcon from "@material-ui/icons/Map";
import GlobalIcon from "@material-ui/icons/Public";
import OrganizationIcon from "@material-ui/icons/Business";
import ProgramIcon from "@material-ui/icons/AccessTime";
import ProjectIcon from "@material-ui/icons/Work";
import PropTypes from "prop-types";
import React from "react";
import RegionIcon from "@material-ui/icons/Terrain";

const styles = {
    tree: {
        base: {
            listStyle: "none",
            margin: "0 0 0 20px",
            padding: 0,
            background: "white"
        },
        node: {
            base: {
                position: "relative"
            },
            link: {
                cursor: "pointer",
                position: "relative",
                padding: "5px 0 0 0",
                display: "block"
            },
            activeLink: {
                background: "rgb(160, 197, 42)",
                color: "white",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px"
            },
            toggle: {
                base: {
                    position: "relative",
                    display: "inline-block",
                    verticalAlign: "top",
                    marginLeft: "-25px",
                    height: "24px",
                    width: "24px"
                },
                wrapper: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    margin: "-7px 0 0 -7px",
                    height: "14px"
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: "rgb(160, 197, 42)",
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: "inline-block",
                    verticalAlign: "top",
                    color: "black",
                    paddingLeft: "10px"
                },
                connector: {
                    width: "2px",
                    height: "12px",
                    borderLeft: "solid 2px black",
                    borderBottom: "solid 2px black",
                    position: "absolute",
                    top: "0px",
                    left: "-21px"
                },
                title: {
                    lineHeight: "28px",
                    verticalAlign: "middle"
                }
            },
            subtree: {
                listStyle: "none",
                paddingLeft: "29px"
            },
            loading: {
                color: "#E2C089"
            }
        }
    }
};

decorators.Header = ({style, node}) => {

    // TODO: Move to UnitTree.js

    let baseStyle = {
        ...style.base,
        color: node.active ? "white" : "black"
    };

    let titleStyle = {
        ...style.title
    };

    let iconColor = !node.active ? "primary" : undefined;
    let iconNativeColor = node.active ? "white" : undefined;

    let icon;

    switch (node.type) {
        case "Global":
            icon = (
                <GlobalIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "Organization":
            icon = (
                <OrganizationIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "Program":
            icon = (
                <ProgramIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "Project":
            icon = (
                <ProjectIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "Country":
            icon = (
                <CountryIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "Region":
            icon = (
                <RegionIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        case "City":
            icon = (
                <CityIcon
                    color={iconColor}
                    nativeColor={iconNativeColor}
                />);
            break;
        default:
            icon = null;
            break;
    }

    return (
        <div style={baseStyle}>
            <div style={titleStyle}>

                {icon}

                {node.dirty ?
                    (
                        <Badge
                            badgeContent={"&#42;"}
                            color={"primary"}
                            style={{fontSize: 15, backgroundColor: "inherit", padding: "0 20px 0 0"}}

                        >
                            <span style={{marginLeft: "5px", verticalAlign: "text-bottom"}}>{node.name}</span>
                        </Badge>
                    ) :
                    (
                        <span style={{marginLeft: "5px", verticalAlign: "text-bottom"}}>{node.name}</span>
                    )
                }

            </div>
        </div>
    );
};

decorators.Header.displayName = "TreeHeader";

decorators.Header.propTypes = {
    style: PropTypes.object,
    node: PropTypes.object
};

export default class Tree extends Component {

    static propTypes = {
        data: PropTypes.object,
        onSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {};

        this.handleToggle = :: this.handleToggle;
    }

    handleToggle(node, toggled) {
        this.props.onSelect(node, toggled);
    }

    render() {

        const {data} = this.props;

        return (

            <Treebeard
                data={data}
                style={styles}
                decorators={decorators}
                onToggle={this.handleToggle}
            />
        );
    }
}
