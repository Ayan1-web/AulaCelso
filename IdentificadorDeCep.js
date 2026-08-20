// Limpa valores do formulário de cep
function limpaFormularioCep() {
    document.getElementById('rua').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidade').value = "";
    document.getElementById('uf').value = "";
    document.getElementById('ibge').value = "";
}

// Preenche ou limpa o formulário com '...' durante o carregamento
function defineMensagemCarregamento(mensagem = "...") {
    document.getElementById('rua').value = mensagem;
    document.getElementById('bairro').value = mensagem;
    document.getElementById('cidade').value = mensagem;
    document.getElementById('uf').value = mensagem;
    document.getElementById('ibge').value = mensagem;
}

// Consulta o webservice ViaCEP usando Fetch API
async function pesquisaCep(valor) {
    // Nova variável "cep" somente com dígitos
    const cep = valor.replace(/\D/g, '');

    // Verifica se campo cep possui valor informado
    if (cep !== "") {
        // Expressão regular para validar o CEP (8 dígitos numéricos)
        const validaCep = /^[0-9]{8}$/;

        if (validaCep.test(cep)) {
            // Sinaliza que a busca está em andamento
            defineMensagemCarregamento();

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const conteudo = await response.json();

                if (!("erro" in conteudo)) {
                    // Atualiza os campos com os valores recebidos
                    document.getElementById('rua').value = conteudo.logradouro;
                    document.getElementById('bairro').value = conteudo.bairro;
                    document.getElementById('cidade').value = conteudo.localidade;
                    document.getElementById('uf').value = conteudo.uf;
                    document.getElementById('ibge').value = conteudo.ibge;
                } else {
                    // CEP não Encontrado
                    limpaFormularioCep();
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                limpaFormularioCep();
                alert("Erro ao buscar o CEP. Tente novamente mais tarde.");
            }
        } else {
            // CEP é inválido
            limpaFormularioCep();
            alert("Formato de CEP inválido.");
        }
    } else {
        // CEP sem valor
        limpaFormularioCep();
    }
}

// Event Listeners (substitui o 'onblur' inline no HTML)
document.addEventListener('DOMContentLoaded', () => {
    const inputCep = document.getElementById('cep');
    if (inputCep) {
        inputCep.addEventListener('blur', (event) => {
            pesquisaCep(event.target.value);
        });
    }
});