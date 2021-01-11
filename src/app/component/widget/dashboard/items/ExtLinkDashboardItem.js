import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";

import Avatar from "@material-ui/core/Avatar";
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

class ExtLinkDashboardItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {links, classes} = this.props;
        
        return (
            <div>
                <Typography
                    variant="subtitle1"
                    className={classes.title}
                >{this.props.intl.formatMessage({"id": "common.links"})}</Typography>

                {links ? (

                    <List style={styles.listItem}>

                        {links.map(link => (
                            <a
                                key={link.name}    
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer--link"
                                href={link.link}
                            >
                                <ListItem
                                    button
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
                            </a>
                        ))}

                    </List>

                ) : this.props.intl.formatMessage({"id": "common.links.warning"})}

            </div>
        );
    }
}

ExtLinkDashboardItem.propTypes = {
    links: PropTypes.array,
    classes: PropTypes.object,
    intl: intlShape.isRequired
};

export default injectIntl(withRouter(withStyles(styles, {withTheme: true})(ExtLinkDashboardItem)));
