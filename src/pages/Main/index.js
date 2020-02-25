import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    }

    // To load localStorage data
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
          this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    // To save localStorage data
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
       this.setState({ newRepo: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true })

        const { newRepo, repositories } = this.state;

        const response = await api.get(`/repos/${newRepo}`);

        const data = {
            name: response.data.full_name,
        }

        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: false,
        });
    }

    render() {
        const { newRepo, loading, repositories } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositories
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Add repository"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#fff" size={14} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Details</Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}

