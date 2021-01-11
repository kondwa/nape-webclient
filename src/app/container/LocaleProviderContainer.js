/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import {LOCALE, MESSAGES, MESSAGES_LOADING, loadMessages} from "../services/locale";
import LocaleProvider from "../component/widget/locale/LocaleProvider";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [LOCALE]: state.locale[LOCALE],
        [MESSAGES]: state.locale[MESSAGES],
        [MESSAGES_LOADING]: state.locale[MESSAGES_LOADING]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadMessages}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LocaleProvider);


