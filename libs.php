<?php
$lib_path = "./lib";

### CSS
$libs_css = array(
  "bootstrap-flatly",
  "simple-sidebar",
  "jstree/style",
  "tree",
  "font-awesome",
  "jquery-confirm.min",
  "printingConfig",
  "orcapara");

foreach ($libs_css as $filename) {
  $filename = $lib_path.'/css/'.$filename; ?>
  <link rel="stylesheet" href="<?php echo $filename; ?>.css" charset="utf-8">
<?php }

### JS
$libs_js = array(
  "jquery-2.2.4",
  "bootstrap",
  "jstree",
    "saveAs",
    "jquery.base64",
    "base64",
    "sprintf",
    "jspdf",
    "jspdf.autotable",
  "tableExport",
  "storage",
  "printOrca",
  "exportTo",
  "jquery-confirm.min",
  "selectCustomizable",
  "selectNotCustomizable",
  "loadOrca",
  "startup",);

foreach ($libs_js as $filename) {
  $filename = $lib_path.'/js/'.$filename; ?>
  <script src="<?php echo $filename; ?>.js" charset="utf-8"></script>
<?php }
