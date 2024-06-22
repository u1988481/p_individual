#!/usr/bin/php-cgi
<?php
session_start();

header('Content-Type: application/json');

$conn = oci_connect('u1988481', 'lleurenb', 'ORCLCDB');
if (!$conn) {
    $e = oci_error();
    echo json_encode(['error' => $e['message']]);
    exit;
}

$uuid = $_SESSION['uuid'];

$select = "SELECT pairs, points, cards FROM memory_save WHERE uuid = :uuid ORDER BY id DESC";
$comanda = oci_parse($conn, $select);
oci_bind_by_name($comanda, ":uuid", $uuid);
oci_execute($comanda);

$row = oci_fetch_assoc($comanda);
if ($row) {
    $_SESSION['pairs'] = $row['PAIRS'];
    $_SESSION['points'] = $row['POINTS'];
    $_SESSION['cards'] = $row['CARDS'];

    $ret = new stdClass();
    $ret->pairs = $_SESSION['pairs'];
    $ret->points = $_SESSION['points'];
    $ret->cards = json_decode($_SESSION['cards']);

    echo json_encode($ret);
} else {
    echo json_encode(['error' => 'No data found for the provided UUID.']);
}

oci_free_statement($comanda);
oci_close($conn);
?>
