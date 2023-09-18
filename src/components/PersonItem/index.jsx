import { Link } from "react-router-dom";

export default function PersonItem({ pessoa, reload, setReload }) {
  const formatFirstName = (pessoa) => {
    return pessoa.split(" ")[0];
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const dateSplited = new Date(dateObj.toUTCString()).toISOString().split('T')[0]
    const numbers = dateSplited.split('-')
    return `${numbers[2]}/${numbers[1]}/${numbers[0]}`
  };

  const handleExcluir = (id, nome) => {
    const confirmAnswer = window.confirm(
      `Tem certeza que deseja excluir o registro de ${nome}?`
    );
    if (!confirmAnswer) return;
    excluirRegistro(id)
  };

  const excluirRegistro = async (id) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas/${id}`, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            id
        })
    })
    if (!data.ok) return alert('Erro inesperado.')
    return alert('Registro apagado com sucesso!')
  }

  return (
    <tr>
      <td>{formatFirstName(pessoa.nome)}</td>
      <td>{formatDate(pessoa.data_admissao)}</td>
      <td>
        <Link to={`pessoas/${pessoa.id_pessoa}`}>
          <button>Editar</button>
        </Link>
      </td>
      <td>
        <button onClick={() => handleExcluir(pessoa.id_pessoa, pessoa.nome)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}
