import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as authorActions from '../../actions/authorActions';
import AuthorList from './AuthorList';

class AuthorsPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.redirectToAddAuthorPage = this.redirectToAddAuthorPage.bind(this);
    }

    redirectToAddAuthorPage() {
        browserHistory.push('/author');
    }

    render() {
        return (
            <div>
                <h1>Authors</h1>
                <input type="submit"
                    value="Add Author"
                    className="btn btn-primary"
                    onClick={this.redirectToAddAuthorPage} />

                <AuthorList authors={this.props.authors} />
            </div>
        );
    }
}

AuthorsPage.propTypes = {
    actions: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        authors: state.authors
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authorActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
