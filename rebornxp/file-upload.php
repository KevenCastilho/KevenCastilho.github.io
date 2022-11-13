<?php

$nome_pasta = $_SERVER['HTTP_HOST'];
// $tst = $_SERVER['PHP_SELF'];

// echo json_encode(
// 	[
// 		'status' => 'error',
// 		'info'   => $tst,
// 	]
// );
// exit;
/**
 * Dropzone PHP file upload/delete
 */

// Check if the request is for deleting or uploading
$delete_file = 0;
if ( isset($_POST['delete_file']) ) {
    $delete_file = $_POST['delete_file'];
}

// $targetPath = dirname( __FILE__ ) . '/arquivos' . $nome_pasta . '/';
$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
$targetPath = '/home/vol2_3/epizy.com/epiz_28273216/htdocs/rebornxp/' . $nome_pasta . '/';
// Check if it's an upload or delete and if there is a file in the form
if ( !empty($_FILES) && $delete_file == 0 ) {

    // Check if the upload folder is exists
    if ( file_exists($targetPath) && is_dir($targetPath) ) {

        // Check if we can write in the target directory
        if ( is_writable($targetPath) ) {

            /**
             * Start dancing
             */
            $tempFile = $_FILES['file']['tmp_name'];

            $targetFile = $targetPath . $_FILES['file']['name'];

            // Check if there is any file with the same name
            if ( !file_exists($targetFile) ) {

                // Upload the file
                move_uploaded_file($tempFile, $targetFile);

                // Be sure that the file has been uploaded
               if ( file_exists($targetFile) ) {
                    $response = array (
                        'status'    => 'success',
                        'info'      => 'Seu arquivo foi carregado com sucesso.',
                        'file_link' => $targetFile
                    );
                } else {
                    $response = array (
                        'status' => 'error',
                        'info'   => 'Não foi possível enviar o arquivo solicitado :(, algo de errado não está certo!'
                    );
                }
                $response = array (
                    'status' => 'success',
                    'info'   => 'Seu arquivo foi carregado com sucesso.',
					'file_link' => $targetFile
                );

            } else {
                // A file with the same name is already here
                $response = array (
                    'status'    => 'error',
                    'info'      => 'Já existe um arquivo com o mesmo nome.',
                    'file_link' => $targetFile
                );
            }

        } else {
            $response = array (
                'status' => 'error',
                'info'   => 'Não existe permissão de escrita para a pasta de upload especificada.'
            );
        }
    } else {
        $response = array (
            'status' => 'error',
            'info'   => 'Não existe uma pasta de upload. por favor crie uma!'
        );
    }

    // Return the response
    echo json_encode($response);
    exit;
}


// Remove file
if ( $delete_file == 1 ) {
    if ( ! isset( $_POST['target_file'] ) ) {
        $response = array (
            'status' => 'error',
            'info'   => 'target_file is not valid!'
        );
        echo json_encode($response);
    }

    $file_path = $_POST['target_file'];

    // Check if file is exists
    if ( file_exists($file_path) ) {

        // Delete the file
        unlink($file_path);

        // Be sure we deleted the file
        if ( !file_exists($file_path) ) {
            $response = array (
                'status' => 'success',
                'info'   => 'Successfully Deleted.'
            );
        } else {
            // Check the directory's permissions
            $response = array (
                'status' => 'error',
                'info'   => 'We screwed up, the file can\'t be deleted.'
            );
        }
    } else {
        // Something weird happend and we lost the file
        $response = array (
            'status' => 'error',
            'info'   => 'Couldn\'t find the requested file :('
        );
    }

    // Return the response
    echo json_encode($response);
    exit;
}

?>