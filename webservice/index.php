<?php

spl_autoload_register('apiAutoload');
function apiAutoload($classname)
{
  // si on a une entite en parametre
  if ($classname != 'Controller') {
    if (preg_match('/[a-zA-Z]+Controller$/', $classname)) {
      include __DIR__ . '/controllers/' . $classname . '.php';
      return true;
    } elseif (preg_match('/[a-zA-Z]+View$/', $classname)) {
      include __DIR__ . '/views/' . $classname . '.php';
      return true;
    } else {
      include __DIR__ . '/library/' . str_replace('_', DIRECTORY_SEPARATOR, $classname) . '.php';
      return true;
    }
    return false;
  }
  return true;
}

$request = new Request();

// route the request to the right place
$controller_name = ucfirst($request->url_elements[1]) . 'Controller';
if (class_exists($controller_name)) {
  $controller = new $controller_name();
  $action_name = strtolower($request->verb) . 'Action';
  $result = $controller->$action_name($request);

  $view_name = ucfirst($request->format) . 'View';
  if(class_exists($view_name)) {
    $view = new $view_name();
    $view->render($result);
  }
}

?>
