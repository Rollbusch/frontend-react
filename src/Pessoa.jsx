import { useParams } from "react-router-dom";
import PessoaForm from "./components/PessoaForm";

export default function Pessoa() {
  const params = useParams();

  return <PessoaForm id={params.id} />;
}
