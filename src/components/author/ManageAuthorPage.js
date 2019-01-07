import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authorActions from '../../actions/authorActions';
import AuthorForm from './AuthorForm';
import { authorsFormattedForDropdown } from '../../selectors/selectors';
import toastr from 'toastr';

export class ManageAuthorPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            author: Object.assign({}, this.props.author),
            errors: {},
            saving: false
        };

        this.saveAuthor = this.saveAuthor.bind(this);
        this.updateAuthorState = this.updateAuthorState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.author.id != nextProps.author.id) {
            // Necessary to populate form when existing author is loaded directly.
            this.setState({ author: Object.assign({}, nextProps.author) });
        }
    }

    updateAuthorState(event) {
        const field = event.target.name;
        let author = Object.assign({}, this.state.author);
        author[field] = event.target.value;
        return this.setState({ author: author });
    }

    nameValid() {
        let formIsValid = true;
        let errors = {};

        if (this.state.author.title.length < 1) {
            errors.title = 'Title must be at least 1 character.';
            formIsValid = false;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    saveAuthor(event) {
        event.preventDefault();

        if (!this.nameValid()) {
            return;
        }

        this.setState({ saving: true });
        this.props.actions.saveAuthor(this.state.author)
            .then(() => this.redirect())
            .catch(error => {
                toastr.error(error);
                this.setState({ saving: false });
            });
    }

    redirect() {
        this.setState({ saving: false });
        toastr.success('Author saved.');
        this.context.router.push('/authors');
    }

    render() {
        return (
            <AuthorForm
                author={this.state.author}
                onChange={this.updateAuthorState}
                onSave={this.saveAuthor}
                errors={this.state.errors}
                saving={this.state.saving}
            />
        );
    }
}

ManageAuthorPage.propTypes = {
    author: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

//Pull in the React Router context so router is available on this.context.router.
ManageAuthorPage.contextTypes = {
    router: PropTypes.object
};

function getAuthorById(authors, id) {
    const author = authors.filter(author => author.id == id);
    if (author) return author[0]; //since filter returns an array, have to grab the first.
    return null;
}

function mapStateToProps(state, ownProps) {
    const authorId = ownProps.params.id; // from the path `/author/:id`

    let author = { id: '', watchHref: '', title: '', authorId: '', length: '', category: '' };

    if (authorId && state.authors.length > 0) {
        author = getAuthorById(state.authors, authorId);
    }

    return {
        author: author,
        authors: authorsFormattedForDropdown(state.authors)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authorActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);
