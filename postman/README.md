# Postman

Importe estes dois arquivos no Postman:

- `Analise_Sentimentos_PLN.postman_collection.json`
- `Local.postman_environment.json`

Selecione o ambiente `Analise Sentimentos PLN - Local` antes de enviar as requests.

Endpoints configurados:

- Backend direto: `POST {{backend_url}}/predict`
- Proxy do frontend: `POST {{frontend_url}}/api/sentiment`

Body correto:

```json
{
  "text": "Produto chegou atrasado e veio com defeito"
}
```
