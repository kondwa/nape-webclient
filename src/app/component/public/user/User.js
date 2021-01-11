import JwtExpiredDialog from "../../widget/expiredDialog/JwtExpiredDialog";
import PropTypes from "prop-types";
import React from "react";

const INTERVAL_IN_MILLISECONDS = 60000;

class User extends React.Component {

    static propTypes = {
        jwtExpired: PropTypes.bool.isRequired,
        callJwtVerification: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        userIsLoggedIn: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let intervalId = setInterval(() => {
            this.props.userIsLoggedIn ? this.props.callJwtVerification() : false;
        }, INTERVAL_IN_MILLISECONDS);

        this.setState({jwtValidationIntervalId: intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.jwtValidationIntervalId);
    }

    render() {

        const {userIsLoggedIn, jwtExpired, logout} = this.props;

        return (
            userIsLoggedIn && jwtExpired ?
                <JwtExpiredDialog
                    show={jwtExpired}
                    onClose={logout}
                />
                : null
        );

    }

}

export default User;
