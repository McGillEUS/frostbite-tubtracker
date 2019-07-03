<?php
    $data = json_decode($_POST['data']);
    $fname = "flavourBackup-" . date("Y-m-d") . ".json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data));
    chmod($file, 777);
    fclose($file);
?>