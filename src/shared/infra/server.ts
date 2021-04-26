import app from '@shared/infra/config/app';

app.listen(process.env.SERVER_PORT, () => {
  console.info(`Executando na porta ${process.env.SERVER_PORT}`);
});
