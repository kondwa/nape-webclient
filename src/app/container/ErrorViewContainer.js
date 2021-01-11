/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import ErrorView from "../component/public/error/ErrorView";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {errorSelected} from "../services/error";

const mapStateToProps = (state) => {
    return {
        errors: state.error.errors,
        selectedError: state.error.selectedError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({errorSelected}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorView);
