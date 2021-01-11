import {Component} from "react";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {loadSurveyInstanceSize} from "../../../../services/surveylist";
import {withRouter} from "react-router-dom";

const styles = {
    page: {
        height: "100px"
    },
    title: {
        color: "rgb(158, 158, 158)",
        display: "block",
        textAlign: "center"
    },
    appTitle: {
        marginTop: "40px",
        textAlign: "center"
    }
};

class WelcomeDashboardItem extends Component {

    static propTypes = {
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        appTitle: PropTypes.string,
        secondaryLogo: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {firstName, lastName, appTitle, secondaryLogo} = this.props;

        const title = `Welcome, ${firstName} ${lastName}`;

        return (
            <div style={styles.page}>
                <Typography
                    variant="h5"
                    style={styles.title}
                >{title}</Typography>

                <Typography
                    variant="h4"
                    style={styles.appTitle}
                >{appTitle}</Typography>

                <div
                    style={{marginTop: "40px", height: "100%", background: "url(" + (secondaryLogo ? secondaryLogo : "/images/drawer/logo.png") + ") center center no-repeat"}}
                />

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.login.username,
        firstName: state.login.firstName,
        lastName: state.login.lastName,
        appTitle: state.login.appTitle,
        secondaryLogo: state.login.secondaryLogo
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadSurveyInstanceSize}, dispatch);
};


export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(WelcomeDashboardItem)));

