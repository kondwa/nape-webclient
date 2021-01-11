import ArrowLeft from "@material-ui/icons/ArrowBack";
import ArrowRight from "@material-ui/icons/ArrowForward";
import {DatePicker} from "material-ui-pickers";
import PropTypes from "prop-types";
import React from "react";
import {createValueAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

const DATE_FORMAT = "MM/DD/YYYY";

class DateQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        id: PropTypes.number,
        readOnly: PropTypes.bool.isRequired,
        add: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    handleChange(newDate) {
        const {add, question} = this.props;

        if (question.answers.length > 0) {
            let oldAnswer = question.answers[0];
            oldAnswer.answer.value = newDate;
            add(question, null);
        } else {
            let newAnswer = createValueAnswer(newDate);
            add(question, newAnswer);
        }
    }

    render() {
        const {question, id, readOnly} = this.props;
        const date = question && !isEmpty(find(question.answers)) && find(question.answers).answer.value || null;

        return (
            <div>

                <DatePicker
                    autoOk
                    clearable
                    animateYearScrolling
                    invalidLabel={"-"}
                    emptyLabel={"-"}
                    format={DATE_FORMAT}
                    leftArrowIcon={<ArrowLeft/>}
                    rightArrowIcon={<ArrowRight/>}
                    disabled={readOnly}
                    id={`question-${id}-datePicker`}
                    value={date ? moment(date) : null}
                    onChange={(date) => this.handleChange(moment(date).format(DATE_FORMAT))}
                />

            </div>
        );
    }
}

export default DateQuestion;
