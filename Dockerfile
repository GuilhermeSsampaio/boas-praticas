# Use a imagem oficial do Node.js como base
FROM node:16

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos de package.json e yarn.lock para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN yarn install

# Copie o código-fonte do aplicativo para o diretório de trabalho
COPY . .

# Construa o aplicativo Next.js
RUN yarn build

# Expõe a porta em que o aplicativo Next.js estará em execução
EXPOSE 3000

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["yarn", "start"]
