import {
    MuiThemeProvider,
    createGenerateClassName,
    createMuiTheme,
    jssPreset
} from "@material-ui/core/styles";
import React, {Component} from "react";

import {JssProvider} from "react-jss";
import PropTypes from "prop-types";
import {create} from "jss";
import jssRtl from "jss-rtl";

const generateClassName = createGenerateClassName();
const plugins = [...jssPreset().plugins];

class ThemeProvider extends Component {

    static propTypes = {
        locale: PropTypes.string,
        theme: PropTypes.object,
        children: PropTypes.object
    };

    render() {
        const dir = locale => {
            const base = locale.split("-") || [];
            return ["he", "ar"].includes(base[0]) ? "rtl" : "ltr";
        };
        const setDir = dir => {
            window.document &&
    window.document.getElementsByTagName("body")[0].setAttribute("dir", dir);
        };
        const direction = dir(this.props.locale);
        let theme = createMuiTheme(this.props.theme);
        theme.direction = direction;
        if (direction === "rtl") {plugins.push(jssRtl());}
        setDir(direction);

        return (

            <MuiThemeProvider theme={theme}>
                {direction === "rtl" ? (
                    <JssProvider
                        jss={create({plugins})}
                        generateClassName={generateClassName}
                    >
                        {this.props.children}
                    </JssProvider>
                ) : (
                    this.props.children
                )}


            </MuiThemeProvider>
        );
    }
}

export default ThemeProvider;
