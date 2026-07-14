// Script utilitário opcional. Normalmente você NÃO precisa rodar isso:
// o próprio painel cria o administrador automaticamente no primeiro login,
// usando as variáveis ADMIN_EMAIL e ADMIN_PASSWORD.
//
// Use este script apenas se quiser gerar manualmente um hash bcrypt de senha
// para inserir diretamente no banco de dados.
//
// Uso: npm run hash-senha "minhaSenha123"

const bcrypt = require("bcryptjs");

const senha = process.argv[2];

if (!senha) {
  console.log("Uso: npm run hash-senha \"suaSenha\"");
  process.exit(1);
}

bcrypt.hash(senha, 10).then((hash) => {
  console.log("\nHash gerado (bcrypt):\n");
  console.log(hash);
  console.log("");
});
