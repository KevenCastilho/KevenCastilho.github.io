<?php
$url = "https://api.github.com/users/KevenCastilho/repos";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

curl_setopt($curl, CURLOPT_USERAGENT, $config['useragent']);

curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);

$obj = json_decode($resp);

$resultado = array();

function responsa($arr){
	foreach($arr as $chave => $valor){
		if(!is_null($chave) && !is_null($valor)){
			if(is_array($valor)||is_object($valor)){
				$resultado[] = responsa($valor);
			} else {
				$resultado[] = [$chave,$valor];
			}
		}
	}
	return $resultado;
}
var_dump(responsa($obj));
// var_dump($obj);
// print_r('<pre>' . $resp . '</pre>');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>

</body>
</html>
