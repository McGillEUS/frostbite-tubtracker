<?php
    $data = json_decode($_POST["data"]);
    $fname = "tubs-backup-" . date("Y-m-d") . ".json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data, JSON_PRETTY_PRINT));
    fclose($file);
    chmod("../tubs/" . $fname, 0777);
?>