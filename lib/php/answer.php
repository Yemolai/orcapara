<?php
// Função para responder ao cliente com JSON e finalizar a execução
function answer($response, $code=200, $dieAfterResponse = true) {
  $CODE_LIST = array( // Lista de códigos de resposta
    200 => array("code"=>200, "message"=>"OK"),
    400 => array("code"=>400, "message"=>"Invalid request"),
    403 => array("code"=>403, "message"=>"Forbidden"),
    404 => array("code"=>404, "message"=>"Not found"),
    500 => array("code"=>500, "message"=>"Internal Error")
  );
  (!is_string($code))?:$code=intval($code); // convert to int if is string
  # cabeçalho de tipo de conteúdo da resposta e sua codificação
  header("Content-Type: application/json; charset=utf-8");
  # cabeçalho de código de estado
  header($_SERVER['SERVER_PROTOCOL']." ".$CODE_LIST[$code]['code']." ".
    $CODE_LIST[$code]['message'], true, $CODE_LIST[$code]['code']);

  $output = $CODE_LIST[$code];
  # Se não tiver resposta definida, não usa campo data/error
  if (!empty($response)) # Responde com dados se for OK(200), senão com erro
  { $output[$code==200?"data":"error"] = $response; }
  # codifica a resposta como JSON
  echo json_encode($output);
  ob_flush();
  exit(0); # interrompe o script
}
