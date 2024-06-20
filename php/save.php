#!/usr/bin/php-cgi
<?php
    session_start();
    $_POST = json_decode(file_get_contents('php://input'), true);

    $_SESSION['uuid'] = $_POST['uuid'];
    $_SESSION['pairs'] = $_POST['pairs'];
    $_SESSION['points'] = $_POST['points'];
    $_SESSION['cards'] = $_POST['cards'];

    $encodeCards = json_encode($_SESSION['cards']);

    // Connexió a la base de dades
    $conn = oci_connect('**********', '*********', 'ORCLCDB');
    if (!$conn) {
        $e = oci_error();
        echo json_encode(array('error' => $e['message']));
        exit;
    }

    // Comprovació si ja existeix una entrada amb el mateix uuid
    $query = "SELECT COUNT(*) AS count FROM memory_save WHERE uuid = :uuid";
    $stid = oci_parse($conn, $query);
    oci_bind_by_name($stid, ":uuid", $_SESSION['uuid']);
    oci_execute($stid);
    $row = oci_fetch_array($stid, OCI_ASSOC);
    $count = $row['COUNT'];

    if ($count > 0) {
        // Actualitzar les dades existents
        $update = "UPDATE memory_save SET pairs = :pairs, points = :points, cards = :cards WHERE uuid = :uuid";
        $comanda = oci_parse($conn, $update);
    } else {
        // Inserir noves dades
        $insert = "INSERT INTO memory_save (uuid, pairs, points, cards) VALUES (:uuid, :pairs, :points, :cards)";
        $comanda = oci_parse($conn, $insert);
    }

    oci_bind_by_name($comanda, ":uuid", $_SESSION['uuid']);
    oci_bind_by_name($comanda, ":pairs", $_SESSION['pairs']);
    oci_bind_by_name($comanda, ":points", $_SESSION['points']);
    oci_bind_by_name($comanda, ":cards", $encodeCards);
    oci_execute($comanda);

    oci_free_statement($stid);
    oci_close($conn);

    echo json_encode(true);
?>
