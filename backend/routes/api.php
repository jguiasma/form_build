<?php

foreach (glob(__DIR__.'/rest/*.php') as $routeFile) {
    require $routeFile;
}
