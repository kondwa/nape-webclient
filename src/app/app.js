/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import {CookiesProvider} from "react-cookie";
import Layout from "./component/layout/Layout";
import LocaleProviderContainer from "./container/LocaleProviderContainer";
import MomentUtils from "@date-io/moment";
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import {Provider} from "react-redux";
import React from "react";
import {Router} from "react-router-dom";
import ThemeProviderContainer from "./container/ThemeProviderContainer";
import {addLocaleData} from "react-intl";
import customHistory from "./common/history";
import de from "react-intl/locale-data/de";
import domready from "domready";
import en from "react-intl/locale-data/en";
import {render} from "react-dom";
import store from "./common/store";


addLocaleData([...de, ...en]);

const MainApplication = () => {

    window.store = store;

    return (
        <ThemeProviderContainer store={store}>
            <LocaleProviderContainer store={store}>
                <CookiesProvider>
                    <Provider store={store}>
                        <Router history={customHistory}>

                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Layout/>
                            </MuiPickersUtilsProvider>

                        </Router>
                    </Provider>
                </CookiesProvider>
            </LocaleProviderContainer>
        </ThemeProviderContainer>
    );
};

export default MainApplication;

domready(() => {
    render(<MainApplication/>, document.getElementById("app"));
});
