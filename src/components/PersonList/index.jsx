import React, { useEffect, useState } from "react";
import PersonItem from "../PersonItem";
import { Link } from "react-router-dom";

export default function PersonList() {
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    getData(process.env.REACT_APP_API_URL, "/pessoas").then(setPessoas);
  }, []);

  const getData = async (url, table) => {
    const data = await fetch(`${url}/${table}`);
    if (!data.ok) return [];
    return await data.json();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Data de admissão</th>
        </tr>
      </thead>
      <tbody>
        {pessoas.map((pessoa) => (
          <React.Fragment key={pessoa.id_pessoa}>
            <PersonItem {...{ pessoa }} />
          </React.Fragment>
        ))}
      </tbody>
      <Link to="pessoas/new">
        <button>Adicionar novo registro</button>
      </Link>
    </table>
  );
}
