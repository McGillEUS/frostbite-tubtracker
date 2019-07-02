<?php
    $data = $_POST['flavour'];
    $fname = "flavours.json";
    $file = fopen("tubs/" . $fname, 'w');
    fwrite($file, $data);
    fclose($file);
?>