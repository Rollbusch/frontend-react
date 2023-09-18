import React, { useEffect, useState } from "react";
import PersonItem from "../PersonItem";
import { Link } from "react-router-dom";
import Loading from "../Loading";

export default function PersonList() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(process.env.REACT_APP_API_URL, "/pessoas").then(setPessoas);
  }, [loading]);

  const getData = async (url, table) => {
    const data = await fetch(`${url}/${table}`);
    if (!data.ok) return [];
    const res = await data.json();
    setLoading(false)
    return res;
  };

  return (
    <>
      {loading && <Loading />}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data de admissão</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <React.Fragment key={pessoa.id_pessoa}>
              <PersonItem {...{ pessoa, loading, setLoading }} />
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link to="pessoas/new">
                <button>Adicionar novo registro</button>
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
