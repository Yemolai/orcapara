# ORÇAPARÁ

Aplicação Web para consulta e construção de orçamentos baseados em tabelas de preços fornecidas

Em PHP e JS usando apenas algumas bibliotecas embutidas, com uso de jQuery e alguns plugins.
Funciona como webapp standalone.

Para rodar sirva num servidor APACHE/NGINX ou usando o PHP Built-in Server:

```
php -S 0.0.0.0:8080 -t .
```

Os arquivos ficam organizados dentro do diretrio `/files` e as regras para organização e
configuração podem ser observadas nos arquivos do repositório fornecidos como exemplos.
Os arquivos ao serem servidos pela primeira vez geram um arquivo `cache.json` no mesmo local,
inclusive neste repositório temos alguns disponveis.
