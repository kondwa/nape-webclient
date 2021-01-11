/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import React, {Component} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {IntlProvider} from "react-intl";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

//this is a Safari hack. Because safari doesn't support by default Intl.
//more about this topic: https://github.com/andyearnshaw/Intl.js/
if (!window.intl) {
    window.intl = require("intl");
    window.intl.polyFill = true;
    require("intl/locale-data/jsonp/en.js");
    require("intl/locale-data/jsonp/km.js");
}


class LocaleProvider extends Component {

    static propTypes = {
        locale: PropTypes.string.isRequired,
        messages: PropTypes.object,
        children: PropTypes.element,
        loadMessages: PropTypes.func,
        messagesLoading: PropTypes.string
    };

    static defaultProps = {
        locale: "en"
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {loadMessages, locale} = this.props;
        loadMessages(locale);
    }

    render() {

        const {locale, messages, messagesLoading, children} = this.props;

        if (messagesLoading === "LOADING") {
            return (
                <div style={{display: "flex", padding: 20, alignItems: "center"}}>

                    <Typography
                        variant={"h6"}
                        style={{marginRight: 30}}
                    >
                        {"Loading IDPoor ..."}
                    </Typography>

                    <CircularProgress
                        size={30}
                        variant={"indeterminate"}
                    />
                </div>
            );
        }

        if (messagesLoading === "FAILED") {
            return (
                <Typography
                    variant={"h6"}
                    style={{margin: 20}}
                >
                    {"Error loading application! Please refresh!"}
                </Typography>
            );
        }

        if (!messages) {
            return null;
        }

        return (

            <IntlProvider
                key={locale + (messages ? messages.length : 0)}
                locale={locale}
                defaultLocale="en"
                messages={messages}
            >
                {children}
            </IntlProvider>);
    }
}

export default LocaleProvider;

