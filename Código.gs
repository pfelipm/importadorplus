/**
 * @NotOnlyCurrentDoc
 */
 
/*
 Este script recorre la hoja definida en la variable "HOJA_IMPORTAR",
 recupera los datos almacenados en las hojas de cálculo indicadas (hoja, rango)
 y los copia en la posición indicada (hoja, rango) de la hoja de cálculo actual.
 
 *** o ***
 
 Empuja los datos en los rangos de la HdC actual a sus HdC y rangos de origen.
 
 Si se desea ejecutar de manera programada a intervalos periódicos:
 
 1. Herramientas > Editor de secuencia de comandos.
 2. Editar > Activadores del proyecto activo.
 3. +Añadir activador.
 4. Selecciona que función ejecutar: importar.
 5. Selecciona la fuente del evento: Según tiempo.
 6. Selecciona el tipo de activador basado en hora: a gusto del usuario.
 7. Selecciona el intervalo de minutos: a gusto del usuario.
 8. Guardar.
 
 Se pueden crear diferentes activadores temporales con distintas frecuencias.
 
 NOTAS:
   - Range >> copyTo / copyFormatToRange requieren que origen y destino se encuentren en la misma HdC.
   - Se usa CopyTo con opciones de copia dado que (a) solo se puede leer información de bordes con la API
     avanzada (cuotas) y (b) no es posible discriminar en un rango celdas con números o texto para aplicar
     formato numérico o enriquecido de manera individual (sin leer y escribir celda a celda, que es muy lento.
   - Cuidado con rangos extensos / infinitos al copiar tamaño filas / columnas, puede tardar.
   - El ajuste de tamaño fil / col solo tiene efecto si se ha modificado manualmente en rango origen.
   - Los ajustes de texto enriquecido intra-celda solo se aplican al copiar cuando se leccionan formato, fórmulas y notas
     (mediante un "apaño", ver comentarios más abajo, esta restricción se limita únicamente a formato y fórmulas).
  
  Versión 1.0 (enero 2020) · Copyright (C) 2020 Pablo Felip (@pfelipm) · Se distribuye bajo licencia GNU GPL v3.
*/

function onOpen() {
  
  SpreadsheetApp.getUi().createMenu('🔄 Importador+')
    .addItem('⬇️️️ Importar rangos', 'importar')
    .addItem('️⬆️ Exportar rangos', 'exportar')
    .addItem('💡 Acerca de', 'acercaDe') 
    .addToUi();

}

function acercaDe() {

  // Mostrar la ventana acerca de...

  var panel = HtmlService.createHtmlOutputFromFile('acercaDe')
    .setWidth(420)
    .setHeight(220)
  SpreadsheetApp.getUi().showModalDialog(panel, '💡 Acerca de Importador+');

}

function importar() {

  procesar({'proceso':'importar'});

}

function exportar() {

  procesar({'proceso':'exportar'});

}

function procesar(modo) {
  
  // Constantes de localización de la tabla de configuración del importador
  
  var HOJA_IMPORTAR = '🔄 Importar+';
  var FIL_TRABAJOS = 3;
  var COL_ACTIVADO_B = 1;
  var COL_ID = 2;
  var COL_HOJA_ORIGEN = 3;
  var COL_RANGO_ORIGEN = 4;
  var COL_HOJA_DESTINO = 5;
  var COL_RANGO_DESTINO = 6;
  var COL_FORMATO_B = 7;
  var COL_FORMULAS_B = 8;
  var COL_ANCHURA = 9;
  var COL_ALTURA = 10;
  var COL_NOTAS_B = 11;
  var COL_FECHA = 12;
  var COL_ERROR = 13;
  
  // Hoja de cálculo actual
  var HDC = SpreadsheetApp.getActiveSpreadsheet();
  
  // Varibles para ejecución de trabajos
  
  var hdcDestino, hojaDestino;
  var filaInicialRangoOrigen, nFilas, nColumnas;
  var hojaTemporal;
  var activadoB, ID, hojaOrigenT, rangoOrigenT, hojaDestinoT, rangoDestinoT, formatoB, formulasB, anchuraB, alturaB, notasB;
  var filaTrabajo
  var rangoImportar;
  
  // Rangos auxiliares de idénticas dimensiones
  
  var rangoDatosOrigen, rangoDatosDestino;
  
  // Matrices de elementos importados / exportados
  
  var notas = [];
  var alturafilasRango = [];
  
  // Variables para mostrar resultado de operación
  
  var resultado;
  var error;

  // Control de errores
  
  var errorLocal, errorGlobal = false;
  
  // Lista de rangos a importar o exportar
  
  rangoImportar = HDC.getSheetByName(HOJA_IMPORTAR).getDataRange().getValues();
  
  // Descartar filaTrabajos con encabezados de la tabla de parámetros de importación
  
  rangoImportar = rangoImportar.slice(FIL_TRABAJOS - 1);
  
  // Recorrer todos los rangos (filaTrabajos) a importar o exportar
  
  for (filaTrabajo = 0; filaTrabajo < rangoImportar.length; filaTrabajo++) {

    // Leer casilla de verificación de estado activado e ID de la HdC a importar
    
    activadoB = rangoImportar[filaTrabajo][COL_ACTIVADO_B -1];
    ID = rangoImportar[filaTrabajo][COL_ID - 1];
    
    // Si no hay ID o no marcado para importación, nos saltamos el rango a importar de la filaTrabajo actual
    
    if (ID == '' || activadoB == false) {continue;}
    
    // Ajuste de origen y destino en función de importación / exportación
    
    if (modo['proceso'] == 'importar') {
      hojaOrigenT = rangoImportar[filaTrabajo][COL_HOJA_ORIGEN - 1];
      rangoOrigenT = rangoImportar[filaTrabajo][COL_RANGO_ORIGEN - 1];
      hojaDestinoT = rangoImportar[filaTrabajo][COL_HOJA_DESTINO - 1];
      rangoDestinoT = rangoImportar[filaTrabajo][COL_RANGO_DESTINO - 1];
    }
    else if(modo['proceso'] == 'exportar') { 
      hojaOrigenT = rangoImportar[filaTrabajo][COL_HOJA_DESTINO - 1];
      rangoOrigenT = rangoImportar[filaTrabajo][COL_RANGO_DESTINO - 1];
      hojaDestinoT = rangoImportar[filaTrabajo][COL_HOJA_ORIGEN - 1];
      rangoDestinoT = rangoImportar[filaTrabajo][COL_RANGO_ORIGEN - 1];
    }
    
    // Leer opciones de copia
    
    formatoB = rangoImportar[filaTrabajo][COL_FORMATO_B - 1];
    formulasB = rangoImportar[filaTrabajo][COL_FORMULAS_B - 1];
    anchuraB = rangoImportar[filaTrabajo][COL_ANCHURA - 1];
    alturaB = rangoImportar[filaTrabajo][COL_ALTURA - 1];
    notasB = rangoImportar[filaTrabajo][COL_NOTAS_B - 1];

    // Indicador de error, suponemos inicialmente que todo OK :-) 
    
    errorLocal = false;

    try {
    
      // Bloque de código protegido para cazar posibles errores (excepciones)
    
      hojaTemporal = null;
      
      // Identificar rangos de origen y destino en función del tipo de operación (importar / exportar)
        
      // *** Importar ***
     
      if (modo.proceso == 'importar') {
      
         // Importación de datos a hdc actual vía hoja temporal
         
         hdcDestino = SpreadsheetApp.getActiveSpreadsheet();
              
         // Obtener ID de hoja origen y generar temporal en hoja destino (actual)
         
         if (ID.substring(0,8) == 'https://') {
           hojaTemporal = SpreadsheetApp.openByUrl(ID).getSheetByName(hojaOrigenT).copyTo(hdcDestino);
         }
         else {
           hojaTemporal = SpreadsheetApp.openById(ID).getSheetByName(hojaOrigenT).copyTo(hdcDestino);
         }
         
         // Ocultar hoja temporal
         
         hojaTemporal.hideSheet();        
         
         // Hoja de datos a la que se copia la información en última instancia
         
         hojaDestino = hdcDestino.getSheetByName(hojaDestinoT);         
         
         // Averiguar tamaño del rango origen para ajustar rango destino, dado que se define mediante la celda en esquina sup. izq.
     
         rangoDatosOrigen = hojaTemporal.getRange(rangoOrigenT);
         nFilas = rangoDatosOrigen.getNumRows();
         nColumnas = rangoDatosOrigen.getNumColumns();
                 
         // Expandir tamaño de rango destino para que sea igual al de origen (necesario para operaciones <> copyRange)
      
         rangoDatosDestino = hojaDestino.getRange(rangoDestinoT).offset(0, 0, nFilas, nColumnas);
      }       
      
      // *** Exportar ***
      
      else if(modo.proceso == 'exportar') { 
      
         // Exportación de datos desde hdc actual a destino vía hoja temporal
         // Obtener ID de hoja destino y generar en ella temporal

        if (ID.substring(0,8) == 'https://') {hdcDestino = SpreadsheetApp.openByUrl(ID);}
        else {hdcDestino = SpreadsheetApp.openById(ID);}
        
        // Generar hoja temporal
        
        hojaTemporal = HDC.getSheetByName(hojaOrigenT).copyTo(hdcDestino);
        
        // Ocultar hoja temporal
        
        hojaTemporal.hideSheet();
        
         // Hoja de datos a la que se copia la información en última instancia
         
        hojaDestino = hdcDestino.getSheetByName(hojaDestinoT);            

        // Averiguar tamaño del rango destino para ajustar rango origen, dado que se define mediante la celda en esquina sup. izq.
        
        rangoDatosDestino = hojaDestino.getRange(rangoDestinoT);
        nFilas = rangoDatosDestino.getNumRows();
        nColumnas = rangoDatosDestino.getNumColumns();
        
        // Expandir tamaño de rango origen para que sea igual al de destino
        
        rangoDatosOrigen = hojaTemporal.getRange(rangoOrigenT).offset(0, 0, nFilas, nColumnas); 
      }          
      
      // Ahora se ejecuta el trabajo de importación / exportación,
      // con los ajustes establecidos por el usuario
      
      // Si se ha marcado la opción, leer notas de celdas de origen   
      
      if (notasB) {notas = rangoDatosOrigen.getNotes();}
            
      // Si se ha marcado la opción, leer altura de filas de origen
       
      if (alturaB) {
        alturafilasRango = [];      
        filaInicialRangoOrigen = rangoDatosOrigen.getRow();     
        for (var i = filaInicialRangoOrigen; i < filaInicialRangoOrigen + nFilas; i++) {
          alturafilasRango.push(hojaTemporal.getRowHeight(i));
        }
      }
      
      // Si se han activado todos los ajustes que incluye PASTE_NORMAL, excepto notas (parche),
      // lo hacemos de una sola vez
      
      if (formatoB && formulasB) {
      
        // PASTE_NORMAL también copia notas, puede que no las queramos, leemos las actuales en rango destino...

        if (!notasB) {notas = rangoDatosDestino.getNotes();}
      
        // El ¿único? modo de reproducir formato enriquecido es usar PASTE_NORMAL
        
        rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_NORMAL,false);
        
        // ...y ahora las restauramos (no deja de ser un apaño sucio, pero funcional)
        
        if (!notasB) {rangoDatosDestino.setNotes(notas);}
      }
      else {
  
        // Escribir valores en destino (esto se hace siempre)
        
        rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_VALUES,false);
          
        // Si se ha marcado la opción, aplicar formato (incluye colores alternos) y validación
          
        if (formatoB) {
          rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_FORMAT,false);
          
          // A pesar de lo que dice la documentación, lo anterior no aplica validación, lo haremos manualmente
          
          rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION,false);          
        }
        
        // Si se ha marcado la opción, copiar fórmulas de celdas de origen

        if (formulasB) {
          rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_FORMULA,false);
        }      
        
        // Si se ha marcado la opción, copiar notas de celdas de origen
        
        if (notasB == true) {rangoDatosDestino.setNotes(notas);}
      }
      
      // Ahora seguimos con el resto de elementos
      
      // Si se ha marcado la opción, ajustar altura de filaTrabajos
       
      if (alturaB) {
        filaInicialRangoOrigen = rangoDatosDestino.getRow();     
        for (var i = filaInicialRangoOrigen; i < filaInicialRangoOrigen + nFilas; i++) {
          hojaDestino.setRowHeight(i, alturafilasRango[i - filaInicialRangoOrigen]);
        }
      }
      
      // Si se ha marcado la opción, aplicar ajustes de ancho de columna
       
      if (anchuraB == true) {
        rangoDatosOrigen.copyTo(rangoDatosDestino, SpreadsheetApp.CopyPasteType.PASTE_COLUMN_WIDTHS,false);
      }

    }
    catch(e) {
    
      // Tratamiento de errores, el texto del error se guarda para mostrarlo en celda resultado
      
      errorGlobal = errorLocal = true;
      error = e;
    }
    
    // Eliminar hoja temporal, si existe
    
    if (hojaTemporal) {
      hdcDestino.deleteSheet(hojaTemporal);
    }  
    
    // Actualizar fecha y hora de la importación en la tabla de configuración del importador si todo OK
    
    if (errorLocal == false) {
      
      // Actualizar fecha, texto en blanco y fondo en verde, mensaje de éxito
      
      resultado = [[new Date(), '✔️ Sin errores️']];   
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_IMPORTAR).getRange(filaTrabajo + FIL_TRABAJOS, COL_FECHA, 1, 2).setValues(resultado);
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_IMPORTAR)
                                           .getRange(filaTrabajo + FIL_TRABAJOS, COL_FECHA)
                                           .setNumberFormat('dd/mm/yy HH:mm')
                                           .setBackground('Green')
                                           .setFontColor('White');
    }
    else {
      
      // No sobreescribir fecha, fondo en rojo para indicar última ejecución fallida y mostrar mensaje de error

      resultado = '️❌ ' + error;     
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_IMPORTAR).getRange(filaTrabajo + FIL_TRABAJOS, COL_ERROR).setValue(resultado);
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_IMPORTAR)
                                           .getRange(filaTrabajo + FIL_TRABAJOS, COL_FECHA)
                                           .setBackground('Red')
                                           .setFontColor('White');
    }
  }
  
  // Mensaje de alerta desactivado dado que hay clave visual en tabla de importación para señalizar errores
  
  /*if (errorGlobal == true) {
    SpreadsheetApp.getUi().alert('Se han producido errores al importar datos, revisa la tabla de trabajos:\n\n');
  }*/
  
}