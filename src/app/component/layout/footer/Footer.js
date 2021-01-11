import PropTypes from "prop-types";
import { PureComponent } from "react";
import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";

const styles = () => ({

    logo: {
        background: "url(/images/footer/logo_small.png)",
        width: 352,
        height: 50,
        margin: "auto"
    }

});

class Footer extends PureComponent {
    constructor( props ) {
        super(props);
        this.state = {
            displayFooter: true
        };
    }

    UNSAFE_componentWillReceiveProps( nextProps ) {
        if ( nextProps.userIsLoggedIn !== this.state.displayFooter ) {
            this.setState({
                displayFooter: nextProps.userIsLoggedIn
            });
        }
    }

    render() {

        const {classes} = this.props;

        return (
            this.state.displayFooter ?
                <div className={classes.logo}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer--link"
                        href="http://www.mainlevel-consulting.de/"
                    />
                </div> : null
        );
    }
}

Footer.propTypes = {
    userIsLoggedIn: PropTypes.bool,
    classes: PropTypes.object,
};

const mapStateToProps = ( state ) => {
    return {
        userIsLoggedIn: state.login.userIsLoggedIn
    };
};

export default connect(mapStateToProps)(withStyles(styles)(Footer));
