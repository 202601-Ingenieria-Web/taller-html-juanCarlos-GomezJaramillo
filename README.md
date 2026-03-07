# Taller Evaluable 1 - html Juan Carlos Gomez Jaramillo
# Ingeniería Web

## Propósito del proyecto:
El repositorio contiene una aplicación web sencilla que conecta la [API](https://rickandmortyapi.com/) de Rick and Morthy. Esta consta de archivos html que renderizan así:

1. indx.html: Es la página inicial, básicamente muestra renderiza todos los personajes por medio del endpoint **Get all characters**:
      
      **GET** <https://rickandmortyapi.com/api/character>

      Esta página cuenta con un nav que permite ir entre páginas, cada pagina trae 10 personajes ubicados en dos filas. 

2. La otra página, muestra los episodios, esta se consume en el enpoint **Get all episodes**:

      **GET** <https://rickandmortyapi.com/api/episode>

      En esta página el usuario puede ver cada uno de los episodios de la serie con su número (que van desde el 1 hasta el 51), la fecha de lanzamiento del episodio y los personajes que intervienen en el episodio. Además el usuario puedo interactuar con los personjes que salen en cada uno de los episodios, al dar click sobre uno de ellos, se mostrará una pequeña tarjeta que muestran el nombre del personaje, su raza, su origen, el status y si está vivo.

      El usuario puede interactuar también buscando en el input superior digitando el nombre del episodio o una palabra clave de este.
      
      ![alt text](image.png)