<?php
ini_set('display_errors', 0);
error_reporting(0);
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip'))
  {ob_start("ob_gzhandler");}
else {ob_start();}
// --------------------------------- INICIALIZAÇÃO
# Configurações e constantes utilizadas no processo
const FILE_PATH = "./files"; # caminho do diretório base de todos os arquivos
const CONFIG_FILENAME = "config.php"; # nome de arquico de configuração
const CACHE_EXT = "json"; # arquivo de cache
const SRC_EXT = "csv"; # extensão utilizada no processamento
const DELIMITER = ";"; # delimitador de colunas do arquivo fonte
const LIB = "./lib/php/"; # caminho do diretório base de bibliotecas e funções
const DEFAULT_CACHE_NAME = "cache";

# tipos de arquivos extras que serão listados como links para download
$DOC_EXT = array("odf", "odt", "doc", "docx", "ods", "xls", "xlsx", "pdf");
$READ_ENCODING = "UTF-8, Windows-1252, ".mb_internal_encoding(); # input/entrada
$IGNORED_FOLDERS = array(".", ".."); # diretorios ignorados nas varreduras
$WRITE_ENCODING = "UTF-8"; # codificação de saída/output encoding

# Handy helper life-saving functions
include LIB."explodeTree.php"; # traz a função explodeTree()
include LIB."treeFunctions.php"; # traz processTreeLeafs() e processTreeNodes()
include LIB."answer.php"; # traz a função de resposta answer()

// ---------------------------------- PROCESSAMENTO

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
/*              Varredura buscando as pastas de orçamentos                    */
//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
$files = array(); # files tem uma lista com os nomes de pasta para representação
# ler pasta
$folderList = array_values(array_diff(scandir(FILE_PATH), $IGNORED_FOLDERS));

# Busca por arquivos na lista e remove-os
foreach ($folderList as $key => $folder) {
  if (!is_dir(FILE_PATH.'/'.$folder)) { unset($folderList[$key]); }
}

# Já a folderList tem os nomes "como é"/"as is", para referenciar ao sistema
$idx = 1; # $files initial index NÃO ALTERE ESSE VALOR
foreach ($folderList as $folder) // Converter codificação de cada nome
{$files[$idx++] = mb_convert_encoding($folder,$WRITE_ENCODING,$READ_ENCODING);}

if (!isset($_GET['id'])) { answer($files, 200); } # se não tiver id na requisição
# responde com a lista de arquivos

$requestFile = filter_input(INPUT_GET, 'id'); # adquire id de requisição
$fileID = intval($requestFile); # converte para número inteiro

# se não for um número, recusa e informa que não há id na requisição
if (empty($fileID)) { answer("Requisição sem número de referência", 400); }

# se o número não for de um dos arquivos existentes, recusa e informa
if (!isset($files[$fileID])) { answer("Arquivo não encontrado", 404); }

# $files/$fileID começa em 1 e $folderList em 0
$filePath = FILE_PATH.'/'.$folderList[$fileID-1];


//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
/*                 Varredura das versões de um orçamento                      */
//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
# lista de possíveis versões deste arquivo
$versionList = array_diff(scandir($filePath, true), $IGNORED_FOLDERS);

# busca por arquivos no diretório e remove-os da lista
foreach ($versionList as $key => $value) {
  if (!is_dir($filePath.'/'.$value)) unset($versionList[$key]);
}
$versionList = array_values($versionList); # para reorganizar os índices

# Se não há versão na requisição, utilizar a versão mais recente
if (!isset($_GET['version'])) $versionAsked = $rawVersionAsked = 0;
else $versionAsked = intval($rawVersionAsked = filter_input(INPUT_GET,
  'version'));
# se houver, adquira da requisição a versão solicitada
if ($versionAsked != $rawVersionAsked) {
  # se a versão solicitada não for numérica busca no array pelo valor
  $versionKey = array_search($rawVersionAsked, $versionList);
  if ($versionKey === false) { # se não encontrar
    # responda informando o erro
    answer("Versão de arquivo não encontrada.", 404);
  } else { // se encontrar, registre o índice
    $versionAsked = $versionKey;
  }
}

# se versão pedida for lista, retornará a lista de versões do arquivo requerido
if ($rawVersionAsked === "list") answer($versionList);

# se a versão pedida não existir, pára e informa
if (!isset($versionList[$versionAsked])) answer("Versão de arquivo não \
  encontrada", 404);

# versão a ser utilizada
$version = $versionList[$versionAsked];

# caminho de diretório da versão, ou seja, source/fonte
$srcPath = $filePath.'/'.$version;

# Nomes de arquivo
$srcFile = array(); # array para verificar caso exista duplicidade
$cacheFile = array();
$extraFiles = array(); # links para arquivos extras
$diretorio = new DirectoryIterator($srcPath); # iterador de pasta

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
/*                     Inclusão do arquivo de configuração                    */
//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
$configPath = $filePath.'/'.CONFIG_FILENAME;

# verifica se arquivo de configuração existe, se não responde com erro interno
if (!file_exists($configPath)) { answer("Erro interno. Não há arquivo de \
  configuração do orçamento.", 500); }

include($configPath); # inclui arquivo de configuração, traz $config

# começa a construir a resposta
$response = array(
  "config"=> array( # metadados da árvore
    "name"=>($config["name"])?:$files[$fileID], # nome do orçamento
    "version"=>$version, # versão dos dados sendo fornecidos
    "customizable"=>($config["customizable"])?:false, # personalizável?
    "hasImages"=>($config["hasImages"])?:false # usa imagens?
  )
);

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
/*            Varredura pelos arquivos de dados CSV, JSON e extras            */
//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##

### busca por arquivos ###
foreach ($diretorio as $fileInfo) {
  if($fileInfo->isFile()) { ## se é arquivo,
    # converte o nome do arquivo com extensão para minúsculas
    $fileExt = mb_convert_case(pathinfo($fileInfo->getFilename(),
      PATHINFO_EXTENSION), MB_CASE_LOWER);
    # se a extensão do arquivo for o tipo do source
    if ($fileExt == SRC_EXT) { # .CSV
      # guarde esse nome de arquivo na lista de sources
      $srcFile[] = $fileInfo->getFilename();
    } else
    # se a extensão do arquivo for o tipo do cache
    if ($fileExt == CACHE_EXT) {
      # guarde esse nome de arquivo na lista de caches
      $cacheFile[] = $fileInfo->getFilename();
    } else
    # se for de um dos tipos de arquivo extra a ser listado
    if (in_array($fileExt, $DOC_EXT)) {
      # guarde na lista de arquivos extra com a codificação correta
      $extraFiles[] = mb_convert_encoding($srcPath.'/'.$fileInfo->getFilename(),
        $WRITE_ENCODING, $READ_ENCODING);
    }
  }
}

## Adiciona lista de links dos arquivos extras à resposta
$response["files"]=($extraFiles)?:array(); # arquivos extras (PDF, XLS, etc.)

if (count($cacheFile)>1) { answer("Erro interno. Múltiplos arquivos de cache \
  disponíveis no diretório.",500); }
  else
if (count ($cacheFile)==1) {
  $cacheFile = $cacheFile[0];
  $cacheJSON = file_get_contents($srcPath.'/'.$cacheFile);
  if (empty($cacheJSON)) { answer("Erro interno. Cache existe, mas está vazio.",
    500); }
  $cache = json_decode($cacheJSON, true);
  if (empty($cache)) { answer("Erro interno. Cache malformado/malformatado.",
    500); }
    unset($cacheJSON);
  $response["tree"] = $cache;
  unset($cache);
  answer($response);
}

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
/*                     Conversão de arquivo CSV para JSON                     */
//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##
# verificar se existe arquivo fonte
if (empty($srcFile)) { answer("Erro interno. Planilha de ${files[$fileID]} \
  versão $version não encontrada.", 500); }

# verificar se há mais de um arquivo fonte
if (count($srcFile) > 1) { answer("Erro interno. Múltiplas planilhas de\
   ${files[$fileID]} versão $version.", 500); }

$srcFile = (!is_array($srcFile))?:$srcFile[0]; # Array? pega a primeira prosição

# inicializa um handler pra manipular o arquivo fonte (sendo somente-leitura)
$srcHandler = fopen($srcPath.'/'.$srcFile, 'rt');

if(!$srcHandler) { answer("Erro interno. Não foi possível abrir o arquivo \
   $srcFile de ${files[$fileID]} versão $version.", 500); }

$src = array(); # p/ler o arquivo de fonte, inicializar a variável vazia é bom

while (($linha = fgets($srcHandler, 8192)) !== false) { # lê linha com até 8192b
  $identificador = explode(';', $linha); # quebra a cada ;
  if (empty($identificador)) {continue;} # linha vazia? pula iteração
  $identificador = explode('.',$identificador[0]); # primeira coluna quebra em .

  # O primeiro trecho do identificador não for numérico? Pule esta iteração.
  if (!is_numeric($identificador[0])) {continue;}

  $identificador = implode('.', $identificador); # une identificador com pontos

  # Posição usada nesta iteração é indefinida? Defina-a como um array vazio
  $src[$identificador]=($src[$identificador])?:array();
  $srcPos = &$src[$identificador]; # passa por referência para alteração
  $isNode = preg_match($config["no"]["padrao"], $linha); # é nó? (REGEX)
  $isLeaf = preg_match($config["folha"]["padrao"], $linha); # é folha? (REGEX)
  $type = ($isNode) ? "no" : (($isLeaf) ? "folha" : false) ; # nó, folha, o que?
  if (!$type) {continue;} # se for "o que"/indefinido, pula iteração.
  $pattern = $config[$type]["padrao"]; # carrega o padrão adequado
  $format = $config[$type]["format"]; # carrega a formatação adequada
  foreach ($format as $field => $replacement) { # pra cada campo
    # executa uma substituição para extrair apenas a informação desejada
    $srcPos[$field] = trim(preg_replace($pattern, $replacement, $linha));
    # p.s.: essa substituição não altera a $linha original
    # p.s.(2): $pattern se mantém, $replacement varia, ambos do vem de $config
  }
}

$tree = explodeTree($src, '.'); # explode o array em árvore

# converte todas as Strings
array_walk_recursive($tree, "processTreeLeafs", $config["folha"]['float']);

# ajusta o agrupamento de nós da árvore e as propriedades de nós e folhas
processTreeNodes($tree, $config['open'], $config['selected']);

# elimina o primeiro nível de raiz e usa o primeiro filho como raiz
$tree = $tree['children'];

file_put_contents($srcPath.'/'.DEFAULT_CACHE_NAME.'.json', json_encode($tree),
  LOCK_EX);

# compõe a resposta final
$response["tree"] = $tree; # dados da árvore

answer($response); # responde a última resposta ao cliente
