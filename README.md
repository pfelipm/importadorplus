# Importador+
**Importador+** es una plantilla de hoja de cálculo de Google potenciada mediante Apps Script que permite automatizar e incluso programar, usando activadores (*triggers*) establecidos manualmente, el intercambio de datos con otras hojas de cálculo.

Sí, para eso ya existe así la función integrada `=IMPORTRANGE(URL; Rango)`, estarás probablemente pensado. Y tendrás razón. No obstante, esta función presenta dos particularidades:

+ No importa el formato de las celdas.
+ No importa las fórmulas, sino el resultado de su evaluación en el momento de la adquisición.

Importador+ es la modesta evolución de un pequeño script GAS creado a modo de ejemplo didáctico para el bloque de *Gestión Digital Eficaz* que impartí el pasado mes de octubre dentro del [Pograma TIE](https://u-teach.co/tie) de Uteach.

# ¿Cómo funciona?

1. Obtén una copia de la plantilla haciendo clic [aquí](https://docs.google.com/spreadsheets/d/18EQAHxf-pvijBnzjpy3M4Q_WDkFvsoO54tns5gO51yM/template/preview) y a continuación en `Utilizar plantilla`.
1. Dirígete a la hoja denominada `🔄 Importar+`.
1. Cada fila representa un *trabajo* de importación, añade tantas como necesites.
    + **Origen :arrow_right: ID o URL**: URL (tal y como aparece en el navegador, incluyendo el prefijo `https://`) de la hoja de cálculo donde se encuentran los datos o, alternativamente, simplemente su ID alfanumérico (ejemplo: `https://docs.google.com/spreadsheets/d/17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w/edit#gid=0` o `17BFKqz0SUdHrGK-Wg78kugcyUDN6PAthbh3tGUPYj0w`).
    + **Origen :arrow_right: Hoja**: Nombre de la hoja de datos (pestaña) donde se encuentran los datos a importar (ejemplo `Hoja 1`).
    + **Origen :arrow_right: Rango**: Rango de datos objetivo, se admiten rangos infinitos (ejemplo `A2:E`).
    + **Destino :arrow_right: Hoja**: Nombre de la hoja, dentro de la HdC de Importador+, donde se depositarán los datos importados (ejemplo `Hoja 1`).
    + **Destino :arrow_right: Rango**: Celda superior izquierda de rango en la hoja destino donde se copiarán los valores procedentes de la hoja origen (ejemplo `A1`).
    + **Opciones de copia**: Permite escoger selectivamente qué elementos del rango de origen, además del propio contenidod e las celdas, serán copiados:
      + **Formato**: Fuente, tamaño, estilo, color de texto y fondo, bordes, alineación horizontal y vertical, rotación, ajuste de texto, formato de número, combinaciones de celdas, formato condicional, colores alternos e incluso texto enriquecido (celdas con distintos atributos en diferentes partes del texto).
      + **Fórmulas**: Si se activa, copia la fórmula en lugar del resultado de su evaluación en la hoja de origen.
      + **Anchura**: Ancho de columnas.
      + **Altura**: Alto de filas.
      + **Notas**: Notas insertadas en las celdas.







Copyright (C) 2020 Pablo Felip Monferrer ([@pfelipm](https://twitter.com/pfelipm)). Se distribuye bajo licencia GNU GPL v3.
