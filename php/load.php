#!/usr/bin/php-cgi
<?php
    session_start();
    $ret = new stdClass();

    // Connexió a la base de dades
    $conn = oci_connect('**********', '*********', 'ORCLCDB');
    if (!$conn) {
        $e = oci_error();
        echo json_encode(array('error' => $e['message']));
        exit;
    }

    // Recuperar les dades de la base de dades
    $uuid = $_SESSION['uuid'];
    $query = "SELECT pairs, points, cards FROM memory_save WHERE uuid = :uuid";
    $stid = oci_parse($conn, $query);
    oci_bind_by_name($stid, ":uuid", $uuid);
    oci_execute($stid);

    if ($row = oci_fetch_array($stid, OCI_ASSOC)) {
        $ret->pairs = $row['PAIRS'];
        $ret->points = $row['POINTS'];
        $ret->cards = json_decode($row['CARDS']);
    } else {
        $ret->pairs = null;
        $ret->points = null;
        $ret->cards = null;
    }

    oci_free_statement($stid);
    oci_close($conn);

    echo json_encode($ret);
?>
