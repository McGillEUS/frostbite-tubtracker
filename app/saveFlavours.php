<?php
    $data = $_POST['data'];
    echo $data;
    $fname = "flavours.json";
    $file = fopen("tubs/" . $fname, 'w');
    fwrite($file, $data);
    fclose($file);
?>