import {
    DOCUMENT_LIST,
    DONOR_LIST,
    TEMPLATE_LIST,
    createDocument,
    loadDocumentListFilter,
    loadDonorList,
    loadTemplateList,
    synchronizeTemplates
} from "../services/documents";

import DocumentList from "../component/view/document/DocumentList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [DOCUMENT_LIST]: state.documents[DOCUMENT_LIST],
        [DONOR_LIST]: state.documents[DONOR_LIST],
        [TEMPLATE_LIST]: state.documents[TEMPLATE_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        createDocument,
        loadDocumentListFilter,
        loadDonorList,
        loadTemplateList,
        synchronizeTemplates
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList);
