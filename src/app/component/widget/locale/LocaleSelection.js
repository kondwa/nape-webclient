/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles/index";

const styles = (theme) => ({
    root: {
        minWidth: 75
    },
    button: {
        color: theme.palette.primary.contrastText,
        minWidth: "unset"
    },
    selected: {
        color: theme.palette.secondary.main,
        fontWeight: "600",
        minWidth: "unset"
    },
    dash: {
        color: theme.palette.primary.contrastText,
    }
});

class LocaleSelection extends Component {

    static propTypes = {
        localeList: PropTypes.array,
        locale: PropTypes.string,
        changeLocale: PropTypes.func,
        classes: PropTypes.object,
        intl: intlShape.isRequired,
    };

    static defaultProps = {
        locale: "en"
    };

    constructor(props) {
        super(props);

        this.handleSelect = ::this.handleSelect;
    }

    handleSelect(locale) {
        const {changeLocale} = this.props;
        changeLocale(locale);
    }

    render() {
        const {localeList, locale, classes, intl} = this.props;
        return (
            <div className={classes.root}>
                {localeList && localeList.map((row, i) =>
                    (
                        <span
                            key={row}
                            className={classes.dash}
                        >
                            <Tooltip
                                title={row === "en" ? intl.formatMessage({id: "language.english"}) :
                                    row === "de" ? intl.formatMessage({id: "language.german"}) :
                                        intl.formatMessage({id: "language.arabic"})}
                            >
                                <Button
                                    size="small"
                                    className={row === locale ? classes.selected : classes.button}
                                    onClick={() => this.handleSelect(row)}
                                >
                                    {row === "en" ? "English" : row === "de" ? "Deutsch" : "عربى"}
                                </Button>
                            </Tooltip>
                            {i < localeList.length - 1 ? "/" : null}
                        </span>
                    ))}
            </div>
        );
    }
}

export default injectIntl(withStyles(styles)(LocaleSelection));
