$data = $_POST['data'];
print($data);
$fname = "flavours.json";

$file = fopen("tubs/" . $fname, 'w');
fwrite($file, $data);
fclose($file);