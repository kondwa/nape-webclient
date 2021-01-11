import React, {Component} from "react";

import Autosuggest from "react-autosuggest";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import {withStyles} from "@material-ui/core/styles";

function renderInput(inputProps) {
    const {classes, autoFocus, value, ref, ...other} = inputProps;

    return (
        <TextField
            fullWidth
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            margin="normal"
            InputProps={{
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
        />
    );
}

function renderSuggestion(suggestion, {query, isHighlighted}) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
        <MenuItem
            selected={isHighlighted}
            component="div"
        >
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span
                            key={String(index)}
                            style={{fontWeight: 300}}
                        >

                            {part.text}

                        </span>
                    ) : (
                        <strong
                            key={String(index)}
                            style={{fontWeight: 500}}
                        >
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
}

function renderSuggestionsContainer(options) {
    const {containerProps, children} = options;

    return (
        <Paper
            {...containerProps}
            square
        >
            {children}
        </Paper>
    );
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function getSuggestions(value, suggestions) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 5 && suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: "relative",
        height: 200,
    },
    suggestionsContainerOpen: {
        position: "absolute",
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: "block",
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: "none",
    },
    textField: {
        width: "100%",
    },
});

class Autocomplete extends Component {

    static propTypes = {
        suggestions: PropTypes.array,
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleSuggestionsFetchRequested = :: this.handleSuggestionsFetchRequested;
        this.handleSuggestionsClearRequested = :: this.handleSuggestionsClearRequested;
        this.handleChange = :: this.handleChange;

        this.state = {
            value: "",
            suggestions: [],
        };
    }

    handleSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: getSuggestions(value, this.props.suggestions),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, {newValue}) => {
        this.setState({
            value: newValue,
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    autoFocus: true,
                    classes,
                    placeholder: "Select a donor (start typing)",
                    value: this.state.value,
                    onChange: this.handleChange,
                }}
            />
        );
    }
}

export default withStyles(styles)(Autocomplete);
