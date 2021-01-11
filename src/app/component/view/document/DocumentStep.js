import React, {Component} from "react";

import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import filter from "lodash/filter";
import find from "lodash/find";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        margin: "0 20px",
        padding: "0 20px",
        background: theme.palette.background.paper,
    },
    top: {
        padding: 0,
        paddingLeft: theme.spacing.unit * 2,
    },
    nested: {
        padding: 0,
        paddingLeft: theme.spacing.unit * 4,
    },
});

class DocumentStep extends Component {

    static propTypes = {
        groupKey: PropTypes.string,
        questions: PropTypes.array,
        answers: PropTypes.array,
        onSelect: PropTypes.func,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleSelection = :: this.handleSelection;
        this.getAnswer = :: this.getAnswer;

        this.state = {
            answers: filter(props.answers, {groupKey: props.groupKey})
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            answers: filter(newProps.answers, {groupKey: newProps.groupKey})
        });
    }

    handleSelection(answer, checked) {
        this.props.onSelect(answer, checked);
    }

    render() {

        const {questions, classes} = this.props;

        return (
            <div>

                {questions && questions.length > 0 ?
                    (
                        <div>
                            <List>

                                {questions.map((question) => {

                                    let answer = this.getAnswer(question.key, null);

                                    return (

                                        <div key={question.key}>
                                            <ListItem
                                                divider
                                                className={classes.top}
                                            >
                                                <ListItemText
                                                    primary={question.title}
                                                />
                                                <Switch
                                                    checked={answer.selected}
                                                    onChange={(event, checked) => this.handleSelection(answer, checked)}
                                                    color="primary"
                                                />

                                            </ListItem>

                                            <Collapse
                                                component="li"
                                                in={answer.selected}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <List disablePadding>

                                                    {question.options.map((option) => {

                                                        let subAnswer = this.getAnswer(question.key, option.key);

                                                        return (
                                                            <ListItem
                                                                divider
                                                                key={option.key}
                                                                className={classes.nested}
                                                            >
                                                                <ListItemText
                                                                    inset
                                                                    primary={option.title}
                                                                />
                                                                <Switch
                                                                    checked={subAnswer.selected}
                                                                    onChange={(event, checked) => this.handleSelection(subAnswer, checked)}
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            </Collapse>
                                        </div>
                                    );
                                })}

                            </List>

                        </div>

                    ) : (<Typography>{"No text segments defined!"}</Typography>)
                }

            </div>
        );
    }

    getAnswer(questionKey, optionKey) {

        let answer = find(this.state.answers, {questionKey: questionKey, optionKey: optionKey});

        if (!answer) {
            answer = {
                groupKey: this.props.groupKey,
                questionKey: questionKey,
                optionKey: optionKey,
                selected: true
            };

            this.state.answers.push(answer);
        }

        return answer;
    }
}

export default injectIntl(withStyles(styles, {withTheme: true})(DocumentStep));
