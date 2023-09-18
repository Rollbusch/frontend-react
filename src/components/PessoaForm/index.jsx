import { Link, useNavigate } from "react-router-dom";
import Container from "../Container";
import { useEffect, useState } from "react";
import Loading from "../Loading";

export default function PessoaForm({ id }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState();
  const [dataAdmissao, setDataAdmissao] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const composeFormatNumber = (match, replace) => {
    return (number) => {
      const onlyNumbers = number.replace(/[^0-9]+/g, "");
      const numberFormatted = onlyNumbers.replace(match, replace);
      return numberFormatted;
    };
  };
  const formatCpf = composeFormatNumber(
    /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/g,
    "$1.$2.$3-$4"
  );
  const formatRg = composeFormatNumber(
    /^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{1})$/g,
    "$1.$2.$3-$4"
  );

  useEffect(() => {
    setCpf(formatCpf(cpf));
  }, [cpf]);

  useEffect(() => {
    setRg(formatRg(rg));
  }, [rg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const request = handleData(
      id == "new" ? "POST" : "PUT",
      id == "new" ? "pessoas" : `pessoas/${id}`,
      JSON.stringify({
        nome,
        rg,
        cpf,
        data_admissao: dataAdmissao,
        data_nascimento: dataNascimento,
      })
    );
    if (request) {
      return navigate("/");
    }
    return alert("Um erro inesperado aconteceu.");
  };

  const handleData = async (method, endpoint, body) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
      method,
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.ok) return false;
    return true;
  };

  const getData = async (id) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas/${id}`);
    if (!data.ok) return [];
    setLoading(false);
    return await data.json();
  };

  const handleExcluir = (id) => {
    const confirmAnswer = window.confirm(
      `Tem certeza que deseja excluir o registro de ${nome}?`
    );
    if (!confirmAnswer) return;
    const res = excluirRegistro(id);
    if (res) {
      return navigate("/");
    } 
  };

  const excluirRegistro = async (id) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas/${id}`, {
      method: "DELETE",
    });
    if (!data.ok) return alert("Erro inesperado.");
    return true
  };

  useEffect(() => {
    if (id != "new") {
      getData(id).then((res) => {
        const data = res[0];
        setNome(data.nome);
        setRg(data.rg);
        setCpf(data.cpf);
        setDataNascimento(
          new Date(data.data_nascimento).toISOString().slice(0, 10)
        );
        setDataAdmissao(
          new Date(data.data_admissao).toISOString().slice(0, 10)
        );
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Container>
        <h1>{id == "new" ? "Adicionar produto" : "Editar"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome:</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>RG:</label>
            <input
              type="text"
              maxLength={12}
              minLength={12}
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>CPF:</label>
            <input
              type="text"
              maxLength={14}
              minLength={14}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Data de nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Data de admissão:</label>
            <input
              type="date"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
              required
            />
          </div>
          <div className="buttons">
            {id == "new" && <button disabled={loading}>Criar</button>}
            {id != "new" && (
              <button type="submit" disabled={loading}>
                Salvar
              </button>
            )}
          </div>
        </form>
        <div className="buttons">
          <Link to="/">
            <button>Voltar</button>
          </Link>
          {id != "new" && (
            <button disabled={loading} onClick={() => handleExcluir(id)}>
              Excluir
            </button>
          )}
        </div>
      </Container>
    </>
  );
}
