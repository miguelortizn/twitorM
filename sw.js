//Imports
importScripts('js/sw-utils.js');



const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const UNMUTABLE_CACHE = 'unmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

//cargando el cache
self.addEventListener('install',e=>{


    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>cache.addAll(APP_SHELL));
    const cacheUnmutable = caches.open(UNMUTABLE_CACHE).then(cache =>cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic,cacheUnmutable]));


});

//borramos el cache viejo
self.addEventListener('activate', e => {


    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            // static-v4
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });



    e.waitUntil( respuesta );

});

self.addEventListener('fetch', e=>{


     const respuesta = caches.match(e.request).then(resp=>{

                if (resp) {
                    return resp;
                } else {
                   return fetch(e.request).then(res=> {

                    return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,res);

                   })
                }

              
        
            });


    e.respondWith(respuesta);
});