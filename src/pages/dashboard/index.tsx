import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  fullName: string;
  description: string;
  owner: {
    login: string;
    avatarURL: string;
  };
}

const Dashboard: React.FC = () => {
  const storageKey = 'githubexplorer::repositories';

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedReps = localStorage.getItem(storageKey);

    if (!storagedReps) return [];

    return JSON.parse(storagedReps);
  });
  const [repName, setRepName] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(repositories));
  }, [repositories]);

  const handleSearchName = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!repName) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${repName}`);

      const {
        full_name: fullName,
        description,
        owner: { login, avatar_url: avatarURL },
      } = response.data;

      const repository = {
        fullName,
        description,
        owner: {
          login,
          avatarURL,
        },
      };

      setRepositories([...repositories, repository]);
      setRepName('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }
  };

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleSearchName}>
        <input
          value={repName}
          onChange={(e) => setRepName(e.target.value)}
          type="text"
          placeholder="Digite o nome do autor/repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((rep) => (
          <Link key={rep.fullName} to={`/repository/${rep.fullName}`}>
            <img src={rep.owner.avatarURL} alt={rep.owner.login} />
            <div>
              <strong>{rep.fullName}</strong>
              <p>{rep.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
