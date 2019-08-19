<?php
    $data = json_decode($_POST["data"]);
    $fname = "oapSales.json";
    $file = fopen("../tubs/" . $fname, "w");
    fwrite($file, json_encode($data, JSON_PRETTY_PRINT));
    fclose($file);
?>