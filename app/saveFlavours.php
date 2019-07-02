<?php
    $data = $_POST['data'];
    $fname = "flavours.json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data));
    fclose($file);
?>