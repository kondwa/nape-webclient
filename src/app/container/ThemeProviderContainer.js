/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */

import {LOCALE} from "../services/locale";
import {THEME} from "../services/login";
import ThemeProvider from "../component/widget/theme/ThemeProvider";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [THEME]: state.login[THEME],
        [LOCALE]: state.locale[LOCALE]
    };
};

export default connect(mapStateToProps)(ThemeProvider);
