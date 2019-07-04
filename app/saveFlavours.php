<?php
    $data = json_decode($_POST["data"]);
    $fname = "flavours.json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data));
    fclose($file);
    chmod("../tubs/" . $fname, 0777);
?>