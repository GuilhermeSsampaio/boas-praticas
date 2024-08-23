import axios from "axios";

// Função que recebe um array de URLs e retorna os dados de todas as requisições quando todas forem completadas
export const useFetch = async (urls) => {
  try {
    const responses = await Promise.all(urls.map((url) => axios.get(url)));
    // Extrai os dados das respostas e retorna um array com esses dados
    return responses.map((response) => response.data);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error; // Propaga o erro para que possa ser tratado onde a função for chamada
  }
};
