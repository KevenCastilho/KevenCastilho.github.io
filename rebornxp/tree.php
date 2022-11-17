<?php

$nome_pasta = $_SERVER['HTTP_HOST'];

$dir = $nome_pasta;

// Run the recursive function 

$response = scan($dir);


// This function scans the files folder recursively, and builds a large array

function scan($dir) {

	$pastas = '';
	$link = urlencode($dir);
	$separa = explode('/', $dir);
	foreach($separa as $pasta){
		$nomePasta = $pasta;
	}
	if (file_exists($dir)) {
		$pastas .= '
				<li>
					<details>
						<summary><a href="#' . $link . '">' . $nomePasta . '</a></summary>
						<ul>
		';
		foreach (scandir($dir) as $folder) {

			if (!$folder || $folder[0] == '.') {
				continue; // Ignore hidden files
			}
			$pastaAtual = $dir . '/' . $folder;
			if (is_dir($pastaAtual)) {

				// The path is a folder
				
				$pastas .= scan($pastaAtual);
				
			}
		}
		$pastas .= '
						</ul>
					</details>
				</li>
		';
	}

	return $pastas;
}

echo $response;
?>