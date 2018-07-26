<?php
# Função para recodificar strings das folhas da árvore
function processTreeLeafs(&$value, $key, $floats=array()) {
  if (in_array($key, $floats)) { # se campo estiver na lista de floats,
    # converte de string para float retirando pontos extras, e trocando vírgulas
    # por pontos antes de transformar em float, só por precaução
    $value = floatval(str_replace(',', '.', str_replace('.', '', $value)));
  } else {
    # se o nome do campo não estiver na lista, então converta-o para string
    # com a formatação adequada (UTF-8), obviamente.
    $value = mb_convert_encoding($value, "UTF-8", "UTF-8, Windows-1252, ".mb_internal_encoding());
  }
}

# Função para agrupar subníveis da árvore em children e atribuir propriedades
function processTreeNodes(&$tree, $opened=array(), $selected=array()) {
  # esta funçao utiliza varredura por profundidade, movendo antes da recursão
  if (is_array($tree)) {
      foreach($tree as $key => $node) {
        # se o id do nó estiver na ilsta de abertos ou selecionados, atribui
        # nó: {state:{opened:true}} e/ou nó: {state:{selected:true}}
        if (in_array($key, $opened)) {$node["state"]["opened"] = true;}
        if (in_array($key, $selected)) {$node["state"]["selected"] = true;}
        # Se o índice for numérico, copia para children, apaga e entra no nó
        # copiado para um nível abaixo
        if (is_numeric($key)) {
          $tree['children'][] = $node; # copia nó para children
          unset($tree[$key]); # remove este valor da árvore
          $lastChild = count($tree['children']);
          processTreeNodes($tree['children'][$lastChild-1]); # adentra ao nó copiado
        }
      }
  }
}
