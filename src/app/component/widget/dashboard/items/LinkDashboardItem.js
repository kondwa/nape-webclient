import * as ROUTES from "../../../../common/routes";

import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";

import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
    title: {
        display: "block",
        color: "rgb(158, 158, 158)"
    },
    logo: {
        width: "200px",
        height: "auto",
        margin: "0 auto",
        minHeight: 0,
        paddingTop: "135px"
    },
    listItem: {
        width: "auto !important",
        float: "left"
    }
});

class LinkDashboardItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {links, classes, project} = this.props;
        let projectKey = project ? project.foreignId : undefined;

        return (
            <div>
                <Typography
                    variant="subtitle1"
                    className={classes.title}
                >{this.props.intl.formatMessage({"id": "common.links"})}</Typography>

                {links ? (

                    <List style={styles.listItem}>

                        {links.map(link => (

                            <ListItem
                                button
                                key={link.name}
                                component={Link}
                                to={ROUTES.project(projectKey) + link.link}
                            >
                                <Avatar>
                                    <SvgIcon>
                                        <path d={link.avatar} />
                                    </SvgIcon>
                                </Avatar>

                                <ListItemText
                                    primary={link.name}
                                    secondary={link.description}
                                />
                            </ListItem>
                        ))}

                    </List>

                ) : this.props.intl.formatMessage({"id": "common.links.warning"})}

            </div>
        );
    }
}

LinkDashboardItem.propTypes = {
    links: PropTypes.array,
    project: PropTypes.object,
    classes: PropTypes.object,
    intl: intlShape.isRequired
};

export default injectIntl(withRouter(withStyles(styles, {withTheme: true})(LinkDashboardItem)));
