import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface RequestParams {
  rep: string;
}

interface Repository {
  fullName: string;
  description: string;
  stars: number; // stargazers_count
  forks: number; // forks_count
  issuesOpened: number; // open_issues_count
  owner: {
    login: string;
    avatarURL: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const { params } = useRouteMatch<RequestParams>();

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const [resRepository, resIssues] = await Promise.all([
        api.get(`repos/${params.rep}`),
        api.get(`repos/${params.rep}/issues`),
      ]);

      // Repository
      const {
        full_name: fullName,
        description,
        stargazers_count: stars,
        forks_count: forks,
        open_issues_count: issuesOpened,
        owner: { login, avatar_url: avatarURL },
      } = resRepository.data;

      setRepository({
        fullName,
        description,
        stars,
        forks,
        issuesOpened,
        owner: {
          login,
          avatarURL,
        },
      });

      // Issues
      setIssues(resIssues.data);
    };
    fetch();
  }, [params.rep]);

  return (
    <>
      <Header>
        <img src={logo} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatarURL}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.fullName}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stars}</strong>
              <p>Stars</p>
            </li>
            <li>
              <strong>{repository.forks}</strong>
              <p>Forks</p>
            </li>
            <li>
              <strong>{repository.issuesOpened}</strong>
              <p>Issues abertas</p>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} target="_blank" href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
