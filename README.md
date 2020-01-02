# ¿Qué es Importador+?

**Importador+** es la modesta evolución de un pequeño script GAS creado a modo de ejemplo didáctico de uso de la API de hojas de cálculo de Google en el contexto del bloque de *Gestión Digital Eficaz* que impartí el pasado mes de octubre dentro del [Pograma TIE](https://u-teach.co/tie) de Uteach. Se trata de una sencilla plantilla de hoja de cálculo de Google que permite consolidar información dispersa en distintas hojas de cálculo.

Probablemente estarás pensando en que para hacer algo parecido ya existe la función integrada `=IMPORTRANGE(URL; Rango)`. Y tendrás razón. No obstante, `IMPORTRANGE` presenta algunas particularidades:

+ No importa el formato de las celdas, solo sus valores numéricos o de texto.
+ No importa las fórmulas, sino el resultado de su evaluación en el momento de la adquisición.
+ La conexión con las hojas de datos de las que se adquiere información debe ser autorizada previamente.
+ El intercambio de información es unidireccional, a menos que se combinen diversas funciones `IMPORTRANGE`, lo que puede llevar a bonitas paradojas circulares.
+ Los datos se actualizan automáticamente y casi casi en tiempo real, a todos los efectos los rangos de datos de origen y destino están vinculados, no replicados.

¿Quiero esto decir que **Importador+** es preferible a `IMPORTRANGE`? En absoluto. Simplemente, funciona de un modo diferente que puede resultar ventajoso en determinadas circunstancias.

# ¿Cómo funciona?

1. Obtén una copia de la plantilla de **Importador+** haciendo clic [aquí](https://docs.google.com/spreadsheets/d/18EQAHxf-pvijBnzjpy3M4Q_WDkFvsoO54tns5gO51yM/template/preview) y a continuación en `Utilizar plantilla`.

![Importador++ - plantilla - Hojas de cálculo de Google - Google Chrome_999](https://user-images.githubusercontent.com/12829262/71700231-96cb4d00-2dc3-11ea-8b45-ac6e52fdc83d.png)

1. Dirígete a la hoja denominada `🔄 Importar+`.
1. Cada fila representa un *trabajo* de importación, añade tantas como necesites.
    + **Origen / ID o URL**: URL (tal y como aparece en el navegador, incluyendo el prefijo `https://`) de la hoja de cálculo donde se encuentran los datos o, alternativamente, su ID alfanumérico (ejemplo: `https://docs.google.com/spreadsheets/d/17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w/edit#gid=0` o `17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w`).
    + **Origen / Hoja**: Nombre de la hoja de datos (pestaña) donde se encuentran los datos a importar (ejemplo `Hoja 1`).
    + **Origen / Rango**: Rango de datos objetivo, se admiten rangos infinitos (ejemplo `A2:E`).
    + **Destino / Hoja**: Nombre de la hoja, siemppre dentro de la HdC de **Importador+**, donde se depositarán los datos importados (ejemplo `Hoja 1`).
    + **Destino / Rango**: Celda superior izquierda del rango en la hoja destino donde se copiarán los valores procedentes de la hoja de cálculo origen (ejemplo `A1`).
    + **Opciones de copia**: Estas casillas de verificación permiten escoger selectivamente qué elementos del rango de origen, además del propio contenido de las celdas, serán copiados:
      + **Formato**: Fuente, tamaño, estilo, colores de texto y fondo, bordes, alineación horizontal y vertical, rotación, ajuste de texto, formato de número, combinaciones de celdas, formato condicional, colores alternos e incluso texto enriquecido (celdas con distintos atributos en diferentes partes del texto que contienen).
      + **Fórmulas**: Si se activa, copia las fórmulasen lugar del resultado de su evaluación en la hoja de origen.
      + **Anchura**: Ancho de columnas.
      + **Altura**: Alto de filas.
      + **Notas**: Notas insertadas en las celdas.
1. Asegúrate de marcar la casilla de verificación en la columna `Activar` para que el trabajo de importación sea procesado.
1. Utiliza los comandos del menú `🔄 Importador+` para **importar** (recibir datos de las HdC origen) o **exportar** (empujar datos desde la plantilla a sus HdC originales).
1. Las columnas L y M se actualizan tras cada ejecución de los trabajos programados.
    + **Con éxito**: Muestra la fecha y hora de la última ejecución correcta de cada trabajo de importación. Un color de fondo rojo indica que la última ejecución ha fallado, pero el sello de tiempo seguirá mostrando el momento de la última ejecución con éxito como referencia de la *frescura* de los datos en la hoja de cálculo.
    + **Registro última ejecución**: En el caso de una ejecución fallida, aquí podrás revisar el mensaje de error correspondiente que quizás te ayude a diagnosticar el problema.

Puedes hacerte una copia de esta [plantilla](https://docs.google.com/spreadsheets/d/1AReLiyOuTEXLkWCFhJE3nnSC-P2KvMMODYFI1weeKT0/template/preview) con dos trabajos predefinidos para jugar con ella y hacerte una idea mejor de su funcionamiento.

# Algunas consideraciones









Copyright (C) 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia GNU GPL v3.
