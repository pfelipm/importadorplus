![Created with - Google Apps Script](https://img.shields.io/static/v1?label=Created+with&message=Google+Apps+Script&color=blue)

# ¿Qué es Importador++?

![Importador+ test 1](https://user-images.githubusercontent.com/12829262/71702547-57572d80-2dd0-11ea-9718-d74bc4ba6bb9.gif)

**Importador++** es la modesta evolución de un pequeño script GAS creado a modo de ejemplo didáctico de uso del servicio Apps Script de hojas de cálculo de Google en el contexto del bloque de _Gestión Digital Eficaz_ que impartí en octubre de 2019 dentro del [Programa TIE](https://www.weforteachers.com/mba/) de Uteach (ahora Weforteachers). Se trata de una sencilla plantilla que permite consolidar información dispersa en distintas hojas de cálculo de Google.

Probablemente estarás pensando en que para hacer algo parecido ya existe la función integrada `=IMPORTRANGE(URL; Rango)`. Y tendrás razón. No obstante, `IMPORTRANGE` presenta algunas particularidades:

*   No importa el formato de las celdas, solo sus valores numéricos o de texto.
*   No importa las fórmulas, sino el resultado de su evaluación en el momento de la adquisición.
*   La conexión con las hojas de datos de las que se adquiere información debe ser autorizada previamente.
*   El intercambio de información es unidireccional, a menos que se combinen diversas funciones `IMPORTRANGE`, lo que puede llevar a bonitas paradojas circulares.
*   Los datos se actualizan automáticamente y casi casi en tiempo real, a todos los efectos los rangos de datos de origen y destino están vinculados, no replicados.

¿Quiero esto decir que **Importador++** es preferible a `IMPORTRANGE`? En absoluto. Simplemente, funciona de un modo diferente que puede resultar ventajoso en determinadas circunstancias.

# ¿Cómo funciona?

1.  Obtén una copia de la plantilla de **Importador++** haciendo clic [aquí](https://docs.google.com/spreadsheets/d/18EQAHxf-pvijBnzjpy3M4Q_WDkFvsoO54tns5gO51yM/template/preview) y a continuación en `Utilizar plantilla`.

![Importador++ - plantilla - Hojas de cálculo de Google - Google Chrome_999](https://user-images.githubusercontent.com/12829262/71700231-96cb4d00-2dc3-11ea-8b45-ac6e52fdc83d.png)

1.  Dirígete a la hoja denominada `🔄 Importar+`.
2.  Cada fila representa un _trabajo_ de importación, añade tantas como necesites.
    *   **Origen / ID o URL**: URL (tal y como aparece en el navegador, incluyendo el prefijo `https://`) de la hoja de cálculo donde se encuentran los datos o, alternativamente, su ID alfanumérico (ejemplo: `https://docs.google.com/spreadsheets/d/17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w/edit#gid=0` o `17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w`).
    *   **Origen / Hoja**: Nombre de la hoja de datos (pestaña) donde se encuentran los datos a importar (ejemplo `Hoja 1`).
    *   **Origen / Rango**: Rango de datos objetivo, se admiten rangos infinitos (ejemplo `A2:E`).
    *   **Destino / Hoja**: Nombre de la hoja, siemppre dentro de la HdC de **Importador++**, donde se depositarán los datos importados (ejemplo `Hoja 1`).
    *   **Destino / Rango**: Celda superior izquierda del rango en la hoja destino donde se copiarán los valores procedentes de la hoja de cálculo de origen (ejemplo `A1`).
    *   **Opciones de copia**: Estas casillas de verificación permiten escoger selectivamente qué elementos del rango de origen, además del propio contenido de las celdas, serán copiados. Solo aparecerán en cada fila cuando la celda correspondiente en la columna **ID / URL** deje de estar vacía.
        *   **Formato**: Fuente, tamaño, estilo, colores de texto y fondo, bordes, alineación horizontal y vertical, rotación, ajuste de texto, formato de número, combinaciones de celdas, formato condicional, validación, colores alternos e incluso texto enriquecido (celdas con distintos atributos en diferentes partes del texto).
        *   **Fórmulas**: Si se activa, copia las fórmulas tal cual en lugar del resultado de su evaluación en la hoja de origen.
        *   **Anchura**: Ancho de columnas.
        *   **Altura**: Alto de filas.
        *   **Notas**: Notas insertadas en las celdas.
3.  Asegúrate de marcar la casilla de verificación en la columna `Activar` para que el trabajo de importación quede marcado como activo y sea procesado.
4.  Utiliza los comandos del menú `🔄 Importador+` para **importar** (recibir datos de las HdC origen) o **exportar** (empujar datos desde la plantilla a sus HdC originales).
5.  Las **columnas L y M** se actualizan tras cada ejecución de los trabajos programados.
    *   **Con éxito**: Muestra la fecha y hora de la última ejecución correcta de cada trabajo de importación. Un color de fondo rojo señaliza que la última ejecución ha fallado, pero el sello de tiempo seguirá mostrando el momento de la última ejecución con éxito como evidencia de la _frescura_ de los datos visibles en la hoja de cálculo.
    *   **Registro última ejecución**: En el caso de una ejecución fallida, aquí podrás revisar el mensaje de error correspondiente, que quizás te ayudará a diagnosticar el problema.

Puedes obtener una copia de esta [plantilla](https://docs.google.com/spreadsheets/d/1AReLiyOuTEXLkWCFhJE3nnSC-P2KvMMODYFI1weeKT0/template/preview), que ya incluye dos trabajos predefinidos, para jugar con ella y hacerte una mejor idea de su funcionamiento.

![Importador++ - plantilla - Hojas de cálculo de Google - Google Chrome_999(001)](https://user-images.githubusercontent.com/12829262/71700313-f0337c00-2dc3-11ea-83ef-f68e19dba69e.png)

# Programando los trabajos

La ejecución de los trabajos de importación o exportación de datos es manual, aunque puede programarse fácilmente gracias a los _activadores por tiempo_ que nos ofrece el editor de Google Apps Script. Estos activadores permiten desencadenar procesos de consolidación o actualización de datos a intervalos regulares, por ejemplo a una hora concreta cada día. Veamos cómo:

1.  Abre la hoja de cálculo de **Importador++**.
2.  Menú `Extensiones` →  `Apps Script.`
3.  Clic en la opción `⏰ Activadores` del menú del panel lateral izquierdo.
4.  Clic en `+Añadir activador`.
5.  Selecciona que función ejecutar: `importar` o `exportar`.
6.  Selecciona la fuente del evento: `Según tiempo`.
7.  Selecciona el tipo de activador basado en hora: _a gusto del usuario_.
8.  Selecciona el intervalo de minutos: _a gusto del usuario._
9.  `Guardar`.

![Selección_999(138)](https://user-images.githubusercontent.com/12829262/71700637-700e1600-2dc5-11ea-9c03-9dfb756cf181.png)

Puedes crear varios activadores, asociados a los procesos de importación y exportación y / o con diversas periodicidades de ejecución. Si deseas eliminar un activador, solo tienes que seguir los pasos 1 - 3 y utilizar el menú contextual para deshacerte del que te moleste.

![Selección_999(139)](https://user-images.githubusercontent.com/12829262/71700824-4f928b80-2dc6-11ea-986a-dff34e3452c8.png)

> ¿Te animas a mejorar **Importador++** :muscle: y dotarlo de una pequeña interfaz de usuario para facilitar la gestión de activadores? El código fuente, bajo licencia GNU GPL v3, es todo tuyo.

# Algunas consideraciones

Cosas que debes tener en cuenta:

*   A diferencia de lo que ocurre con `IMPORTRANGE`, los datos contenidos en los rangos de origen y destino son aquí totalmente independientes y pueden modificarse de manera aislada. Solo se sincronizan cuando se realizan con éxito operaciones de importación o exportación, manuales o programadas.
*   El usuario que ejecuta manualmente la importación / exportación (o crea un activador) debe tener los permisos de acceso necesarios sobre las hojas de cálculo de las que se obtienen (lectura) / hacia las que se empujan (edición) datos.
*   Si utilizas rangos de datos muy grandes es posible que el proceso de importación / exportación se demore bastante cuando se activan las opciones de ajustar el tamaño de filas y columnas.
*   Hablando de filas y columnas, sus tamaños solo se aplican en el rango destino cuando en el de origen se han modificado los valores por defecto. Por otro lado, dado que los trabajos se procesan secuencialmente, es posible que se produzcan interferencias si los rangos respectivos comparten filas o columnas.
*   El formato de texto enriquecido intra-celda solo se copia cuando se seleccionan simultaneamente al menos las opciones de propagación de _formato_ y _fórmulas_. Esto es debido a una cuestión técnica un tanto rebuscada relacionada con el servicio Apps Script de hojas de cálculo que por el momento no he sido capaz de resolver de modo totalmente satisfactorio. Quizás un día de estos me anime a contarlo...

# Licencia

© 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia GNU GPL v3.
