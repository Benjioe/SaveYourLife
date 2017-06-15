<?php

class Request {
    public $url_elements;
    public $verb;
    public $parameters;

    public function __construct() {
        $this->verb = $_SERVER['REQUEST_METHOD'];
        if (!empty($_SERVER['PATH_INFO'])){
            $this->url_elements = explode('/', $_SERVER['PATH_INFO']);

            $this->parseIncomingParams();
            $this->format = 'json';
            if(isset($this->parameters['format'])) {
                $this->format = $this->parameters['format'];
            }
        }
        return true;
    }

    public function parseIncomingParams() {
        $parameters = array();

        // get / delete
        if (isset($_SERVER['QUERY_STRING'])) {
            parse_str($_SERVER['QUERY_STRING'], $parameters);
        }

        // put / post
        $body = file_get_contents("php://input");
        
        $body_params = json_decode($body);
        if($body_params) {
            foreach($body_params as $param_name => $param_value) {
                $parameters[$param_name] = $param_value;
            }
        }
        $this->format = "json";
           
        $this->parameters = $parameters;
    }
}
