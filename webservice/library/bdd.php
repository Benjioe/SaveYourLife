<?php
/**
* Classe permettant de gérer les accès à la BDD
**/
class bdd {
    public $pdo;
    public $db = 'fabiendhcgepsi';

    public function __construct() {
        $this->connect();
    }

    public function connect(){
        $this->pdo = new PDO('mysql:host=localhost;dbname='.$this->db, 'fabiendhcgepsi', 'Toto1234');
    }


    // delete
    // retourne nombre de row affectés
    public function exec($sql) {
        $res = $this->pdo->exec($sql);
        return $res;
    }

    // insert / update
    //retourn id ajouté
     public function create($sql) {
        $res = $this->pdo->exec($sql);
        return $this->pdo->lastInsertId();
    }

    // execute un select
    // retourne un tableau de data
    function select($sql){
        $req = $this->pdo->query($sql);
        return $req->fetchAll(PDO::FETCH_ASSOC);
    }


}
