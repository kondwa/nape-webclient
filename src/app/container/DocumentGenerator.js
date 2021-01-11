import {
    DOCUMENT,
    PLACEHOLDER_LIST,
    TEMPLATE_ITEM_CONTENT,
    generateDocument,
    loadDocument,
    loadDocumentPlaceholders,
    loadTemplateItemContent,
    saveDocument
} from "../services/documents";

import Document from "../component/view/document/Document";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [DOCUMENT]: state.documents[DOCUMENT],
        [TEMPLATE_ITEM_CONTENT]: state.documents[TEMPLATE_ITEM_CONTENT],
        [PLACEHOLDER_LIST]: state.documents[PLACEHOLDER_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        generateDocument,
        loadDocument,
        loadTemplateItemContent,
        loadDocumentPlaceholders,
        saveDocument
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Document);
