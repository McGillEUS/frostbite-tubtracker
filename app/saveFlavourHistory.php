<?php
    $data = $_POST['data'];
    echo $data;
    $fname = "flavourBackup-" . date("Y-m-d") . ".json";
    $file = fopen("tubs/" . $fname, 'w');
    fwrite($file, $data);
    fclose($file);
?>