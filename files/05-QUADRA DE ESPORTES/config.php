<?php
$config = array(
  "name" => "CONSTRUÇÃO DE QUADRA DE ESPORTE COM VESTIÁRIOS E SALAS DE APOIO",
  "customizable" => false,
  "hasImages" => false,
  "recursiveSum" => true,
  "open" => array("001", "001.01"),
  "selected" => array("001"),
  "no" => array(
    "padrao" => '/^([0-9\.]+);;([^;]+);;;([0-9\.\,]+)/',
    "format" => array(
      "id" => '$1',
      "text" => '$2',
      "valor" => '$3'
    )
  ),
  "folha" => array(
    "padrao" => '/([0-9\.]+);([^;]*);([^;]+);([^;]+);([0-9\.\,]+);([0-9\.\,]+)/',
    "format" => array(
      "id" => '$1',
      "text" => '$2 $3 $5 x R$ $6/$4',
      "qtd" => '$5',
      "valor" => '$6'
    ),
    "float" => array(
      "qtd",
      "valor"
    )
  )
);
