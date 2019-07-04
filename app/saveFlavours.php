<?php
    $data = json_decode($_POST);
    $fname = "flavours.json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data));
    chmod($file, 0777);
    fclose($file);
?>