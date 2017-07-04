<?php

class AuthController
{

  // GET
  public function getAction($request) {
    $pdo = new bdd();
    if(isset($request->url_elements[2]) && $request->url_elements[2] != '') {
      // GET ONE AUTH
      $id_reservation = $request->url_elements[2];
      $data =  $pdo->select('SELECT * FROM auth WHERE id_client = "' . $id_reservation . ' " '  );
      if ($data == []) {
        header("HTTP/1.1 404 Client Not Found");
      } else {
        header("HTTP/1.1 200 Client Found");
      }
    } else {
      // GET ALL AUTH
      $data =  $pdo->select('SELECT * FROM auth');
      header("HTTP/1.1 200 Found");
    }
    return $data;
  }


  // DELETE
  public function deleteAction($request) {
    $pdo = new bdd();
    if(isset($parameters["id_client"]) && $parameters["id_client"] != '') {
      $id_client = $request->$parameters["id_client"];
      $res = $pdo->exec('DELETE FROM auth WHERE id_client = ' . $id_client);
      if ($res) {
        header("HTTP/1.1 200 Client deleted");
      } else {
        header("HTTP/1.1 404 id_client not found");
      }
    } else {
      header("HTTP/1.1 404 id_client not found");
    }
    return [];
  }


  // POST
  public function postAction($request) {
    $pdo = new bdd();
    if ((isset($request->parameters['id_client']) &&  $request->parameters['id_client'] != null)
    && (isset($request->parameters['cle']) &&  $request->parameters['cle'] != null)
    && (isset($request->parameters['token']) &&  $request->parameters['token'] != null)) {

      $id_client = $request->parameters['id_client'];
      $cle = $request->parameters['cle'];
      $token = $request->parameters['token'];
      $sql = stripslashes("INSERT INTO auth (id_client, cle, token) VALUES ( \"" . $id_client . "\",\"" . $cle . "\",\"" . $token ."\")");
      $pdo->create($sql);
      return $sql;
      header("HTTP/1.1 200 Client created");
    } else {
      header("HTTP/1.1 404 Parameters error");
    }
    return [];
  }

}
?>
