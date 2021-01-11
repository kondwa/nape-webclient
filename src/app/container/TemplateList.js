import {
    TEMPLATE_LIST,
    loadTemplateListFilter
} from "../services/templatelist";

import TemplateList from "../component/view/templateList/TemplateList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [TEMPLATE_LIST]: state.templateList[TEMPLATE_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadTemplateListFilter
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateList);
