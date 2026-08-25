import React, { useState } from 'react';

export default function BuscadorCep() {
  const [formData, setFormData] = useState({
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    uf: '',
    ibge: '',
  });

  const limpaFormulario = () => {
    setFormData((prev) => ({
      ...prev,
      rua: '',
      bairro: '',
      cidade: '',
      uf: '',
      ibge: '',
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlurCep = async () => {
    // Nova variável "cep" somente com dígitos.
    const cep = formData.cep.replace(/\D/g, '');

    if (cep !== '') {
      // Expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        // Preenche os campos com "..." enquanto consulta webservice.
        setFormData((prev) => ({
          ...prev,
          rua: '...',
          bairro: '...',
          cidade: '...',
          uf: '...',
          ibge: '...',
        }));

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const dados = await response.json();

          if (!dados.erro) {
            setFormData((prev) => ({
              ...prev,
              rua: dados.logradouro,
              bairro: dados.bairro,
              cidade: dados.localidade,
              uf: dados.uf,
              ibge: dados.ibge,
            }));
          } else {
            limpaFormulario();
            alert('CEP não encontrado.');
          }
        } catch (error) {
          limpaFormulario();
          alert('Erro ao consultar o CEP.');
        }
      } else {
        limpaFormulario();
        alert('Formato de CEP inválido.');
      }
    } else {
      limpaFormulario();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Cep:
        <input
          name="cep"
          type="text"
          id="cep"
          value={formData.cep}
          onChange={handleChange}
          onBlur={handleBlurCep}
          maxLength="9"
        />
      </label>
      <br />
      <label>
        Rua:
        <input
          name="rua"
          type="text"
          id="rua"
          value={formData.rua}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Bairro:
        <input
          name="bairro"
          type="text"
          id="bairro"
          value={formData.bairro}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Cidade:
        <input
          name="cidade"
          type="text"
          id="cidade"
          value={formData.cidade}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Estado:
        <input
          name="uf"
          type="text"
          id="uf"
          value={formData.uf}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        IBGE:
        <input
          name="ibge"
          type="text"
          id="ibge"
          value={formData.ibge}
          onChange={handleChange}
        />
      </label>
    </form>
  );
}