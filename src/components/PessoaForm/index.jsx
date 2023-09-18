import { Link, useNavigate } from "react-router-dom";
import Container from "../Container";
import { useEffect, useState } from "react";

export default function PessoaForm({ id }) {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState();
  const [dataAdmissao, setDataAdmissao] = useState();
  const [loading, setLoading] = useState(false);

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
    if (id == "new") {
      const create = handleCreate(
        JSON.stringify({
          nome,
          rg,
          cpf,
          data_admissao: dataAdmissao,
          data_nascimento: dataNascimento,
        })
      );
      if (create) {
        navigate("/");
      } else {
        alert("Um erro inesperado aconteceu.");
      }
      navigate("/");
    } else {
      const update = handleUpdate(
        id,
        JSON.stringify({
          nome,
          rg,
          cpf,
          data_admissao: dataAdmissao,
          data_nascimento: dataNascimento,
        })
      );
      if (update) {
        navigate("/");
      } else {
        alert("Um erro inesperado aconteceu.");
      }
    }
  };

  const handleUpdate = async (id, body) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas/${id}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.ok) return false;
    return true
  };

  const handleCreate = async (body) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.ok) return false
    return true;
  };

  const getData = async (id) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/pessoas/${id}`);
    if (!data.ok) return [];
    return await data.json();
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
    }
  }, []);

  return (
    <Container>
      <h1>{id == "new" ? "Criar novo" : "Editar"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nome:</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="input-group">
          <label>RG:</label>
          <input
            type="text"
            maxLength={12}
            value={rg}
            onChange={(e) => setRg(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>CPF:</label>
          <input
            type="text"
            maxLength={14}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Data de nascimento:</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Data de admissão:</label>
          <input
            type="date"
            value={dataAdmissao}
            onChange={(e) => setDataAdmissao(e.target.value)}
          />
        </div>
        <div className="buttons">
          <button disabled={loading}>{id == "new" ? "Criar" : "Salvar"}</button>
          <Link to="/">
            <button>Voltar</button>
          </Link>
        </div>
      </form>
    </Container>
  );
}
