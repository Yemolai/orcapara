<?php
$config = array( # vetor de configurações deste orçamento
  "name" => "Tabela SINAPI", # Descrição longa do orçamento
  "customizable" => true, # se é personalizável
  "hasImages" => false, # se tem imagens
  "recursiveSum" => false, # se realiza somatório recursivo de subitens/subníveis
  "open" => array("001"), # TODO nós que começam abertos (array() se nenhum)
  "selected" => array(), # TODO nós que começam selecionados (array() se nenhum)
  "no" => array( # propriedades dos nós
    "padrao" => '/^([0-9\.]+);;([^;]*);([^;]+);;/', # padrão a ser seguido e testado
    "format" => array( # informações que devem ser extraídas do padrão
      "id" => '$1', # o id sempre deve ser preservado para referência
      "text" => '$3', # texto descritivo a ser exibido na árvore (aqui curto)
      "tipo" => '$2' # campo específico
    )
  ),
  "folha" => array( # propriedades das folhas
    "padrao" => '/^([0-9\.]+);([^;]+);([^;]*);([^;]+);([^;]+);([0-9\.\,\s]+)/', #padrão
    "format" => array( # informações que devem ser extraídas do padrão
      "id" => '$1', # o id sempre deve ser preservado para referência
      "text" => '$2 $4 R$ $6/$5', # o texto descritivo que resume a folha
      "description" => '$4',
      "codigo" => '$2',
      "valor" => '$6' # o valor em formato float
    ),
    "float" => array( # TODO campos que devem ser convertidos em float
      "valor"
    )
  )
);
